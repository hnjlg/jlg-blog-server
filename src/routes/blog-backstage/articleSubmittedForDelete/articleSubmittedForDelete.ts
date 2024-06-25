import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/delete',
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
					mysqlUTils.query<
						[number, number],
						[
							{
								count: number;
							},
						]
					>(`SELECT COUNT(*) AS count FROM blog_article WHERE id = ? AND blog_article.author = ?`, [Number(articleId), user.id], function (results) {
						if (results && results[0].count > 0) {
							mysqlUTils.query<[number, number], I_MySQLResult>(
								`UPDATE blog_article SET valid = 0 WHERE id = ? AND blog_article.author = ?;`,
								[Number(articleId), user.id],
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
								message: '未找到对应作者的文章',
								content: null,
							});
						}
					});
				});
			}
		}
	);
};