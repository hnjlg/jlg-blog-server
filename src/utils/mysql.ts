import mysql, { FieldPacket } from 'mysql2';
import dbConfig from '../config/mysql.config';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

const mysqlWriteLog = (writeContent: string) => {
	fs.appendFile(path.join(__dirname, '../mysql.log'), writeContent + '\n', (err) => {
		if (err) {
			throw err;
		}
	});
};

const query = <ParamsRecord, ResultRecord>(
	sql: string,
	params: ParamsRecord[],
	callback?: (results: ResultRecord[] | null, fields: FieldPacket[]) => unknown
) => {
	//每次使用的时候需要创建链接，数据操作完成之后要关闭连接
	const connection = mysql.createConnection(dbConfig);
	connection.connect(function (err) {
		if (err) {
			mysqlWriteLog(
				JSON.stringify({
					sql,
					params,
					err,
					date: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
				})
			);
			throw err;
		}
		//开始数据操作
		connection.query(sql, params, function (err, results, fields) {
			if (err) {
				mysqlWriteLog(
					JSON.stringify({
						sql,
						params,
						err,
						date: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
					})
				);
				throw err;
			}
			//将查询出来的数据返回给回调函数
			callback && callback(results ? JSON.parse(JSON.stringify(results)) : null, fields);
			mysqlWriteLog(
				JSON.stringify({
					sql,
					params,
					results,
					date: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
				})
			);
			//停止链接数据库，必须在查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
			connection.end(function (err) {
				if (err) {
					JSON.stringify({
						sql,
						params,
						err,
						date: dayjs().format('YYYY/MM/DD-HH:mm:ss'),
					});
					throw err;
				}
			});
		});
	});
};

export default {
	query,
};
