/*
  http://m.boquge.com/wapbook/`书籍编号`_`章节编号`.html
*/
const express = require('express');
const router = express.Router();

// 网络请求模块
// const request = require('superagent'); // 无法指定编码问题,导致访问中文网站时出现乱码问题
// const superagent = require('superagent-charset'); // 指定编码,避免乱码
const request = require('superagent');
require('superagent-charset')(request);
// 切割节点模块
const cheerio = require('cheerio');
// 本地文件读写模块
var fs = require('fs');
// 获取数据
var URL = require('url');

// 定义数据
const websiteM = 'http://m.boquge.com/search.htm?keyword=';
const websiteSearch = 'http://www.boquge.com/search.htm?keyword=';
const website = 'http://www.boquge.com'
// 返回搜索结果列表
let searchList = [];
// 小说内容
let books = '';
let bookName = '';

router.get('/', function (req, res, next) {
  res.send('ok');
});
// 搜索小说,返回列表
router.get('/title', function (req, res, next) {
  // 抓取向该借口请求的数据
  let params = URL.parse(req.url, true).query;
  // 处理获取到的请求内容,使用`encodeURI函数`将其转化为`url编码`
  let zfc = websiteSearch + encodeURI(params.name);
  console.log(zfc);
  // 执行爬虫程序
  searchF(zfc, res);
  // 
  // setTimeout(function () {
  //     res.send(JSON.stringify(searchList));
  // }, 2500)
});
// 根据`name`搜索小说
function searchF(name, result) {
  // 爬取该网站搜索结果的数据
  request.get(name).charset('gbk').end(function (req, res) {
    var $ = cheerio.load(res.text, {
      decodeEntities: false
    });
    let title = $('div#novel-list ul');
    for (let i = 1; i < 12; i++) {
      // 通过`i === 11`的条件,判断`for循环`结束,返回搜索结果列表
      // console.log(title.children('li').eq(i).children('div.col-xs-1').children('i').html() === null);
      if (title.children('li').eq(i).children('div.col-xs-1').children('i').html() === null || i === 11) {
        result.send(JSON.stringify(searchList));
        // newTitle = 'ok';
        // console.log(searchList)
        // console.log(51);
        // console.log(i)
        // console.log(title.children('li').eq(i).children('div.col-xs-1').children('i').html());
        return;
      }
      // 进行数据绑定
      searchList[i - 1] = {
        type: title.children('li').eq(i).children('div.col-xs-1').children('i').html(),
        name: title.children('li').eq(i).children('div.col-xs-3').children('a').html(),
        bookUrl: website + title.children('li').eq(i).children('div.col-xs-3').children('a').attr('href'),
        newTitle: title.children('li').eq(i).children('div.col-xs-4').children('a').html(),
        newTitleUrl: website + title.children('li').eq(i).children('div.col-xs-4').children('a').attr('href'),
        auth: title.children('li').eq(i).children('div.col-xs-2').eq(0).html(),
        endTime: title.children('li').eq(i).children('div.col-xs-2').eq(1).children('span.time').html()
      };
    }
    // 类型: type
		/*
		title.children('li').eq(5).children('div.col-xs-1').children('i').html()
		*/
    // 小说名称: name & bookUrl
		/*
		title.children('li').eq(5).children('div.col-xs-3').children('a').attr('href')
		title.children('li').eq(5).children('div.col-xs-3').children('a').html()
		*/
    // 最新章节: newTitle & newTitleUrl
		/*
		title.children('li').eq(5).children('div.col-xs-4').children('a').html()
		title.children('li').eq(5).children('div.col-xs-4').children('a').attr('href')
		*/
    // 作者: auth
		/*
		title.children('li').eq(5).children('div.col-xs-2').eq(0).html()
		*/
    // 最后更新时间: endTime
		/*
		title.children('li').eq(5).children('div.col-xs-2').eq(1).children('span.time').html()
		*/
  })
}
// 下载
router.get('/download', function (req, res, next) {
  let params = URL.parse(req.url, true).query;
  // 清空前次下载操作内容
  // books = '';
  bookName = params.name;
  return allChapters(params.bookUrl, res);
});

