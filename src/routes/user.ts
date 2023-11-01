import { Application } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/login',
		[body('username').notEmpty().withMessage('username cannot be empty'), body('password').notEmpty().withMessage('password cannot be empty')],
		(req: Request, res: Response) => {
			const { username, password } = req.body;

			// 在实际应用中，这里应该是对用户名和密码进行验证的逻辑
			// 如果验证通过，则生成JWT令牌并返回给客户端
			if (username === 'admin' && password === 'password') {
				const token = jwt.sign({ username: username }, jwtKey);
				res.json({ status: 1, message: 'success', content: token });
			} else {
				res.status(401).json({ status: 1, message: 'failed', content: '登录失败' });
			}
		}
	);
};
