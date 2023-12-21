import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { I_User } from '../../types/users';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/register',
		[
			body('userName')
				.notEmpty()
				.withMessage('userName cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('userName length must between 5 and 32'),
			body('passWord')
				.notEmpty()
				.withMessage('passWord cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('passWord length must between 5 and 32'),
		],
		(req: Request, res: Response) => {
			const { userName, passWord } = req.body;
			mysqlUTils.query<[string], [{ count: number }]>('SELECT COUNT(*) as count FROM users WHERE user_name = ?', [userName], function (results) {
				if (results && results[0].count > 0) {
					return res.status(401).json({
						status: 2,
						message: '用户名已被注册使用',
						content: results,
					});
				} else {
					mysqlUTils.query<[string, string, string], I_User[]>(
						'INSERT INTO users(user_name,pass_word,user_code) values (?,?,?);',
						[userName, CryptoJS.SHA256(passWord).toString(), 'U' + dayjs().format('YYYYMMDDHHmmss')],
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
 * /user/register:
 *   post:
 *     tags: ['user']
 *     summary: 注册
 *     description: |
 *       注册系统账户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterRequest'
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
