import { Application } from 'express';
import errorSdkRouter from './err-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
// import userRouter from './user';
import blogRouter from './blog';
import blogBackstage from './blog-backstage';
import articleTreeRouter from './article-tree';
import articleTagsRouter from './article-tags';
import routerConfigRouter from './router-config';
import fileRouter from './file';
import sentrySdkRouter from './sentry-sdk';
// import { T_RedisClient } from '../global';

// export default ({ app, jwtKey, redisClient }: { app: Application; jwtKey: string; redisClient: T_RedisClient }) => {
export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	// userRouter({ app, jwtKey, redisClient });

	blogRouter({ app });

	blogBackstage({ app, jwtKey });

	articleTreeRouter({ app });

	articleTagsRouter({ app });

	routerConfigRouter({ app, jwtKey });

	fileRouter({ app });

	sentrySdkRouter({ app });
};
