var express = require('express');
const https = require('https');
var axios = require('axios');
var router = express.Router();
// 获取数据
var URL = require('url');
/* GET home page. */


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

	/*axios.get(info).then(res=>{
		console.log(res);
	}).catch(error => {
   	console.log(error);
  })*/


	https.get(info, (res) => {
		console.log(res)
	  // console.log('statusCode:', res.statusCode);
	  // console.log('headers:', res.headers);

	  res.on('data', (d) => {
	    process.stdout.write(d);
	  });

	}).on('error', (e) => {
	  console.error(e);
	});

	setTimeout(()=>{
		$res.redirect('/')
	},200)
  
  // res.location(_path);
  
  // res.render('index', { title: 'Express' });
});


router.get('/user',function(req,res,next){
	let params = URL.parse(req.url, true).query;
	res.send(params);

	console.log(params);
	console.log(params.code);
})


module.exports = router;