import { Application, Request, Response } from 'express';
import { E_Article_Status } from '../../../types/articleStatus';
import { query, validationResult } from 'express-validator';
import mysqlUTils from '../../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.get(
		'/blog/hot/tags/query',
		query('limit').notEmpty().withMessage('limit 参数不能为空').isInt({ min: 1 }).withMessage('limit 参数必须为大于 0 的整数'),
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { limit } = req.query;
			mysqlUTils.query<[E_Article_Status, number], []>(
				`SELECT article_tags.id, article_tags.tag_name, COUNT(article_tag_connection.article_id) AS article_count FROM article_tags 
				JOIN article_tag_connection ON article_tags.id = article_tag_connection.tag_id
				LEFT JOIN blog_article ON article_tag_connection.article_id = blog_article.id
				WHERE blog_article.valid = 1 AND blog_article.status = ?
				GROUP BY article_tags.id 
				ORDER BY article_count DESC 
				LIMIT ?;`,
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
