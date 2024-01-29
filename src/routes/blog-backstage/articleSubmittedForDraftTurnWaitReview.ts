import { Application, Request, Response } from 'express';
import mysqlUtils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { I_MySQLResult } from '../../types/mysqlResult';
import { sendEmail } from '../../utils/email';
import { E_User_Standing } from '../../types/standing';
import { sendNewMessage } from '../../socket/system-msg/sendNewMessage';
import dayjs from 'dayjs';
import { E_Is_Receive_Email } from '../../types/is_receive_email';

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
			const token = req.headers['authorization'];
			if (token) {
				jwt.verify(token, jwtKey, (err, user: any) => {
					mysqlUtils.query<[number, E_Article_Status[]], [{ title: string; author: number }]>(
						`SELECT title, author FROM blog_article WHERE id = ? AND blog_article.status IN (?);`,
						[Number(articleId), [E_Article_Status['草稿'], E_Article_Status['私有']]],
						function (articles) {
							if (user.id === articles[0]?.author) {
								mysqlUtils.query<[E_Article_Status, number, E_Article_Status[]], I_MySQLResult>(
									`UPDATE blog_article SET status = ? WHERE id = ? AND blog_article.status IN (?);`,
									[E_Article_Status['待审'], Number(articleId), [E_Article_Status['草稿'], E_Article_Status['私有']]],
									function (results) {
										// 邮件通知所有的管理员
										mysqlUtils.query<
											[E_User_Standing],
											{ id: number; email: string; standing: E_User_Standing; is_receive_email: E_Is_Receive_Email }[]
										>(
											`SELECT id, email, standing, is_receive_email FROM users WHERE valid = 1 AND standing = ?`,
											[E_User_Standing['管理员']],
											function (users) {
												users.forEach((user) => {
													if (user.email && user.is_receive_email === E_Is_Receive_Email.接收邮件) {
														sendEmail({
															to: user.email,
															subject: '文章待审核',
															text: `文章《${articles[0].title}》待审核`,
															html: `<strong>文章<ins>《${articles[0].title}》</ins>待审核</strong>`,
														});
													}
													const msg = {
														id: 0,
														title: '文章待审核',
														content: `文章《${articles[0].title}》待审核`,
														sendTime: dayjs().format(),
														isRead: false,
													};
													mysqlUtils.query<[number, string, string], I_MySQLResult>(
														`INSERT INTO system_msg (receiver, msg_content, msg_title) VALUES (?, ?, ?)`,
														[user.id, msg.content, msg.title],
														function (result) {
															msg.id = result.insertId;
															sendNewMessage(user.id, user.standing, msg);
														}
													);
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
 *       将草稿或者私有文章改为待审
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
