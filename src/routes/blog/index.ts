import { Application } from 'express';
import blogHotQuery from './blogHotQuery/blogHotQuery';
import blogTagsQuery from './blogTagsQuery/blogTagsQuery';
import tagHotQuery from './tagHotQuery/tagHotQuery';
import blogQueryByTagId from './blogQueryByTagId/blogQueryByTagId';
import articleForSearchByArticleTreeId from './articleForSearchByArticleTreeId/articleForSearchByArticleTreeId';
import articleInterview from './articleInterview/articleInterview';
import articleForSearchByArticleId from './articleForSearchByArticleId/articleForSearchByArticleId';
import articleForSearchLikeTitle from './articleForSearchLikeTitle/articleForSearchLikeTitle';
import articleTreeAll from './articleTreeAll/articleTreeAll';

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
