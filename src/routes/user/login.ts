import { Application } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { I_User } from '../../types/users';
import CryptoJS from 'crypto-js';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/login',
		[
			body('username')
				.notEmpty()
				.withMessage('username cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('username length must between 5 and 20'),
			body('password')
				.notEmpty()
				.withMessage('password cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('password length must between 5 and 20'),
		],
		(req: Request, res: Response) => {
			const { password } = req.body;
			// sql查询user表
			mysqlUTils.query<string, I_User>('SELECT * FROM users', [], function (results) {
				const user: I_User | undefined = results?.find((item) => {
					return CryptoJS.SHA256(password).toString() === item.pass_word;
				});
				if (user) {
					// 如果验证通过，则生成JWT令牌并返回给客户端
					const token = jwt.sign({ username: user.user_name }, jwtKey);
					res.status(200).json({
						status: 1,
						message: 'success',
						content: {
							token,
							userCode: user.user_code,
						},
					});
				} else {
					// 密码验证失败，返回登录失败信息
					res.status(401).json({ status: 1, message: 'failed', content: '登录失败' });
				}
			});
		}
	);
};
