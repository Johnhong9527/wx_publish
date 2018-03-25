var express = require('express');
var router = express.Router();
// 获取数据
var URL = require('url');
/* GET home page. */

// WXtocken
router.get('/info', function(req, res, next) {
  let params = URL.parse(req.url, true).query;
  // console.log(req.url);
  console.log(params);
  // console.log(params.signature);
  // console.log(params.timestamp);
  // console.log(params.nonce);
  // console.log(params.echostr);
	console.log('123')
  let _path = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd1271417044b9709&redirect_uri=https://www.5fbc5ec3.ngrok.io/&response_type=code&scope=snsapi_userinfo&state=honghaitao#wechat_redirect'
  // res.send(params.echostr);
  // res.location(_path);
  res.redirect(_path)
  // res.render('index', { title: 'Express' });
});


router.get('/user',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	res.send(params);
	let info = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=CODE&grant_type=authorization_code';
	console.log(params);
	console.log(params.code);
})
router.get('/',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	res.send(params.echostr);
	// res.send(params);
	let info = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=CODE&grant_type=authorization_code';
	// console.log(params);
	// console.log(params.code);
	// res.render('index', { title: 'Express' });
})

module.exports = router;