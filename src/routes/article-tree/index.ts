import { Application } from 'express';
import deleteById from './deleteById/deleteById';
import searchByArticleTreeName from './searchByArticleTreeName/searchByArticleTreeName';
import add from './add/add';
import searchById from './searchById/searchById';
import updateById from './updateById/updateById';

export default ({ app }: { app: Application }) => {
	deleteById({ app });
	searchByArticleTreeName({ app });
	add({ app });
	searchById({ app });
	updateById({ app });
};
