import { Application, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog/article/articleInterview',
		[body('articleId').notEmpty().withMessage('articleId cannot be empty').isInt().withMessage('articleId must be a number')],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { articleId } = req.body;
			mysqlUTils.query<[number], []>(
				'UPDATE blog_article SET reading_quantity = reading_quantity + 1 WHERE id = ?',
				[Number(articleId)],
				function (results) {
					return res.status(200).json({
						status: 1,
						message: 'success',
						content: results,
					});
				}
			);
		}
	);
};

/**
 * @swagger
 * /blog/article/articleInterview:
 *   post:
 *     tags: ['blog']
 *     summary: 文章阅读量+1
 *     description: |
 *       文章阅读量+1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 description: 文章id
 *             example:
 *               articleId: 1
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
 *                     type: object
 *                     properties:
 *                       fieldCount:
 *                         type: integer
 *                         description: 描述
 *                       affectedRows:
 *                         type: integer
 *                         description: 描述
 *                       insertId:
 *                         type: integer
 *                         description: 描述
 *                       info:
 *                         type: string
 *                         description: 描述
 *                       serverStatus:
 *                         type: integer
 *                         description: 描述
 *                       warningStatus:
 *                         type: integer
 *                         description: 描述
 *                       changedRows:
 *                         type: integer
 *                         description: 描述
 */
