import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';

interface I_Blog_Article {
	id: number;
	title: string;
	content: string;
	reading_quantity: number;
	add_time: string;
	status_name: string;
	status_value: number;
	tags: string;
	author: number;
}

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog/article/query/for/articleId',
		[body('articleId').notEmpty().withMessage('articleId cannot be empty').isInt().withMessage('articleId must be a number')],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			const { articleId } = req.body;
			mysqlUTils.query<[number], I_Blog_Article[]>(
				`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, blog_article.author, users.user_name AS author_name, 
				blog_article.content, blog_article.content_html, blog_article.add_time, article_status.status_name, 
				article_status.status_value, GROUP_CONCAT(article_tags.tag_name) AS tags FROM blog_article 
                JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
                JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
                LEFT JOIN article_status ON blog_article.status = article_status.status_value
				LEFT JOIN users ON blog_article.author = users.id
                WHERE blog_article.valid = 1 AND blog_article.id = ? 
                GROUP BY blog_article.id, blog_article.title, blog_article.content, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value;`,
				[Number(articleId)],
				function (results) {
					if (results[0] && results[0].status_value !== 3) {
						return res.status(401).json({
							status: 2,
							message: '当前游客不支持查看未公开的文章',
							content: null,
						});
					} else {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results[0],
						});
					}
				}
			);
		}
	);
};
