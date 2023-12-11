import fs from 'fs';
import path from 'path';
import mysql from 'mysql2';

export const errorWriteLog = (writeContent: mysql.QueryError) => {
	fs.appendFile(path.join(__dirname, '../logs/error.log'), writeContent + '\n', (err) => {
		if (err) {
			throw err;
		}
	});
};
