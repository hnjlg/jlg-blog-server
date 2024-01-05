import { Application } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';

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
		'/file/upload',
		upload.single('file'),
		body('').custom((value, { req }) => {
			if (!req.file) {
				throw new Error('file参数类型不是文件流');
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
};

/**
 * @swagger
 * /file/upload:
 *   post:
 *     tags: ['file']
 *     summary: 文件上传
 *     description: |
 *       上传
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileUploadRequest'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: 1表示成功，2表示失败
 *                 message:
 *                   type: string
 *                   description: success表示成功，failed表示失败
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileUploadResult'
 */
