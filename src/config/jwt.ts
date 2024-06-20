import { Application, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export default ({ app }: { app: Application }): { jwtKey: string } => {
	const jwtKey = crypto.randomBytes(32).toString('hex');

	const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
		// 可以公开访问的路径
		const publicPaths = ['/user/login', '/user/register'];

		// 需要特殊处理的路径
		const specialPaths = ['/download/', '/blog/', '/sentry-sdk'];

		// 如果请求路径在公开访问路径列表中或者以特殊路径开头，则直接通过
		if (publicPaths.includes(req.path) || specialPaths.some((path) => req.path.startsWith(path))) {
			next();
		} else {
			const token = req.headers['authorization'];
			// 如果没有提供token，则返回401 Unauthorized
			if (token == null) return res.sendStatus(401);

			// 验证token
			jwt.verify(token, jwtKey, (err) => {
				// 如果token验证失败，则返回403 Forbidden
				if (err) return res.sendStatus(403);
				// 验证通过，继续下一个中间件
				next();
			});
		}
	};

	app.use(authenticateToken);

	return {
		jwtKey,
	};
};
