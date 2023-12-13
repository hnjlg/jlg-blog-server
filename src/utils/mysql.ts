import mysql, { FieldPacket } from 'mysql2';
import dbConfig from '../config/mysql.config';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { errorWriteLog } from './error';

const mysqlWriteLog = (writeContent: string) => {
	fs.appendFile(path.join(__dirname, '../logs/mysql.log'), writeContent + '\n', (err) => {
		if (err) {
			throw err;
		}
	});
};

const query = <Params, Result>(sql: string, params: Params, callback?: (results: Result, fields: FieldPacket[]) => unknown) => {
	const connection = mysql.createConnection(dbConfig);
	connection.connect(function (err) {
		if (err) {
			errorWriteLog(err);
			// 在这里处理连接错误，例如记录日志或返回错误信息给客户端
			return;
		}
		connection.query(sql, params, function (err, results, fields) {
			if (err) {
				errorWriteLog(err);
				// 在这里处理查询错误，例如记录日志或返回错误信息给客户端
				return;
			}
			// 处理查询结果
			callback && callback(results ? JSON.parse(JSON.stringify(results)) : null, fields);
			mysqlWriteLog(
				JSON.stringify({
					sql,
					params,
					results,
					date: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
				})
			);
			connection.end(function (err) {
				if (err) {
					errorWriteLog(err);
					// 在这里处理关闭连接错误，例如记录日志或返回错误信息给客户端
					return;
				}
			});
		});
	});
};

export default {
	query,
};
