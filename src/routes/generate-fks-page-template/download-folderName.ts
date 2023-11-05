import { Application, Request, Response } from 'express';
import { validationResult, checkSchema } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { zipFile } from '../../utils/file';

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
};
