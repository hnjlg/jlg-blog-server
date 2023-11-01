import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routers from './routes';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import dayjs from 'dayjs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const app = express();

// Swagger配置
const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'My API',
			version: '1.0.0',
			description: 'API 文档',
		},
		servers: [
			{
				url: 'http://localhost:3000',
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
	morganId = uuid.v4();
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
		{ stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }) }
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
const port = 3000;

// 设置静态文件目录，用于存放文件夹及其中文件
app.use(express.static('public'));

routers({ app });

// 启动服务器
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
