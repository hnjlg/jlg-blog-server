const redis = require('redis');

// 创建 Redis 客户端

export default function () {
	const redisClient = redis.createClient({
		url: 'redis://127.0.0.1:6379',
	});

	// 连接
	redisClient.connect();

	return {
		redisClient,
	};
}
