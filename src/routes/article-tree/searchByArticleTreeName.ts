import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/article-tree-name/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
			body('articleTreeName').notEmpty().withMessage('articleTreeName cannot be empty'),
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
			const { pageSize, pageIndex, articleTreeName } = req.body;

			mysqlUTils.query<[string, number, number] | [number, number], []>(
				`SELECT id, article_tree_name, parent_article_tree_id from article_tree ${
					articleTreeName !== undefined ? 'WHERE article_tree_name LIKE ?' : ''
				} LIMIT ? OFFSET ?;`,
				[`%${articleTreeName}%`, Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
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
 * /article-tree/article-tree-name/query:
 *   post:
 *     tags: ['article-tree']
 *     summary: 远程检索文章树
 *     description: |
 *       获取文章树，支持分页
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
 *                 description: 每页显示的文章树数量
 *               articleTreeName:
 *                 type: string
 *                 description: 文章树名称articleTreeName
 *             example:
 *               pageIndex: 1
 *               pageSize: 10
 *               articleTreeName: "1"
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
 *                         description: 文章树id
 *                       article_tree_name:
 *                         type: string
 *                         description: 文章树标题
 *                       parent_article_tree_id:
 *                         type: string
 *                         description: 父级文章树
 */
