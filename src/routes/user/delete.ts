import { Application, Request, Response } from 'express';
import { body } from 'express-validator';
import mysqlUTils from '../../utils/mysql';
import { I_MySQLResult } from '../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/delete',
		[body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be number')],
		(req: Request, res: Response) => {
			const { author } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[number], I_MySQLResult>(`UPDATE users SET valid = 0 WHERE id = ?;`, [Number(author)], function (results) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results,
						});
					});
				} else {
					return res.status(401).json({
						status: 1,
						message: '用户不存在',
						content: results,
					});
				}
			});
		}
	);
};

/**
 * @swagger
 * /user/delete:
 *   post:
 *     tags: ['user']
 *     summary: 删除用户
 *     description: |
 *       删除用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDeleteRequest'
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
