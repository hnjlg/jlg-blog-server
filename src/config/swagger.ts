import swaggerJsdoc from 'swagger-jsdoc';
import dayjs from 'dayjs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { Request, Response, Application } from 'express';

export default ({ app }: { app: Application }) => {
	// Swagger配置
	const swaggerOptions = {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'JLG_BLOG',
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
			components: {
				securitySchemes: {
					Basic: {
						type: 'apiKey',
						description: '在下框中输入请求头中需要添加Jwt授权Token:Basic Token',
						name: 'Authorization',
						in: 'header',
					},
				},
			},
			security: [
				{
					Basic: [],
				},
			],
		},
		apis: [path.join(process.cwd(), './src/routes/**/*.yaml')], // 指定包含路由定义的文件路径
	};

	const swaggerSpec = swaggerJsdoc(swaggerOptions);

	app.get('/swagger.json', function (_req: Request, res: Response) {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});

	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
