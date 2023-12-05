import { Application } from 'express';
import blobHotQuery from './blobHotQuery';
import blobTagsQuery from './blobTagsQuery';
import tagHotQuery from './tagHotQuery';
import blobQueryByTagId from './blobQueryByTagId';

export default ({ app }: { app: Application }) => {
	blobHotQuery({ app });
	blobTagsQuery({ app });
	tagHotQuery({ app });
	blobQueryByTagId({ app });
};
