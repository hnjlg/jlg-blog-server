import { Application, Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blob/articles/query/byTagId',
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
 * /blob/articles/query/byTagId:
 *   post:
 *     tags: ['blob']
 *     summary: 查询标签下的文章
 *     description: |
 *       查询标签下的文章，并可根据参数分页查询。
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
 *               byTagId:
 *                 type: number
 *                 description: 标签id tagId查询
 *             example:
 *               pageIndex: 1
 *               pageSize: 10
 *               tagId: 1
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
 */
