const request = require('request')
const redis = require('redis')
const redis_config = require('../../config/redis.config.js')
const redisClient = redis.createClient(redis_config);
exports.setItem = function(url, req, key, next) {
    redisClient.get(key, function(err, data) {
        if (data) {
            console.log(data);
            req[key] = data;
            next();
        } else {
            request(url, function(error, response, body) {
                console.log(body);
                let result = JSON.parse(body);
                let result_key = result[key];
                let exprires = result.expires_in - 100;
                req[key] = result_key;
                redisClient.set(key, result_key);
                redisClient.expire(key, exprires);
                next();
            })
        }
    });
}