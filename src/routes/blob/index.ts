import { Application } from 'express';
import blobHotQuery from './blobHotQuery';
import blobTagsQuery from './blobTagsQuery';
import tagHotQuery from './tagHotQuery';
import blobQueryByTagId from './blobQueryByTagId';
import articleForSearchByArticleTreeId from './articleForSearchByArticleTreeId';
import articleInterview from './articleInterview';
import articleForSearchByArticleId from './articleForSearchByArticleId';
import articleForSearchLikeTitle from './articleForSearchLikeTitle';

export default ({ app }: { app: Application }) => {
	blobHotQuery({ app });
	blobTagsQuery({ app });
	tagHotQuery({ app });
	blobQueryByTagId({ app });
	articleForSearchByArticleTreeId({ app });
	articleInterview({ app });
	articleForSearchByArticleId({ app });
	articleForSearchLikeTitle({ app });
};
