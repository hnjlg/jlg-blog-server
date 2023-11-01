import errorSdkRouter from './error-sdk';
import generateFksPageTemplateRouter from './generate-fks-page-template';

import { Application } from 'express';

export default ({ app }: { app: Application }) => {
	generateFksPageTemplateRouter({ app });

	errorSdkRouter({ app });
};
