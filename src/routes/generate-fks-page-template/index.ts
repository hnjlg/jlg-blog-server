import downloadFolderName from './download-folderName';
import generateFolderName from './generate-folderName';

import { Application } from 'express';

export default ({ app }: { app: Application }) => {
	downloadFolderName({ app });

	generateFolderName({ app });
};
