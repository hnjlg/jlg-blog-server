import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';

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
			>('SELECT COUNT(*) as count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[number], []>(`UPDATE users SET valid = 0 where id = ?;`, [Number(author)], function (results) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results,
						});
					});
				} else {
					return res.status(401).json({
						status: 1,
						message: 'failed',
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
 *             type: object
 *             properties:
 *               author:
 *                 type: integer
 *                 description: 用户id
 *             example:
 *               author: 2
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
 *                       fieldCount:
 *                         type: integer
 *                         description: 描述
 *                       affectedRows:
 *                         type: integer
 *                         description: 描述
 *                       insertId:
 *                         type: integer
 *                         description: 描述
 *                       info:
 *                         type: string
 *                         description: 描述
 *                       serverStatus:
 *                         type: integer
 *                         description: 描述
 *                       warningStatus:
 *                         type: integer
 *                         description: 描述
 *                       changedRows:
 *                         type: integer
 *                         description: 描述
 */
