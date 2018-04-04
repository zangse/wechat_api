const config = require('../../config/weixin.config.js');
const redisClient = require('./redis.middleware.js');
const sha1 = require("sha1");
const crypto = require("crypto");
const appId = config.appId;
const appSecret = config.appSecret;
// 将获取的access_token和ticket存储在redis中
exports.getAccessToken = function(req, res, next) {
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    redisClient.setItem(url, req, 'access_token', next);
}

exports.getTicket = function(req, res, next) {
    let access_token = req.access_token;
    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
    redisClient.setItem(url, req, 'ticket', next);
}

exports.getSignature = function(req, res, next) {
    let ticket = req.ticket;
    let timestamp = parseInt(new Date().getTime() / 1000);
    let url = req.query.url;
    let noncestr = crypto.randomBytes(8).toString('hex');

    let str = [`jsapi_ticket=${ticket}`, `noncestr=${noncestr}`, `timestamp=${timestamp}`, `url=${url}`].sort().join("&");

    console.log(str);
    let signature = sha1(str);
    req.result = {
        signature: signature,
        appId: appId,
        timestamp: timestamp,
        nonceStr: noncestr
    };
    next();
}