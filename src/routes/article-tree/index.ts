import { Application } from 'express';
import deleteById from './deleteById';
import searchByArticleTreeName from './searchByArticleTreeName';
import add from './add';
import searchById from './searchById';

export default ({ app }: { app: Application }) => {
	deleteById({ app });
	searchByArticleTreeName({ app });
	add({ app });
	searchById({ app });
};
