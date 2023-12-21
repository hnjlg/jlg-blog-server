import { Application } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { I_User } from '../../types/users';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/user/login',
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
			mysqlUTils.query<[string, string], I_User[]>(
				'SELECT id, user_name, pass_word, user_code, standing FROM users WHERE user_name = ? AND pass_word = ? AND valid = 1;',
				[userName, passWord],
				function (results) {
					if (results && results.length === 1) {
						const token = jwt.sign({ id: results[0].id }, jwtKey);
						res.status(200).json({
							status: 1,
							message: 'success',
							content: {
								id: results[0].id,
								user_name: results[0].user_name,
								user_code: results[0].user_code,
								token,
							},
						});
					} else {
						res.status(401).json({ status: 1, message: '账号或密码错误', content: null });
					}
				}
			);
		}
	);
};

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: ['user']
 *     summary: 登录
 *     description: |
 *       登录系统
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginRequest'
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
 *                     $ref: '#/components/schemas/UserLoginResponse'
 */
