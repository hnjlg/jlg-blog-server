import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { E_User_Standing } from '../../../types/standing';
import { E_Article_Status } from '../../../types/articleStatus';
import { I_User } from '../../../types/users';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/all/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { pageSize, pageIndex } = req.body;
			const token = req.headers['authorization'];
			if (token) {
				jwt.verify(token, jwtKey, (err, user: any) => {
					mysqlUTils.query<[number], [I_User]>(`SELECT * FROM users WHERE id = ?`, [user.id], function (findUser) {
						if (findUser[0].standing === E_User_Standing['管理员']) {
							mysqlUTils.query<[E_Article_Status[], number, number], []>(
								`SELECT 
								blog_article.id, 
								blog_article.title,
								blog_article.reading_quantity, 
								blog_article.add_time,
								blog_article.author,
								article_status.status_name,
								article_status.status_value,
								users.user_name AS author_name,
								t.tag_name AS tags FROM 
							(SELECT 
								blog_article.id,
								GROUP_CONCAT(article_tags.tag_name) AS tag_name,
								GROUP_CONCAT(article_tags.id) AS tag_id
							FROM
								blog_article
									JOIN
							  article_tag_connection ON blog_article.id = article_tag_connection.article_id
								JOIN
								article_tags ON article_tag_connection.tag_id = article_tags.id
							WHERE
							  blog_article.valid = 1
							GROUP BY blog_article.id) as t 
							JOIN blog_article ON t.id = blog_article.id
							LEFT JOIN article_status ON blog_article.status = article_status.status_value
							LEFT JOIN users ON blog_article.author = users.id
							WHERE blog_article.valid = 1 AND blog_article.status IN (?) 
							LIMIT ? OFFSET ?;`,
								[
									[E_Article_Status['待审'], E_Article_Status['公开'], E_Article_Status['驳回']],
									Number(pageSize),
									(Number(pageIndex) - 1) * Number(pageSize),
								],
								function (results) {
									mysqlUTils.query<[E_Article_Status[]], [{ total: number }]>(
										`SELECT COUNT(*) AS total FROM blog_article WHERE blog_article.valid = 1 AND blog_article.status IN (?);`,
										[[E_Article_Status['待审'], E_Article_Status['公开'], E_Article_Status['驳回']]],
										function (resultsTotal) {
											return res.status(200).json({
												status: 1,
												message: 'success',
												content: { arr: results, total: resultsTotal[0].total },
											});
										}
									);
								}
							);
						} else {
							mysqlUTils.query<[number, number, number], []>(
								`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, 
								blog_article.add_time, article_status.status_name, article_status.status_value,
								blog_article.author, users.user_name AS author_name, 
								GROUP_CONCAT(article_tags.tag_name) AS tags FROM blog_article 
								JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
								JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
								LEFT JOIN article_status ON blog_article.status = article_status.status_value
								LEFT JOIN users ON blog_article.author = users.id 
								WHERE blog_article.valid = 1 AND blog_article.author = ?
								GROUP BY blog_article.id 
								ORDER BY blog_article.add_time DESC
								LIMIT ? OFFSET ?;`,
								[user.id, Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
								function (results) {
									mysqlUTils.query<[string], [{ total: number }]>(
										`SELECT COUNT(*) AS total FROM blog_article WHERE blog_article.valid = 1 AND blog_article.author = ?;`,
										[user.id],
										function (resultsTotal) {
											return res.status(200).json({
												status: 1,
												message: 'success',
												content: { arr: results, total: resultsTotal[0].total },
											});
										}
									);
								}
							);
						}
					});
				});
			}
		}
	);
};