import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { T_SelectList } from '../../../types/selectList';

export default ({ app }: { app: Application }) => {
	app.post('/blog-backstage/article-status/all/query', [], (req: Request, res: Response) => {
		mysqlUTils.query<[], T_SelectList>('SELECT status_name AS label, status_value AS value FROM article_status;', [], function (results) {
			return res.status(200).json({
				status: 1,
				message: 'success',
				content: results,
			});
		});
	});
};
