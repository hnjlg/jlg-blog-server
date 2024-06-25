import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { I_User } from '../../../types/users';
import { E_User_Standing } from '../../../types/standing';
import { I_MySQLResult } from '../../../types/mysqlResult';
import { sendEmail } from '../../../utils/email';
import { sendNewMessage } from '../../../socket/system-msg/sendNewMessage';
import dayjs from 'dayjs';
import { E_Is_Receive_Email } from '../../../types/is_receive_email';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/reject',
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
							mysqlUTils.query<
								[number, E_Article_Status[]],
								[
									{
										title: string;
										author: number;
									},
								]
							>(
								`SELECT title, author FROM blog_article WHERE id = ? AND blog_article.status IN (?);`,
								[Number(articleId), [E_Article_Status['待审'], E_Article_Status['公开']]],
								function (results) {
									if (results && results.length > 0) {
										const { title, author } = results[0] || {};
										mysqlUTils.query<[E_Article_Status, number, E_Article_Status[]], I_MySQLResult>(
											`UPDATE blog_article SET status = ? WHERE id = ? AND status IN (?);`,
											[E_Article_Status['驳回'], Number(articleId), [E_Article_Status['待审'], E_Article_Status['公开']]],
											function (results) {
												// 邮件通知对应作者文章审核通过
												mysqlUTils.query<[number], { id: number; email: string; standing: E_User_Standing; is_receive_email: E_Is_Receive_Email }[]>(
													`SELECT id, email, standing, is_receive_email FROM users WHERE valid = 1 AND id = ?`,
													[Number(author)],
													function (users) {
														users.forEach((user) => {
															if (user.email && user.is_receive_email === E_Is_Receive_Email.接收邮件) {
																sendEmail({
																	to: user.email,
																	subject: '文章驳回',
																	text: `文章《${title}》驳回`,
																	html: `<strong>文章<ins>《${title}》</ins>驳回</strong>`,
																});
															}
															const msg = {
																id: 0,
																title: '文章驳回',
																content: `文章《${title}》驳回`,
																sendTime: dayjs().format(),
																isRead: false,
															};
															mysqlUTils.query<[number, string, string], I_MySQLResult>(
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
										return res.status(401).json({
											status: 2,
											message: '未找到对应驳回、待审或者公开的文章',
											content: null,
										});
									}
								}
							);
						} else {
							return res.status(401).json({ status: 2, message: '只支持管理员进行驳回文章操作', content: null });
						}
					});
				});
			}
		}
	);
};
