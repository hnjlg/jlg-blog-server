import { Application, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.get(
		'/article-tags/tags/queryArticleSingleByTagId',
		query('tag_id').notEmpty().withMessage('tag_id cannot be empty').isInt().withMessage('tag_id must be number'),
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { tag_id } = req.query;
			mysqlUTils.query<
				[number],
				[
					{
						id: number;
						title: string;
						add_time: string;
						user_name: string;
					},
				]
			>(
				`SELECT t2.id, t2.title, t2.add_time, users.user_name FROM (
					SELECT * 
					FROM (
							SELECT blog_article.id, blog_article.add_time, blog_article.author, blog_article.title, article_tag_connection.tag_id
							FROM article_tag_connection
							JOIN article_tags ON article_tags.id = article_tag_connection.tag_id
							JOIN blog_article ON blog_article.id = article_tag_connection.article_id
							GROUP BY blog_article.id
							HAVING COUNT(*) = 1
					) AS t 
					WHERE t.tag_id = ?
				) AS t2 LEFT JOIN users ON t2.author = users.id
				;
				`,
				[Number(tag_id)],
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

/**
 * @swagger
 * /article-tags/tags/queryArticleSingleByTagId:
 *   get:
 *     tags: ['article-tags']
 *     summary: 根据标签id查找只有该标签的文章
 *     description: |
 *      根据标签id查找只有该标签的文章
 *     parameters:
 *       - in: query
 *         name: tag_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 文章标签id
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QueryArticleSingleByTagIdResponse'
 */
