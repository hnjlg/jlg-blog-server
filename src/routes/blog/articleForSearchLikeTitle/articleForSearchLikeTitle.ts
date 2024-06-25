import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../../types/articleStatus';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog/article/like/title/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
			body('title').notEmpty().withMessage('pageIndex cannot be empty'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			const { pageSize, pageIndex, title } = req.body;
			mysqlUTils.query<[string, E_Article_Status, number, number], []>(
				`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, blog_article.add_time,
				blog_article.author, article_status.status_name, article_status.status_value, users.user_name AS author_name, 
				GROUP_CONCAT(article_tags.tag_name) AS tags FROM blog_article 
				JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
				JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
				LEFT JOIN article_status ON blog_article.status = article_status.status_value
				LEFT JOIN users ON blog_article.author = users.id 
				WHERE blog_article.valid = 1 AND blog_article.title LIKE ? AND blog_article.status = ?
				GROUP BY blog_article.id 
				LIMIT ? OFFSET ?;`,
				[`%${title}%`, E_Article_Status['公开'], Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[string, E_Article_Status], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM blog_article 
						WHERE blog_article.valid = 1 AND blog_article.title LIKE ? AND blog_article.status = ?;`,
						[`%${title}%`, E_Article_Status['公开']],
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
	);
};
