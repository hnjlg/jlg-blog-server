import { Application } from 'express';
import articleSubmittedForWaitReview from './articleSubmittedForWaitReview';
import articleSubmittedForDraft from './articleSubmittedForDraft';
import articleSubmittedForReview from './articleSubmittedForReview';
import articleSubmittedForReject from './articleSubmittedForReject';
import articleSubmittedForTakeback from './articleSubmittedForTakeback';
import articleSubmittedForDelete from './articleSubmittedForDelete';
import articleForSearchAll from './articleForSearchAll';
import articleForSearchByUserID from './articleForSearchByUserID';
import articleForSearchByArticleTreeId from './articleForSearchByArticleTreeId';
import articleForSearchByArticleId from './articleForSearchByArticleId';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	articleSubmittedForDraft({ app });
	articleSubmittedForWaitReview({ app });
	articleSubmittedForReview({ app });
	articleSubmittedForReject({ app });
	articleSubmittedForTakeback({ app });
	articleSubmittedForDelete({ app });
	articleForSearchAll({ app });
	articleForSearchByUserID({ app });
	articleForSearchByArticleTreeId({ app });
	articleForSearchByArticleId({ app, jwtKey });
};
