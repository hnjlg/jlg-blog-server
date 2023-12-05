import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blob/tags/query',
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
 * /blob/tags/query:
 *   post:
 *     tags: ['blob']
 *     summary: 获取所有标签
 *     description: |
 *       获取所有标签，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageIndex:
 *                 type: integer
 *                 description: 要获取的页数
 *               pageSize:
 *                 type: integer
 *                 description: 每页显示的文章数量
 *               tagName:
 *                 type: string
 *                 description: 标签名tagName查询
 *             example:
 *               pageIndex: 1
 *               pageSize: 10
 *               tagName: "标签"
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
