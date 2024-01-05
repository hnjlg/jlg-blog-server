import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { I_MySQLResult } from '../../types/mysqlResult';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/takeback',
		[body('articleId').notEmpty().withMessage('articleId不能为空').isInt().withMessage('articleId must be a number')],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { articleId } = req.body;
			const token = req.headers['authorization'];
			if (token) {
				jwt.verify(token, jwtKey, (err, user: any) => {
					mysqlUTils.query<[number, E_Article_Status], [{ author: number }]>(
						`SELECT author FROM blog_article WHERE id = ? AND blog_article.status = ? AND valid = 1;`,
						[Number(articleId), E_Article_Status['公开']],
						function (articles) {
							if (user.id === articles[0].author) {
								mysqlUTils.query<[E_Article_Status, number, E_Article_Status], I_MySQLResult>(
									`UPDATE blog_article SET status = ? WHERE id = ? AND blog_article.status = ?;`,
									[E_Article_Status['私有'], Number(articleId), E_Article_Status['公开']],
									function (results) {
										return res.status(200).json({
											status: 1,
											message: 'success',
											content: results,
										});
									}
								);
							} else {
								return res.status(401).json({ status: 2, message: '只支持私有自己公开的文章', content: null });
							}
						}
					);
				});
			}
		}
	);
};

/**
 * @swagger
 * /blog-backstage/article/takeback:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 文章私有
 *     description: |
 *       将公开文章改为私有
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleTakebackRequest'
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
