import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routers from './routes';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dayjs from 'dayjs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dayjs/locale/zh-cn';
import jwt, { JwtPayload } from 'jsonwebtoken';

// 你的JSON文件的路径
const jsonFile = process.env.NODE_ENV_FILE;

if (jsonFile) {
	try {
		const jsonData = fs.readFileSync(jsonFile, 'utf8');
		const envData = JSON.parse(jsonData);
		for (const key in envData) {
			if (envData.hasOwnProperty(key)) {
				process.env[key] = envData[key];
			}
		}
	} catch (error) {
		console.error(error);
	}
}

dayjs.locale('zh-cn');

const app = express();

// Swagger配置
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'JLG_EXPRESS',
			version: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
			description: 'API 文档',
			license: {
				name: 'swagger.json',
				url: process.env.SERVER_URL + '/swagger.json',
			},
		},
		servers: [
			{
				url: process.env.SERVER_URL,
			},
		],
	},
	apis: [path.join(process.cwd(), './src/routes/*.ts')], // 指定包含路由定义的文件路径
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.get('/swagger.json', function (req: Request, res: Response) {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 拿到body参数
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(
	express.urlencoded({
		extended: true,
	})
); // 解析 URL 编码的请求体

// 安全性保护
app.use(helmet());

// 请求速率拦截
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);

// 允许所有来源的跨域请求
app.use(cors());

let morganId: string;

app.use((req, res, next) => {
	morganId = crypto.randomBytes(32).toString('hex');
	next();
});

// 日志记录
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
		{ stream: fs.createWriteStream(path.join(__dirname, './access.log'), { flags: 'a' }) }
	)
);

// 增加请求体大小限制
app.use(
	bodyParser.json({
		limit: '50mb',
	})
); // 适当调整大小限制以满足您的需求
app.use(
	bodyParser.urlencoded({
		extended: true,
		limit: '50mb',
	})
); // 适当调整大小限制以满足您的需求

// 端口号
const port = process.env.SERVER_PORT;

// 设置静态文件目录，用于存放文件夹及其中文件
app.use(express.static('public'));

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

routers({ app, jwtKey });

// 启动服务器
app.listen(port);
