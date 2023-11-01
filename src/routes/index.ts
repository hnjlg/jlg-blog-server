import errorSdkRouter from './error-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';
import userRouter from './user';
import { Application } from 'express';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });

	userRouter({ app, jwtKey });
};