// 找到该小说的所有章节
function allChapters(url, result) {
  if (url !== '') {
    url = url.split('/')

    for (let j in url) {

      if (Number.parseInt(url[j]) > 500) {
        request.get('http://www.boquge.com/book/' + url[j]).charset('gbk').end(function (req, res) {
          const $ = cheerio.load(res.text, {
            decodeEntities: false
          })
					/*
					# 章节地址
					titleList.eq(5).children('a').attr('href')
					# 章节名字
					titleList.eq(5).children('a').html()
          */
          // 获取所有小说`DOM`节点的集合
          const titleList = $('ul#chapters-list li');
          // 保存已处理的章节数据集合
          let titltArray = [];
          // 通过`for循环`,将小说目录中,所有的章节名称与链接保存到`titltArray`数组中
          for (let i = 0; i < titleList.length; i++) {

            // 剔除为空章节
            /*
if (titleList.eq(i).children('a').html() === null) {
              titltArray[i - 2] = {
                url: 'http://www.boquge.com' + titleList.eq(i).children('a').attr('href'),
                name: titleList.eq(i).children('a').html()
              }
            } else {
              titltArray[i - 1] = {
                url: 'http://www.boquge.com' + titleList.eq(i).children('a').attr('href'),
                name: titleList.eq(i).children('a').html()
              }
            }
            */

            titltArray[i] = {
              url: 'http://www.boquge.com' + titleList.eq(i).children('a').attr('href'),
              name: titleList.eq(i).children('a').html()
            }
            // 循环结束,执行下载程序
            if (i === titleList.length - 1) {
              let temp = []
              for (let q in titltArray) {
                if ((typeof titltArray[q]) !== 'undefined' && titltArray[q].url !== 'http://www.boquge.comundefined') {
                  temp.push(titltArray[q]);
                }
                // # 方案二： 删除`titltArray`中的空数据
                // q && temp.push(titltArray[q]);
              }
              titltArray = temp;
              delete temp;
              // result.send(titltArray);
              downloadF(titltArray, result);
            }
          }
          // console.log(JSON.stringify(url));
        })
        // return result.send(url[i]);
      }
    }
  }
}
// 下载小说[x]
function downloadF(titltArray, result) {
  console.log('正在下载中');
  // result.send(titltArray);
  let newTitltArray = [];

  // 转化章节列表中的数据结构
  for (let i = 0; i < titltArray.length; i++) {
    // for (let i = 0; i < 15; i++) {
    newTitltArray[i] = {
      url: 'http://m.boquge.com/wapbook/' + titltArray[i].url.split('/')[4] + '_' + titltArray[i].url.split('/')[5],
      name: titltArray[i].name
    }
    if (i === titltArray.length - 1) {
      titltArray = newTitltArray;
      delete newTitltArray;
      result.send(titltArray);
      down();
    }
  }
  let x = 0; // 下载进度
  let y = titltArray.length - 1; // 下载次数： 由章节数决定
  // let y = 20;
  books = ''; // 保存到本地的数据源，这里进行为空处理
  function down() {
    let downTimer = setTimeout(function () {
      if (x === y) {
        clearInterval(downTimer);
        // 将处理完毕的数据保存到本地
        const path = '../Downloads/'; // 保存路径设置,这里之科协绝对路径
        // var text_name = path + books_name + '.txt'; // 保存文件路径已经名字
        const text_name = path + bookName + '.txt'; // 保存文件路径已经名字
        // console.log(books);
        // 本地文件读写操作
        fs.writeFile(text_name, books, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log("数据写入成功！并执行清除缓存进程！");
          books = ''; // 清除缓存
          // console.log("--------我是分割线-------------")
          // console.log("读取写入的数据！");
          return;
          fs.readFile(text_name, function (err, data) {
            if (err) {
              return console.error(err);
            }
            // console.log("异步读取文件数据: " + data.toString());
          });
        });
      } else if (x !== y) {
        console.log(x + 1)
        request.get(titltArray[x].url).charset('gbk').end(function (req, res) {
          const $ = cheerio.load(res.text, {
            decodeEntities: false
          })
          // 目录
          let title = $('h1').html();
          // console.log(title);
          // 内容
          let txtContent = $('div#cContent p');
          let txtContentList = ''
          for (let index = 0; index < txtContent.length; index++) {
            txtContentList = txtContentList + '\n' + txtContent.eq(index).html();
            if (index === txtContent.length - 1) {
              books = books + '\n' + title + '\n' + txtContentList;
              x++;
              down();
              // console.log(txtContentList);
            }
          }
          // let txtContents = ''
          // txtContent = txtContent.split('<br>');
          // console.log(books);
          // console.log(title);
          // console.log(txtContent);

          // for (let d in txtContent) {
          //   if (txtContent[d] !== '') {
          //     txtContents = txtContents + txtContent[d];
          //   }
          // }

          // books = books + title + '<br>' + txtContent;
          // console.log(books);
          // result.send(JSON.stringify(txtContent));
          // 程序执行结束之后,将缓存中的数据写入到本地文件保存起来
        })


      }
    }, 500)
  }

}
module.exports = router;