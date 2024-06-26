import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../../types/articleStatus';
import jwt from 'jsonwebtoken';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/draft/add',
		[
			body('title').notEmpty().withMessage('标题title不能为空'),
			body('content').notEmpty().withMessage('文章内容content不能为空'),
			body('content_html').notEmpty().withMessage('文章内容content_html不能为空'),
			body('article_tree_id').notEmpty().withMessage('文章树articleTreeId不能为空').isInt().withMessage('article_tree_id must be a number'),
			body('articleTags').custom((value) => {
				if (!Array.isArray(value)) {
					throw new Error('Value must be an array');
				}
				for (let i = 0; i < value.length; i++) {
					if (typeof value[i] !== 'number' && !Number.isInteger(value[i])) {
						throw new Error('Array values must be numbers');
					}
				}
				return true;
			}),
		],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { title, content, content_html, article_tree_id, articleTags } = req.body;
			const token = req.headers['authorization'];
			if (token) {
				jwt.verify(token, jwtKey, (err, user: any) => {
					mysqlUTils.query<
						[number],
						[
							{
								count: number;
							},
						]
					>('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [Number(user.id)], function (results) {
						if (results && results[0].count > 0) {
							mysqlUTils.query<
								[number],
								[
									{
										count: number;
									},
								]
							>('SELECT COUNT(*) AS count FROM article_tree WHERE id = ?;', [Number(article_tree_id)], function (results) {
								if (results && results[0].count > 0) {
									mysqlUTils.query<[number[]], []>(`SELECT * FROM article_tags WHERE id IN (?)`, [articleTags], function (results) {
										if (results && results.length === articleTags.length) {
											mysqlUTils.query<[string, string, string, number, number, number], I_MySQLResult>(
												`INSERT blog_article(title,content,content_html,status,author,article_tree_id) VALUES (?,?,?,?,?,?);`,
												[title, content, content_html, E_Article_Status['草稿'], Number(user.id), Number(article_tree_id)],
												function (results) {
													if (results && results.insertId) {
														mysqlUTils.query<[], I_MySQLResult>(
															`INSERT INTO article_tag_connection(article_id,tag_id) values ${articleTags.map((item: number) => {
																return `(${results.insertId},${item})`;
															})}`,
															[],
															function () {
																return res.status(200).json({
																	status: 1,
																	message: 'success',
																	content: results,
																});
															}
														);
													}
												}
											);
										}
									});
								} else {
									return res.status(401).json({
										status: 2,
										message: '文章树id不存在',
										content: results,
									});
								}
							});
						} else {
							return res.status(401).json({
								status: 1,
								message: '用户id不存在',
								content: results,
							});
						}
					});
				});
			}
		}
	);
};
