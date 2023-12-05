import { Application } from 'express';
import errorSdkRouter from './err-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
import userRouter from './user';
import blobRouter from './blob';
import blobBackstage from './blob-backstage';
import articleTreeRouter from './article-tree';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	userRouter({ app, jwtKey });

	blobRouter({ app });

	blobBackstage({ app });

	articleTreeRouter({ app });
};
