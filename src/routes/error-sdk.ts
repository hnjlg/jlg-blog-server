import { body, validationResult } from 'express-validator';
import { SourceMapConsumer } from 'source-map';
import { isJSONString } from '../utils/validator';
import { Application, Request, Response } from 'express';
import multer from 'multer';
import http from 'http';

// 设置存储位置和文件名
const storage = multer.diskStorage({
	destination: './public', // 指定上传文件的存储路径
	filename: (req, file, callback) => {
		callback(null, new Date().getTime() + '-' + file.originalname);
	},
});

const upload = multer({
	storage: storage,
});

export default ({ app }: { app: Application }) => {
	// 处理上传的文件流
	app.post(
		'/upload',
		upload.single('video'),
		body('').custom((value, { req }) => {
			if (!req.file) {
				throw new Error('video参数类型不是文件流');
			}
			return true;
		}),
		(req, res) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			res.status(200).json({
				status: 1,
				message: 'success',
				content: req.file,
			});
		}
	);

	/**
	 * @swagger
	 * /api/getPetList:
	 *  get:
	 *   tags:
	 *     - pet
	 *   description: Multiple name values can be provided with comma separated strings
	 *   parameters:
	 *     - name: name
	 *       in: query
	 *       description: name values that need to be considered for filter
	 *       required: false
	 *   responses:
	 *     '200':
	 *       description: successful operation
	 *     '400':
	 *       description: Invalid name value
	 */

	app.post(
		'/sourceMap',
		[
			body('fileUrl').isURL().withMessage('fileUrl is not a valid URL'),
			body('err.lineno').isInt().withMessage('err.lineno must be a number'),
			body('err.colno').isInt().withMessage('err.colno must be a number'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			http.get(req.body.fileUrl, (response) => {
				let data = '';
				response.on('data', (chunk) => {
					data += chunk;
				});
				response.on('end', () => {
					const sourceMapFile = data;
					if (!isJSONString(sourceMapFile)) {
						res.status(200).json({
							status: 1,
							message: 'success',
							content: null,
						});
						return;
					}
					// 创建 SourceMapConsumer 对象
					SourceMapConsumer.with(sourceMapFile, null, (consumer) => {
						// 获取原始源代码位置信息
						const originalPosition = consumer.originalPositionFor({
							line: req.body.err.lineno, // 错误行号
							column: req.body.err.colno, // 错误列号
						});
						res.status(200).json({
							status: 1,
							message: 'success',
							content: originalPosition,
						});
					});
				});
			});
		}
	);
};
