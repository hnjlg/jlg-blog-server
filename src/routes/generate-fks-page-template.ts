import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { Application, Request, Response } from 'express';
import { validationResult, checkSchema } from 'express-validator';
import { createNullFile, zipFile } from '../utils/file';

const generateFile = (oldFileName: string, newFileName: string, templateData: object, folderName: string, callback: () => void) => {
	fs.readFile(path.join(__dirname, `../../template/${oldFileName}`), 'utf8', (err, template) => {
		if (err) throw err;

		// 替换模板变量
		const output = ejs.render(template, templateData);

		createNullFile(path.join(__dirname, `../../public/${folderName}/${newFileName}`));

		// 生成最终文件
		fs.writeFile(path.join(__dirname, `../../public/${folderName}/${newFileName}`), output, 'utf8', (err) => {
			callback();
			if (err) throw err;
		});
	});
};

export default ({ app }: { app: Application }) => {
	// 处理下载文件夹的请求
	app.get(
		'/download/:folderName',
		checkSchema(
			{
				folderName: { notEmpty: { bail: true }, errorMessage: '文件名不能为空' },
			},
			['query']
		),
		(req: Request, res: Response) => {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			const folderName = req.params.folderName;

			const folderPath = path.join(__dirname, '../../public', folderName);

			// 检查文件夹是否存在
			if (!fs.existsSync(folderPath)) {
				return res.status(200).json({
					status: 2,
					message: 'failed',
					content: '文件不存在',
				});
			}

			// 设置下载响应头
			res.setHeader('Content-Disposition', `attachment; filename=${folderName}.zip`);

			zipFile(folderName, folderPath, (zipPath: string) => {
				res.sendFile(zipPath, {}, (err) => {
					if (err) {
						res.status(200).json({
							status: 2,
							message: 'failed',
							content: '文件下载失败',
						});
					}
					// 删除临时zip文件与源文件
					fs.unlinkSync(zipPath);
				});
			});
		}
	);

	app.post(
		'/generate/:folderName',
		checkSchema(
			{
				folderName: { notEmpty: { bail: true }, errorMessage: '文件名不能为空' },
			},
			['query']
		),
		(req: Request, res: Response) => {
			const result = validationResult(req);
			if (result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}
			const templateData = req.body;
			const folderName = req.params.folderName;
			const fn = [
				{
					oldFile: 'index.vue.d.ts.ejs',
					newFile: 'index.vue.d.ts',
				},
				{
					oldFile: 'type.ts.ejs',
					newFile: 'type.ts',
				},
				{
					oldFile: 'view.config.ts.ejs',
					newFile: 'view.config.ts',
				},
				{
					oldFile: 'index.scss.ejs',
					newFile: 'index.scss',
				},
				{
					oldFile: 'index.vue.ejs',
					newFile: 'index.vue',
				},
				{
					oldFile: 'hooks/events.ts.ejs',
					newFile: 'hooks/events.ts',
				},
				{
					oldFile: 'hooks/tableJsons.ts.ejs',
					newFile: 'hooks/tableJsons.ts',
				},
				{
					oldFile: 'hooks/variables.ts.ejs',
					newFile: 'hooks/variables.ts',
				},
			].reduce(
				(acc, cur) => {
					return (callback: () => void) => generateFile(cur.oldFile, cur.newFile, templateData, folderName, () => acc(callback));
				},
				(callback: () => void) => {
					callback();
				}
			);
			fn(() =>
				res.status(200).json({
					status: 1,
					message: 'success',
					content: null,
				})
			);
		}
	);
};
