import { Application, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import mysqlUTils from '../../../utils/mysql';
import { E_Article_Status } from '../../../types/articleStatus';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog/articles/query/byTagId',
		[
			body('tagId').notEmpty().withMessage('tagId 参数不能为空'),
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
		],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { tagId, pageSize, pageIndex } = req.body;
			mysqlUTils.query<[number, E_Article_Status, number, number], []>(
				`SELECT blog_article.id,blog_article.title,blog_article.reading_quantity,blog_article.add_time FROM blog_article 
				JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
				JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
				WHERE article_tags.id = ? AND blog_article.valid = 1 AND blog_article.status = ? LIMIT ? OFFSET ?;`,
				[Number(tagId), E_Article_Status['公开'], Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[number, E_Article_Status], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM blog_article
						JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
						JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
						WHERE article_tags.id = ? AND blog_article.valid = 1 AND blog_article.status = ?;`,
						[Number(tagId), E_Article_Status['公开']],
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
