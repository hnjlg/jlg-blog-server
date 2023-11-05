import downloadFolderName from './download-folderName';
import generateFolderName from './download-folderName';

import { Application } from 'express';

export default ({ app }: { app: Application }) => {
	downloadFolderName({ app });

	generateFolderName({ app });
};
