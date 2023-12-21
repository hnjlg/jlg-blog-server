import { Application } from 'express';
import articleTagsQuery from './articleTagsQuery';

export default ({ app }: { app: Application }) => {
	articleTagsQuery({ app });
};
