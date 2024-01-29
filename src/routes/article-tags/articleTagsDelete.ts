import { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tags/tags/delete',
		[body('id').notEmpty().withMessage('id cannot be empty').isInt().withMessage('id must be number')],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { id } = req.body;

			mysqlUTils.query<[number], object>(`DELETE FROM article_tag_connection WHERE tag_id = ?`, [Number(id)], function () {
				mysqlUTils.query<[number], object>(`UPDATE article_tags SET valid = 0 WHERE id = ? AND valid = 1;`, [Number(id)], function (results) {
					return res.status(200).json({
						status: 1,
						message: 'success',
						content: results,
					});
				});
			});
		}
	);
};

/**
 * @swagger
 * /article-tags/tags/delete:
 *   post:
 *     tags: ['article-tags']
 *     summary: 删除文章标签
 *     description: |
 *      删除文章标签
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleTagAddRequest'
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
