import { Application } from 'express';
import blogHotQuery from './blogHotQuery';
import blogTagsQuery from './blogTagsQuery';
import tagHotQuery from './tagHotQuery';
import blogQueryByTagId from './blogQueryByTagId';
import articleForSearchByArticleTreeId from './articleForSearchByArticleTreeId';
import articleInterview from './articleInterview';
import articleForSearchByArticleId from './articleForSearchByArticleId';
import articleForSearchLikeTitle from './articleForSearchLikeTitle';
import articleTreeAll from './articleTreeAll';

export default ({ app }: { app: Application }) => {
	blogHotQuery({ app });
	blogTagsQuery({ app });
	tagHotQuery({ app });
	blogQueryByTagId({ app });
	articleForSearchByArticleTreeId({ app });
	articleInterview({ app });
	articleForSearchByArticleId({ app });
	articleForSearchLikeTitle({ app });
	articleTreeAll({ app });
};
