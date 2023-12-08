import { Application } from 'express';
import searchAll from './searchAll';
import deleteById from './deleteById';
import searchByArticleTreeName from './searchByArticleTreeName';

export default ({ app }: { app: Application }) => {
	searchAll({ app });
	deleteById({ app });
	searchByArticleTreeName({ app });
};
