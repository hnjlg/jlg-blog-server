import express, { Application } from 'express';
import bodyParser from 'body-parser';

export default ({ app }: { app: Application }) => {
	// 拿到body参数
	app.use(express.json()); // 解析 JSON 格式的请求体
	app.use(
		express.urlencoded({
			extended: true,
		})
	); // 解析 URL 编码的请求体

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
};
