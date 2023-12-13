import { Application, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

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
			mysqlUTils.query<[number, number, number], []>(
				'SELECT blog_article.* FROM blog_article JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id JOIN article_tags ON article_tag_connection.tag_id = article_tags.id WHERE article_tags.id = ? AND blog_article.valid = 1 LIMIT ? OFFSET ?;',
				[Number(tagId), Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[number], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM blog_article
						JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
						JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
						WHERE article_tags.id = ? AND blog_article.valid = 1;`,
						[Number(tagId)],
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
 * /blog/articles/query/byTagId:
 *   post:
 *     tags: ['blog']
 *     summary: 查询标签下的文章
 *     description: |
 *       查询标签下的文章，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogArticleQueryByTagIdRequest'
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
 *                         $ref: '#/components/schemas/BlogArticleQueryByTagIdResponse'
 */
