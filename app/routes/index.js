const express = require('express');
const wxSignature = require('../middleware/wxSignature.middleware.js');
const wxAuth = require('../middleware/wxAuth.middleware.js');
const router = express.Router();

// 获取微信签名
router.get("/signature", wxSignature.getAccessToken, wxSignature.getTicket, wxSignature.getSignature, function(req, res, next) {
    res.send({ code: 0, data: req.result });
});
// 微信授权
router.get("/wxAuth", wxAuth.getCode, (req, res, next) => {
    // 授权调用
});
// 获取用户信息
router.get("/wxAuth/getUserInfo", wxAuth.getAccessToken, wxAuth.getUserInfo, (req, res, next) => {
    // console.log(req.query);
    let back_url = req.query.back_url;
    console.log('back_url==' + back_url);
    if (back_url.indexOf('?path=')) {
        back_url = back_url.replace('?path=', '#/')
        console.log(back_url);
    }
    res.redirect(back_url);
});
module.exports = router;