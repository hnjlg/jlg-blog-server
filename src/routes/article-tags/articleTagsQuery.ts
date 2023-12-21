import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tags/tags/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
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

			const { pageSize, pageIndex, tagName } = req.body;
			mysqlUTils.query<[string, number, number] | [number, number], []>(
				`SELECT article_tags.id, article_tags.tag_name FROM article_tags ${tagName !== undefined ? 'WHERE tag_name LIKE ?' : ''} LIMIT ? OFFSET ?;`,
				tagName !== undefined ? [`%${tagName}%`, pageSize, (pageIndex - 1) * pageSize] : [pageSize, (pageIndex - 1) * pageSize],
				function (results) {
					mysqlUTils.query<[string] | [], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM article_tags ${tagName !== undefined ? 'WHERE tag_name LIKE ?' : ''};`,
						tagName !== undefined ? [`%${tagName}%`] : [],
						function (resultTotal) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: { arr: results, total: resultTotal[0].total },
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
 * /article-tags/tags/query:
 *   post:
 *     tags: ['article-tags']
 *     summary: 获取所有文章标签
 *     description: |
 *       获取所有文章标签，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleTagsTagsQueryRequest'
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
 *                         $ref: '#/components/schemas/ArticleTagsTagsQueryResponse'
 */
