import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { E_User_Standing } from '../../types/standing';
import { I_User } from '../../types/users';
import { I_MySQLResult } from '../../types/mysqlResult';
import { sendEmail } from '../../utils/email';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/review',
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
					mysqlUTils.query<[number], [I_User]>(`SELECT * FROM users WHERE id = ?`, [user.id], function (findUser) {
						if (findUser[0].standing === E_User_Standing['管理员']) {
							mysqlUTils.query<[number, E_Article_Status[]], [{ title: string; author: number }]>(
								`SELECT title, author FROM blog_article WHERE id = ? AND blog_article.status IN (?);`,
								[Number(articleId), [E_Article_Status['待审'], E_Article_Status['驳回']]],
								function (results) {
									if (results && results.length > 0) {
										const { title, author } = results[0] || {};
										mysqlUTils.query<[E_Article_Status, number, E_Article_Status[]], I_MySQLResult>(
											`UPDATE blog_article SET status = ? WHERE id = ? AND blog_article.status IN (?);`,
											[E_Article_Status['公开'], Number(articleId), [E_Article_Status['待审'], E_Article_Status['驳回']]],
											function (results) {
												// 邮件通知对应作者文章审核通过
												mysqlUTils.query<[number], { email: string }[]>(
													`SELECT email FROM users WHERE valid = 1 AND id = ?`,
													[Number(author)],
													function (users) {
														users.forEach((user) => {
															if (user.email) {
																sendEmail({
																	to: user.email,
																	subject: '文章审核通过',
																	text: `文章《${title}》审核通过`,
																	html: `<strong>文章<ins>《${title}》</ins>审核通过</strong>`,
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
										return res.status(401).json({ status: 2, message: '未找到对应待审或驳回的文章', content: null });
									}
								}
							);
						} else {
							return res.status(401).json({ status: 2, message: '只支持管理员进行审核文章操作', content: null });
						}
					});
				});
			}
		}
	);
};

/**
 * @swagger
 * /blog-backstage/article/review:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 文章审核通过
 *     description: |
 *       将待审文章改为审核通过
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleReviewRequest'
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
