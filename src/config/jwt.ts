import { Application, NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

export default ({ app }: { app: Application }): { jwtKey: string } => {
	let systemUser: string | JwtPayload | undefined;

	const jwtKey = crypto.randomBytes(32).toString('hex');

	const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
		if (!['/login'].includes(req.path)) {
			const authHeader = req.headers['authorization'];
			const token = authHeader && authHeader.split(' ')[1];
			if (token == null) return res.sendStatus(401);
			jwt.verify(token, jwtKey, (err, user) => {
				if (err) return res.sendStatus(403);
				systemUser = user;
				console.log(systemUser, 'systemUser');
				next();
			});
		} else {
			next();
		}
	};

	app.use(authenticateToken);

	return {
		jwtKey,
	};
};
