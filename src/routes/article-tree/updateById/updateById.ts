import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { T_Article_Tree } from '../../../types/articleTree';

interface T_NodeType {
	label: string;
	children: T_NodeType[];
	id: number;
}
// 构造树函数
function buildSubtree(nodes: any[], startNodeId: number) {
	const tree: any[] = [];
	const map: { [k: number | string]: any } = {};

	nodes.forEach((node) => {
		map[node.id] = { label: node.article_tree_name, children: [], id: node.id };
	});

	nodes.forEach((node) => {
		if (node.parent_article_tree_id !== null) {
			map[node.parent_article_tree_id].children.push(map[node.id]);
		} else if (node.id === startNodeId) {
			// 如果是起始节点，则将其作为根节点
			tree.push(map[node.id]);
		}
	});

	return tree;
}
// 获取树节点的id
function getTreeNodeId(dataList: T_NodeType[] | undefined, idList: number[] = []) {
	if (!dataList) return;
	const ids: number[] = idList;
	dataList.forEach((item) => {
		ids.push(item.id);
		if (item.children.length > 0) {
			getTreeNodeId(item.children, ids);
		}
	});
	return ids;
}

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/article-tree-id/update',
		[
			body('id').notEmpty().withMessage('id cannot be empty').isInt().withMessage('id must be a number'),
			body('article_tree_name')
				.notEmpty()
				.withMessage('article_tree_name cannot be empty')
				.isString()
				.withMessage('article_tree_name must be a string'),
			body('parent_article_tree_id')
				.custom((value) => {
					if (value === null) return true;
					return !isNaN(value);
				})
				.withMessage('parent_article_tree_id must be a number or null'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}
			const { id, article_tree_name, parent_article_tree_id } = req.body;

			mysqlUTils.query<[], []>(`SELECT id, article_tree_name, parent_article_tree_id from article_tree;`, [], function (results) {
				const subtree: T_NodeType[] = buildSubtree(results, id);

				const ids = getTreeNodeId(subtree[0] ? subtree[0].children : []);

				if (ids!.includes(id)) {
					return res.status(401).json({
						status: 1,
						message: '节点的父节点不能是其后代节点',
						content: null,
					});
				} else {
					mysqlUTils.query<[string, number, number], T_Article_Tree>(
						`UPDATE article_tree SET article_tree_name = ?, parent_article_tree_id = ? WHERE id = ?;`,
						[article_tree_name, parent_article_tree_id, id],
						function (results) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: results,
							});
						}
					);
				}
			});
		}
	);
};
