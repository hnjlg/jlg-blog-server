import { Application, NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

export default ({ app }: { app: Application }): { jwtKey: string } => {
	let systemUser: string | JwtPayload | undefined;

	const jwtKey = crypto.randomBytes(32).toString('hex');

	const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
		if (['/user/login', '/user/register'].includes(req.path) || req.path.startsWith('/download/') || req.path.startsWith('/blob/')) {
			next();
		} else {
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.split(' ')[1];
			if (token == null) return res.sendStatus(401);
			jwt.verify(token, jwtKey, (err, user) => {
				if (err) return res.sendStatus(403);
				systemUser = user;
				console.log(systemUser);
				next();
			});
		}
	};

	app.use(authenticateToken);

	return {
		jwtKey,
	};
};
