import { RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts } from 'redis';

export declare type T_RedisClient = RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;
