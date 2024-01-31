import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog-backstage/article/query/for/author',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
			body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be a number'),
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

			const { pageSize, pageIndex, author } = req.body;
			mysqlUTils.query<[number, number, number], []>(
				`SELECT blog_article.id, blog_article.title, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value, GROUP_CONCAT(article_tags.tag_name) AS tags 
                FROM blog_article 
                JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
                JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
                LEFT JOIN article_status ON blog_article.status = article_status.status_value 
                WHERE blog_article.valid = 1 AND blog_article.author = ? 
                GROUP BY blog_article.id, blog_article.title, blog_article.content, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value 
				ORDER BY blog_article.add_time DESC
                LIMIT ? OFFSET ?;`,
				[Number(author), Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[number], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM blog_article 
						WHERE blog_article.valid = 1 AND blog_article.author = ?;`,
						[Number(author)],
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
 * /blog-backstage/article/query/for/author:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 获取文章列表通过作者id
 *     description: |
 *       获取文章，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleQueryForAuthorRequest'
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
 *                         $ref: '#/components/schemas/BlogBackstageArticleQueryForAuthorResponse'
 */
