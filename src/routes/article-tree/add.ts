import { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';
import { I_MySQLResult } from '../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/tree/add',
		[
			body('treeName').notEmpty().withMessage('treeName cannot be empty').isString().withMessage('treeName must be string'),
			body('parentId')
				.custom((value) => {
					if (value === null) return true;
					return !isNaN(value);
				})
				.withMessage('parentId must be a number or null'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { treeName, parentId } = req.body;
			mysqlUTils.query<
				[string],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM article_tree WHERE article_tree_name = ?;', [String(treeName)], function (results) {
				if (results && results[0].count > 0) {
					return res.status(401).json({
						status: 1,
						message: '目录已存在',
						content: results,
					});
				} else {
					mysqlUTils.query<[string, number], I_MySQLResult>(
						`INSERT INTO article_tree (article_tree_name,parent_article_tree_id) VALUES (?,?)`,
						[String(treeName), parentId],
						function (results) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: results,
							});
						}
					);
				}
			});
		}
	);
};

/**
 * @swagger
 * /article-tree/tree/add:
 *   post:
 *     tags: ['article-tree']
 *     summary: 新增文章目录
 *     description: |
 *      新增文章目录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treeName:
 *                 type: string
 *               parentId:
 *                 type: integer
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
