import { Application, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

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
			mysqlUTils.query<[number], []>(
				'SELECT article_tags.tag_name, COUNT(article_tag_connection.article_id) AS article_count FROM article_tags JOIN article_tag_connection ON article_tags.id = article_tag_connection.tag_id GROUP BY article_tags.id ORDER BY article_count DESC LIMIT ?;',
				[Number(limit)],
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
 * /blog/hot/tags/query:
 *   get:
 *     tags: ['blog']
 *     summary: 获取热门文章标签
 *     description: |
 *       获取热门文章标签列表，并可根据参数限制查询结果数量。
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: 最多查询多少个文章标签
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
 *                       article_count:
 *                         type: integer
 *                         description: 标签下文章数量
 *                       name:
 *                         type: string
 *                         description: 标签名称
 */
