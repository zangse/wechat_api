const config = require("../../config/weixin.config.js")
const request = require('request')
const appId = config.appId;
const appSecret = config.appSecret;
const host = config.host;
exports.getCode = (req, res, next) => {
    if (req.cookies && req.cookies.openid) {
        next();
    } else {
        // console.log(req)
        let back_url = escape(req.query.back_url);
        console.log(req.query.back_url)
        let redirect_url = `${host}/wxAuth/getUserInfo?back_url=${back_url}`;
        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect `;
        console.log(url);
        res.redirect(url);
    }
}
exports.getAccessToken = (req, res, next) => {
    console.log('====accessToken')
    // console.log(req.query)
    let code = req.query.code;
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code `;
    request(url, (error, response, body) => {
        let result = JSON.parse(body);
        console.log(result)
        req.access_token = result.access_token;
        req.openid = result.openid;
        next();
    });
}
exports.getUserInfo = (req, res, next) => {
    console.log('====getUserInfo')
    let access_token = req.access_token;
    let openid = req.openid;
    let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN `
    request(url, (error, response, body) => {
        console.log(body)
        let result = JSON.parse(body);
        res.cookie("openid", result.openid, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
        res.cookie("unionid", result.unionid, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
        res.cookie("nickname", result.nickname, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
        res.cookie("headimgurl", result.headimgurl, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
        next();
    });
}