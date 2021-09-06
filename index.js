const request = require("request");
var async = require("async");
const fs = require("fs");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const isUrl = require("is-url");
const readline = require('readline');

const {TemplateHandler} = require("easy-template-x");
const {Translate} = require("@google-cloud/translate").v2;

const translate = new Translate();

var novel = " ";

var page = 66;
var target_novel = `https://www.wenku8.net/novel/2/2476/1162${page}.htm`;
var url = target_novel;



// async.whilst(function(callback){
//     console.log(page);
//     callback (null, page < 9 );
// },function(next){
//     console.log(page);
//     request({
//         url:url,
//         encoding:null},async function(error,response,body){
//             let body_ = iconv.decode(body,"gbk");
//             // 解決 request 的 response 為 gbk 亂碼的方式
//             // 設置 encoding null 防止 response 回傳後自行 encoding 
//             // 並透過 iconv decode gbk 就可以得到 utf-8 格式的網頁 body
    
//             let $ = cheerio.load(body_);
//             let target = $("#contentmain");
//             let title = target.find("#title").text().toString();
//             let target_ = $("#content");
//             let content = target_.text().toString();
//             novel += title ;
//             novel += " \n";
//             novel += content ;
//             // console.log(novel);
//             page = page+1;
//             next();
//     })
// });

async function callTemplate(content){

    // 1. read template file
    const templateFile = fs.readFileSync('template.docx');
    
    // 2. process the template
    const data = {
        novel: [
            { title: '', content:content  }
        ]
    };
    
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, data);
    
    // 3. save output
    fs.writeFileSync(`output.docx`, doc);
    console.log("writing file complete !")
}

async function craw(){
    await async.whilst(function(callback){ // async 是為了讓他等完整個 while 跑完
        
        // 上面這個不會過,不知道為什麼,可能要再去看 github 或是 document
        callback (null, page < 74 );
        // console.log(page)
    },function(next){
        console.log(page);
        request({
            url:`https://www.wenku8.net/novel/2/2476/1162${page}.htm`,
            encoding:null},async function(error,response,body){
                let body_ = iconv.decode(body,"gbk");
                // 解決 request 的 response 為 gbk 亂碼的方式
                // 設置 encoding null 防止 response 回傳後自行 encoding 
                // 並透過 iconv decode gbk 就可以得到 utf-8 格式的網頁 body
        
                let $ = cheerio.load(body_);
                let target = $("#contentmain");
                let title = target.find("#title").text().toString();
                let target_ = $("#content");
                let content = target_.text().toString();

                content = title + content ;

                content = await translate.translate(content,'zh')
                // content = content.replace(/\s\s+/g, ' ');
                content = content[0].replace(/^\s*$(?:\r\n?|\n)/gm, " ");

                content = await translate.translate(content,'zh-TW');
                // console.log(content);

                novel += content[0] ;
                page = page+1;
                next();
        })
    })

    // console.log(content);
    callTemplate(novel);
}

craw();

// request({
//     url:url,
//     encoding:null},async function(error,response,body){
//         let body_ = iconv.decode(body,"gbk");
//         // 解決 request 的 response 為 gbk 亂碼的方式
//         // 設置 encoding null 防止 response 回傳後自行 encoding 
//         // 並透過 iconv decode gbk 就可以得到 utf-8 格式的網頁 body

//         let $ = cheerio.load(body_);
//         let target = $("#contentmain");
//         let title = target.find("#title").text().toString();
//         let target_ = $("#content");
//         let content = target_.text().toString();

//         novel += content ;

//         novel = await translate.translate(content,'zh')
//         // content = content.replace(/\s\s+/g, ' ');
//         novel = novel[0].replace(/^\s*$(?:\r\n?|\n)/gm, " ");
//         // console.log(title);
//         // console.log(content_);
//         let test = await translate.translate('hello world','zh-TW');
//         // console.log(test[0]);
        
//         novel = await translate.translate(content,'zh-TW');
        
//         // console.log(content);
//         callTemplate(title,novel[0]);
//     }
// )




