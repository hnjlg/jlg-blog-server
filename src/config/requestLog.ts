import { Application } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dayjs from 'dayjs';

export default ({ app }: { app: Application }) => {
	let morganId: string;

	app.use((req, res, next) => {
		morganId = crypto.randomBytes(32).toString('hex');
		next();
	});

	// 请求日志记录
	app.use(
		morgan(
			function (tokens, req, res) {
				return [
					'{',
					'\tid:' + morganId,
					'\tdate:' + dayjs().format('YYYY/MM/DD-HH:mm:ss'),
					'\tmethod:' + tokens.method(req, res),
					'\turl:' + tokens.url(req, res),
					'\tquery:' + JSON.stringify(req.query),
					'\tbody:' + JSON.stringify(req.body),
					'\tstatus:' + tokens.status(req, res),
					'}',
				].join('\n');
			},
			{ stream: fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' }) }
		)
	);
};
