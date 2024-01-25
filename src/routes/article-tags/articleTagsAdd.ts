import { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';
import { I_MySQLResult } from '../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tags/tags/add',
		[body('tagName').notEmpty().withMessage('tagName cannot be empty').isString().withMessage('tagName must be string')],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { tagName } = req.body;
			mysqlUTils.query<
				[string],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM article_tags WHERE tag_name = ? AND valid = 1;', [String(tagName)], function (results) {
				if (results && results[0].count > 0) {
					return res.status(401).json({
						status: 1,
						message: '标签已存在',
						content: results,
					});
				} else {
					mysqlUTils.query<[string], I_MySQLResult>(`INSERT INTO article_tags (tag_name) VALUES (?)`, [String(tagName)], function (results) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results,
						});
					});
				}
			});
		}
	);
};

/**
 * @swagger
 * /article-tags/tags/add:
 *   post:
 *     tags: ['article-tags']
 *     summary: 新增文章标签
 *     description: |
 *      新增文章标签
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagName:
 *                 type: string
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
