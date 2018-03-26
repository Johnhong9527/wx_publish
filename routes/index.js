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

router.get('/',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	// console.log(params.echostr);
	// console.log(123);
	// res.send(params.echostr);
	// res.send(params);
	// let info = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=CODE&grant_type=authorization_code';
	// console.log(params);
	// console.log(params.code);
	res.render('index', { title: 'Express' });
})


router.get('/login',function (req, res, next) {
  /*https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd1271417044b9709&redirect_uri=https://wx.honghaitao.net/info&response_type=code&scope=snsapi_userinfo&state=honghaitao#wechat_redirect*/
  // let url =
  res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize',qs.stringify({
    appid:wx.appid,
    redirect_uri:'https://wx.honghaitao.net/info',
    response_type:'code',
    scope:'snsapi_userinfo',
    state:'honghaitao#wechat_redirect',
  }))
})

// 获取token
router.get('/token',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	console.log(params.echostr);
	console.log('/token');
	res.send(params.echostr);
	// res.send(params);
	// let info = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=CODE&grant_type=authorization_code';
	// console.log(params);
	// console.log(params.code);
	// res.render('index', { title: 'Express' });
})


// WXtocken
router.get('/info', function(req, res, next) {
  let params = URL.parse(req.url, true).query;
  let $res = res;
	console.log('/info');
  console.log(params);
	let info = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd1271417044b9709&secret=07f11a1a4aa8b4279daf9d21884916e8&code=${params.code}&grant_type=authorization_code`;

	axios.post(info).then(res=>{
		if(res.status == 200){
			console.log(res.data);
			userInfo = res.data;
			$res.redirect('/')
		}
	}).catch(error => {
   	console.log(error);
  })


	/*https.post(info, (res) => {
		console.log(res)
	  // console.log('statusCode:', res.statusCode);
	  // console.log('headers:', res.headers);

	  res.on('data', (d) => {
	    process.stdout.write(d);
	  });

	}).on('error', (e) => {
	  console.error(e);
	});*/
  // PostCode(params)
	/*setTimeout(()=>{
		$res.redirect('/')
	},200)*/
  
  // res.location(_path);
  
  // res.render('index', { title: 'Express' });
});


router.get('/userInfo',function(req,res,next){
	// let params = URL.parse(req.url, true).query;
	res.send(userInfo);
})


router.get('/user',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	res.send(params);

	console.log(params);
	console.log(params.code);
})



function PostCode(params) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'appid' : 'wxd1271417044b9709',
      'secret': '07f11a1a4aa8b4279daf9d21884916e8',
      'code': params.code,
      'grant_type':'authorization_code'
  });
  // An object of options to indicate where to post to
  var post_options = {
      host: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      // port: '80',
      // path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = https.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
      	console.log(chunk);
        console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}



module.exports = router;