var express = require('express');
const https = require('https');
var querystring = require('querystring');
var axios = require('axios');
var qs = require('qs');
var router = express.Router();
// 获取数据
var URL = require('url');
/* GET home page. */
var wx = require('../config/wx');

let userInfo = {};

router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});
// 用户授权登录
router.get('/login', function (req, res, next) {
  /*https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd1271417044b9709&redirect_uri=https://wx.honghaitao.net/info&response_type=code&scope=snsapi_userinfo&state=honghaitao#wechat_redirect*/
  // let url =
  res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.appid}&redirect_uri=https://wx.honghaitao.net/info&response_type=code&scope=snsapi_userinfo&state=honghaitao#wechat_redirect`)
});

// 拉取用户信息(需scope为 snsapi_userinfo)
router.get('/user_info',function (req, res, next) {
  let _res= res;
  axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${userInfo.access_token}&openid=${userInfo.openid}&lang=zh_CN`).then(res=>{
    if (res.status == 200) {
      console.log(res.data);
      // userInfo = res.data;
      _res.send(res.data)
    }
  }).catch(error=>{
    console.log(error)
  })
})
// 获取token
router.get('/token', function (req, res, next) {
  let params = URL.parse(req.url, true).query;
  console.log(params.echostr);
  console.log('/token');
  // https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
  res.send(params.echostr);
})


// WXtocken
router.get('/info', function (req, res, next) {
  let params = URL.parse(req.url, true).query;
  let $res = res;
  console.log('/info');
  console.log(params);
  let info = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=${params.code}&grant_type=authorization_code`;

  axios.post(info).then(res => {
    if (res.status == 200) {
      console.log(res.data);
      userInfo = res.data;
      $res.redirect('/')
    }
  }).catch(error => {
    console.log(error);
  })
});

// 获取用户基本信息
router.get('/userInfo', function (req, res, next) {
  // let params = URL.parse(req.url, true).query;
  axios.get()
  res.send(userInfo);
  /*

  {
    access_token: "8_q_J_CX3ezB6eGfq_LZBpHjSC9zFJraBO_IiWzrz6eo3ddQoc9F6C3mC5XQ02xJ9shHh8GK5m5i7Qit_3heW7Kw",
    expires_in: 7200,
    refresh_token: "8_7CgQRUeoxU9hdpcc5BYQk246XTxG4KRpEHDyZoSDCA5GnfWS56yZRbiobNoOOACwbGovIbLsmHkpbApd4beA4w",
    openid: "o73Sowz6vhpGpMoj5kMq9ZEcbMl8",
    scope: "snsapi_userinfo"
}
   */
})


router.get('/user', function (req, res, next) {
  let params = URL.parse(req.url, true).query;
  res.send(params);

  console.log(params);
  console.log(params.code);
})


module.exports = router;