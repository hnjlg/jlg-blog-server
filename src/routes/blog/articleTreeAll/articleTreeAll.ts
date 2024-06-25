import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post('/blog/article-tree/all/query', [], (req: Request, res: Response) => {
		mysqlUTils.query<[], []>(`SELECT id, article_tree_name, parent_article_tree_id from article_tree;`, [], function (results) {
			return res.status(200).json({
				status: 1,
				message: 'success',
				content: results,
			});
		});
	});
};
