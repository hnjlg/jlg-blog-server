import express from 'express';
import cors from 'cors';
import routers from './routes';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import swaggerConfig from './config/swagger';
import jwtConfig from './config/jwt';
import requestLog from './config/requestLog';
import bodyParams from './config/bodyParams';
import dotenv from './config/dotenv';

dotenv();

dayjs.locale('zh-cn');

const app = express();

// 设置静态文件目录，用于存放文件夹及其中文件
app.use(express.static('public'));

// 请求速率拦截
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100000, // Limit each IP to 100000 requests per `window` (here, per 15 minutes)
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	})
);

// 允许所有来源的跨域请求,允许所有来源请求静态资源
app.use(cors({ origin: '*' }));

// 安全性保护
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // 允许加载自身域名的资源
			},
		},
	})
);

bodyParams({ app });

requestLog({ app });

swaggerConfig({ app });

// 端口号
const port = Number(process.env.SERVER_PORT) ?? 3000;

const { jwtKey } = jwtConfig({ app });

routers({ app, jwtKey });

// 启动服务器
app.listen(port, function () {
	console.log(`Server running at http://localhost:${port}/`);
});
