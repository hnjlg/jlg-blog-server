import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { I_MySQLResult } from '../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/update',
		[
			body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be number'),
			body('passWord')
				.notEmpty()
				.withMessage('passWord cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('passWord length must between 5 and 32'),
			body('email').notEmpty().withMessage('email cannot be empty').isInt().withMessage('email must be string'),
			body('isReceiveEmail').notEmpty().withMessage('isReceiveEmail cannot be empty').isInt().withMessage('isReceiveEmail must be number'),
		],
		(req: Request, res: Response) => {
			const { author, passWord, email, isReceiveEmail } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[string, number, string, number], I_MySQLResult>(
						`UPDATE users SET pass_word = ? , is_receive_email = ? , email = ? where id = ?;`,
						[passWord, isReceiveEmail, email, Number(author)],
						function (results) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: results,
							});
						}
					);
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
 * /user/update:
 *   post:
 *     tags: ['user']
 *     summary: 修改账户资料
 *     description: |
 *       修改账户资料
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
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
