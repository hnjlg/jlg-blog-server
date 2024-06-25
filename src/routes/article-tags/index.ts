import { Application } from 'express';
import articleTagsQuery from './articleTagsQuery/articleTagsQuery';
import articleTagsAdd from './articleTagsAdd/articleTagsAdd';
import articleTagsDelete from './articleTagsDelete/articleTagsDelete';
import articleTagsQuerySingle from './articleTagsQuerySingle/articleTagsQuerySingle';
import articleTagsUpdate from './articleTagsUpdate/articleTagsUpdate';

export default ({ app }: { app: Application }) => {
	articleTagsQuery({ app });
	articleTagsAdd({ app });
	articleTagsDelete({ app });
	articleTagsQuerySingle({ app });
	articleTagsUpdate({ app });
};
