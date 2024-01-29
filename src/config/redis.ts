const redis = require('redis');

// 创建 Redis 客户端

export default function () {
	const redisClient = redis.createClient();

	// 连接
	redisClient.connect(6379, '127.0.0.1');

	return {
		redisClient,
	};
}
