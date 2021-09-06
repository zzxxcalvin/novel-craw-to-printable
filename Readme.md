## 計畫目標 : 寫一個可以自動抓小說網站的小說並弄成指定 word 格式的爬蟲
### 使用到的 pacakge :
 - **fs**
 - **iconv-lite(用於轉換gbk to utf8)**
 - **request**
 - **cheerio**
 - **async(用於async while loop)**
 - **@google-cloud/translate(簡轉繁)**
 - **easy-template-x(將內容寫入 word template)**

### 2021/2/8 進度:
#### 目前可以正確抓取小說並存成 doc 檔案

### word 格式 :
 - 直式書寫
 - 檔名為卷數
 - 字體轉為繁體
 - 字型大小未定

 待完成

 ### 2021/2/17 ###
 原本是打算使用 package **docx**來手刻 word 格式
 可是貌似沒有辦法改變 layout 來滿足 A5 的格式 

 後來發現一個 package 叫做 **easy-template-x**
 可以透過一個 template word 
 透過預設 {變數} 的方式
 來填入相對的變數來產生 word 檔
 目前可以產生同樣是 A5 橫式寫下的 output
 **但字型跟大小還沒有辦法複製**

 ### 2021/2/18 ###
 修改 template 把頁面變成 A4 橫式書寫 對半了 
 (手動切割後可以達到兩張 A5 大小)
 剩餘問題在簡體字轉繁體字 (或是直接找繁體資源來解決)
 目前測試 **translate** package 還不能使用
 要註冊 google cloud api 拿 translate 的 api key 才能使用

 ### 2021/4/7 ###
  修改 template 加上頁碼
  修改字型大小、修改行距
  it's been a long time .

 ### 2021/4/11 ###
  用老帳戶啟用 google cloud 
  300美 試用金 ~ 7/11
  https://cloud.google.com/docs/authentication/getting-started
  https://cloud.google.com/docs/authentication/production

  trouble shooting https://github.com/GoogleCloudPlatform/nodejs-docs-samples/issues/117
  成功翻譯成繁體中文
  不過在執行上用了先翻譯成 zh 再翻譯成 zh-TW 的方法才成功
  沒意外應該是模型把簡體中文當成是繁體中文在看了 (幹)
  然後兩個 content = translate.translate ... 略 不能放在一起
  應該是 API 使用上的一些問題,如果未來有遇到再來思考怎麼解決
  先這樣先這樣
  
 ### 2021/4/12 ###
  原先嘗試一個一個爬下來
  結果整理的時候，幹，劇透到自己
  改成一次爬完全部的再一次寫入
  (實作法 : 一個變數存全部,一次爬一頁加上去)
  使用 npm async 套件 , 可以讓你多做一些 sync/async 的行為
  文件在這裡 [Async](https://caolan.github.io/async/v3/)
  可以在 node 中達成像是 sync while loop 的行為
  (因為平常在 node 裡寫 while 都是 async 的,他會直接往下跑)
  試錯 : https://stackoverflow.com/questions/57246825/node-js-async-whilst-is-not-executing-at-all 
  把我的判斷函式也改成了 callback 形式才成功執行,原理還沒看懂
  下次有機會盡量研究一下 
  ### (next)日期未定 ###

  ### 2021/9/6 ###
  看起來應該暫時不會動它
  因為文章爬下來後有使用 google cloud translate API 把簡轉繁
  但現在我的 google cloud 免費試用過期了
  所以翻譯的部分現在是動不了
  目前先以保存這個專案為主
  未來有需要再使用