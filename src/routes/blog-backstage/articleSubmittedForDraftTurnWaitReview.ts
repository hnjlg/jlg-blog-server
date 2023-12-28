import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { I_MySQLResult } from '../../types/mysqlResult';
import { sendEmail } from '../../utils/email';
import { E_User_Standing } from '../../types/standing';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/draft/turn/wait-review',
		[body('articleId').notEmpty().withMessage('articleId不能为空').isInt().withMessage('articleId must be a number')],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { articleId } = req.body;
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.split(' ')[1];
			if (token) {
				jwt.verify(token, jwtKey, (err, user: any) => {
					mysqlUTils.query<[number, E_Article_Status], [{ title: string; author: number }]>(
						`SELECT title, author FROM blog_article WHERE id = ? AND blog_article.status = ?;`,
						[Number(articleId), E_Article_Status['草稿']],
						function (articles) {
							if (user.id === articles[0].author) {
								mysqlUTils.query<[E_Article_Status, number, E_Article_Status], I_MySQLResult>(
									`UPDATE blog_article SET status = ? WHERE id = ? AND blog_article.status = ?;`,
									[E_Article_Status['待审'], Number(articleId), E_Article_Status['草稿']],
									function (results) {
										// 邮件通知所有的管理员
										mysqlUTils.query<[E_User_Standing], { email: string }[]>(
											`SELECT email FROM users WHERE valid = 1 AND standing = ?`,
											[E_User_Standing['管理员']],
											function (users) {
												users.forEach((user) => {
													if (user.email) {
														sendEmail({
															to: user.email,
															subject: '文章待审核',
															text: `文章《${articles[0].title}》待审核`,
															html: `<strong>文章<ins>《${articles[0].title}》</ins>待审核</strong>`,
														});
													}
												});
											}
										);
										return res.status(200).json({
											status: 1,
											message: 'success',
											content: results,
										});
									}
								);
							} else {
								return res.status(401).json({ status: 2, message: '只支持提审自己的草稿文章', content: null });
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
 * /blog-backstage/article/draft/turn/wait-review:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 文章提审
 *     description: |
 *       将草稿文章改为待审
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleDraftTurnWaitReviewRequest'
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
