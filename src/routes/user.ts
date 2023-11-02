import { Application } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mysqlUTils from '../utils/mysql';

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
			const { username, password } = req.body;
			// 在实际应用中，这里应该是对用户名和密码进行验证的逻辑
			// sql查询user表
			try {
				mysqlUTils.query<string, { username: string; password: string }>('select * from users', [], function (results) {
					// 如果验证通过，则生成JWT令牌并返回给客户端
					if (results?.some((item) => item.username === username && item.password === password)) {
						const token = jwt.sign({ username: username }, jwtKey);
						res.json({ status: 1, message: 'success', content: token });
					} else {
						res.status(401).json({ status: 1, message: 'failed', content: '登录失败' });
					}
				});
			} catch (error) {
				console.error(error);
			}
		}
	);
};
