import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blob/article/query/for/articleId',
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
			mysqlUTils.query<[number], []>(
				`SELECT blob_article.id, blob_article.title, blob_article.content, blob_article.reading_quantity, blob_article.add_time, article_status.status_name, article_status.status_value, GROUP_CONCAT(article_tags.tag_name) AS tags 
                FROM blob_article 
                JOIN article_tag_connection ON blob_article.id = article_tag_connection.article_id 
                JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
                LEFT JOIN article_status ON blob_article.status = article_status.status_value 
                WHERE blob_article.valid = 1 AND blob_article.id = ? 
                GROUP BY blob_article.id, blob_article.title, blob_article.content, blob_article.reading_quantity, blob_article.add_time, article_status.status_name, article_status.status_value;`,
				[Number(articleId)],
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
 * /blob/article/query/for/articleId:
 *   post:
 *     tags: ['blob']
 *     summary: 获取文章详情通过文章id
 *     description: |
 *       获取文章详情
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: integer
 *                 description: 文章id
 *             example:
 *               articleId: 1
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 文章id
 *                       title:
 *                         type: string
 *                         description: 文章标题
 *                       content:
 *                         type: string
 *                         description: 文章内容
 *                       reading_quantity:
 *                         type: integer
 *                         description: 文章阅读量
 *                       add_time:
 *                         type: string
 *                         format: date-time
 *                         description: 文章发布时间
 *                       tags:
 *                         type: string
 *                         description: 文章标签
 */
