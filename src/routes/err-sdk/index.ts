import { Application } from 'express';
import sourceMapRoute from './sourceMap';
import uploadRoute from './upload';
import addErrorRoute from './addError';

export default ({ app }: { app: Application }) => {
	sourceMapRoute({ app });

	uploadRoute({ app });

	addErrorRoute({ app });
};
