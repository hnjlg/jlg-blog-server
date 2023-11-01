const archiver = require('archiver');
import fs from 'fs';
import path from 'path';

export const zipFile = (folderName: string, folderPath: string, callback: (zipPath: string) => void) => {
	// 压缩文件夹为zip
	const zipPath = path.join(__dirname, '../../public', `${folderName}.zip`);
	const output = fs.createWriteStream(zipPath);

	const archiverInstance = archiver('zip', {
		zlib: {
			level: 9,
		}, // 压缩级别，可调整
	});

	archiverInstance.pipe(output);
	archiverInstance.directory(folderPath, false);
	archiverInstance.finalize();

	// 发送压缩文件给客户端
	output.on('close', () => {
		archiverInstance.destroy();
		callback(zipPath);
	});
};

// 检查目录是否存在，如果不存在则创建
export const createNullFile = (fileUrl: string) => {
	const dirPath = path.dirname(fileUrl);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {
			recursive: true,
		});
	}
};
