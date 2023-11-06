import { body, validationResult } from 'express-validator';
import { SourceMapConsumer } from 'source-map';
import { isJSONString } from '../../utils/validator';
import { Application, Request, Response } from 'express';
import http from 'http';

export default ({ app }: { app: Application }) => {
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
