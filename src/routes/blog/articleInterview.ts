import { Application, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import mysqlUTils from '../../utils/mysql';
import { E_Article_Status } from '../../types/articleStatus';
import { I_MySQLResult } from '../../types/mysqlResult';

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
			mysqlUTils.query<
				[number, E_Article_Status],
				[
					{
						count: number;
					},
				]
			>(
				'SELECT COUNT(*) AS count FROM blog_article WHERE id = ? AND blog_article.status = ?',
				[Number(articleId), E_Article_Status['公开']],
				function (results) {
					if (results && results[0].count > 0) {
						mysqlUTils.query<[number, E_Article_Status], I_MySQLResult>(
							'UPDATE blog_article SET reading_quantity = reading_quantity + 1 WHERE id = ? AND blog_article.status = ?',
							[Number(articleId), E_Article_Status['公开']],
							function (results) {
								return res.status(200).json({
									status: 1,
									message: 'success',
									content: results,
								});
							}
						);
					} else {
						return res.status(401).json({
							status: 2,
							message: '未找到对应公开的文章',
							content: null,
						});
					}
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
 *             $ref: '#/components/schemas/BlogArticleInterviewRequest'
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
 *                     $ref: '#/components/schemas/MySQLResult'
 */
