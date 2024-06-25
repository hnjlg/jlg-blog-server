import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { query, validationResult } from 'express-validator';
import { E_Article_Status } from '../../../types/articleStatus';

export default ({ app }: { app: Application }) => {
	app.get(
		'/blog/hot/article/query',
		query('limit').notEmpty().withMessage('limit 参数不能为空').isInt({ min: 1 }).withMessage('limit 参数必须为大于 0 的整数'),
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { limit } = req.query;
			mysqlUTils.query<[number, number], []>(
				`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, blog_article.add_time, 
				blog_article.author, users.user_name AS author_name,
				GROUP_CONCAT(article_tags.tag_name) AS tags FROM blog_article 
				JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
				JOIN article_tags ON article_tag_connection.tag_id = article_tags.id
				LEFT JOIN users ON blog_article.author = users.id
				WHERE blog_article.valid = 1 AND blog_article.status = ?
				GROUP BY blog_article.id ORDER BY reading_quantity DESC LIMIT ?`,
				[E_Article_Status['公开'], Number(limit)],
				function (results) {
					return res.status(200).json({
						status: 1,
						message: 'success',
						content: results,
					});
				}
			);
		}
	);
};
