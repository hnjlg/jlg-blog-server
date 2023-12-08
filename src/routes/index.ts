import { Application } from 'express';
import errorSdkRouter from './err-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
import userRouter from './user';
import blogRouter from './blog';
import blogBackstage from './blog-backstage';
import articleTreeRouter from './article-tree';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	userRouter({ app, jwtKey });

	blogRouter({ app });

	blogBackstage({ app });

	articleTreeRouter({ app });
};
