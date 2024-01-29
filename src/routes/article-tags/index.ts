import { Application } from 'express';
import articleTagsQuery from './articleTagsQuery';
import articleTagsAdd from './articleTagsAdd';
import articleTagsDelete from './articleTagsDelete';
import articleTagsQuerySingle from './articleTagsQuerySingle';
import articleTagsUpdate from './articleTagsUpdate';

export default ({ app }: { app: Application }) => {
	articleTagsQuery({ app });
	articleTagsAdd({ app });
	articleTagsDelete({ app });
	articleTagsQuerySingle({ app });
	articleTagsUpdate({ app });
};
