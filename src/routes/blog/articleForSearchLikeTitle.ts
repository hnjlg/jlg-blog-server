import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

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
			mysqlUTils.query<[string, number, number], []>(
				`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value, 
				GROUP_CONCAT(article_tags.tag_name) AS tags FROM blog_article 
				JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
				JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
				LEFT JOIN article_status ON blog_article.status = article_status.status_value 
				WHERE blog_article.valid = 1 AND blog_article.title LIKE ?
				GROUP BY blog_article.id 
				LIMIT ? OFFSET ?;`,
				[`%${title}%`, Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[string], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM blog_article 
						WHERE blog_article.valid = 1 AND blog_article.title LIKE ?;`,
						[`%${title}%`],
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

/**
 * @swagger
 * /blog/article/like/title/query:
 *   post:
 *     tags: ['blog']
 *     summary: 通过文章标题查询文章列表
 *     description: |
 *       通过文章标题查询文章列表，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogArticleLikeTitleRequest'
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
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 数据量
 *                     arr:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BlogArticleLikeTitleResponse'
 */
