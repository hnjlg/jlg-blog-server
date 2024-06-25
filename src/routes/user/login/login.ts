import { Application } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { I_User } from '../../../types/users';
import CryptoJS from 'crypto-js';
import { T_RedisClient } from '../../../global';

export default ({ app, jwtKey, redisClient }: { app: Application; jwtKey: string; redisClient: T_RedisClient }) => {
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
			const { userName } = req.body;

			const passWord = CryptoJS.SHA256(CryptoJS.AES.decrypt(req.body.passWord, 'blog').toString(CryptoJS.enc.Utf8)).toString();

			mysqlUTils.query<[string, string], I_User[]>(
				'SELECT id, user_name, pass_word, user_code, standing FROM users WHERE user_name = ? AND pass_word = ? AND valid = 1;',
				[userName, passWord],
				function (results) {
					if (results && results.length === 1) {
						const token = jwt.sign({ id: results[0].id }, jwtKey);
						const userInfo = {
							id: results[0].id,
							user_name: results[0].user_name,
							user_code: results[0].user_code,
							standing: results[0].standing,
							token,
						};
						redisClient.set(`user:${userInfo.id}`, JSON.stringify(userInfo));
						res.status(200).json({
							status: 1,
							message: 'success',
							content: userInfo,
						});
					} else {
						res.status(401).json({ status: 1, message: '账号或密码错误', content: null });
					}
				}
			);
		}
	);
};
