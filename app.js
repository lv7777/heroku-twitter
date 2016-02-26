var express = require('express');
var app = express();
 
//ルーティング設定
app.get('/', function (req, res) {
  res.send('Hello World');
});
 
//以下、ルーティング情報があればここに追記していく
 
app.listen(3000);
console.log('Server running at http://localhost:3000/');