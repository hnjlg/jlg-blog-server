import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/byId/delete',
		[body('articleTreeId').notEmpty().withMessage('articleTreeId cannot be empty').isInt().withMessage('articleTreeId must be number')],
		(req: Request, res: Response) => {
			const { articleTreeId } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) as count FROM blog_article WHERE article_tree_id = ?;', [Number(articleTreeId)], function (results) {
				// 如果该级文章树下还有文章不让删除
				if (results && results[0].count > 0) {
					return res.status(401).json({
						status: 1,
						message: 'failed',
						content: results,
					});
				} else {
					mysqlUTils.query<
						[number],
						[
							{
								count: number;
							},
						]
					>('SELECT COUNT(*) as count FROM article_tree WHERE parent_article_tree_id = ?;', [Number(articleTreeId)], function (results) {
						// 如果该级文章树下还有文章树不让删除
						if (results && results[0].count > 0) {
							return res.status(401).json({
								status: 1,
								message: 'failed',
								content: results,
							});
						} else {
							mysqlUTils.query<[number], []>(`DELETE FROM article_tree where id = ?;`, [Number(articleTreeId)], function (results) {
								return res.status(200).json({
									status: 1,
									message: 'success',
									content: results,
								});
							});
						}
					});
				}
			});
		}
	);
};

/**
 * @swagger
 * /article-tree/byId/delete:
 *   post:
 *     tags: ['article-tree']
 *     summary: 删除文章树
 *     description: |
 *       删除文章树
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleTreeByIdDeleteRequest'
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
 *                     $ref: '#/components/schemas/MySQLResult'
 */
