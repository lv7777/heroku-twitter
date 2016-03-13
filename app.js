
// モジュールロード
// passport-twitterモジュールを事前にnpm installしておく必要があります。
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session'); 
  
  
var express = require('express');
var app = express();
app.use(session({ secret: 'SECRET' }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
app.set('port', (process.env.PORT || 5000));
// app.use(express.static(__dirname));
 
 var ejs = require("ejs");
// // views is directory for all template files
 app.set('views', __dirname);
 app.engine('ejs', ejs.renderFile); 
 app.set('view engine', 'ejs');

//一度認証した後はクッキーを利用することでセッションを確立・維持する作りになっています
passport.serializeUser(function (user, done) {
    console.log("シリアライズ？");
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    console.log("デシリアライズ？");
    done(null, obj);
});

//Passportは認証のためにストラテジーと呼ばれるものを認証に使用します。
passport.use(new TwitterStrategy({
    // 上記アプリ登録で取得したキーを指定します。
    consumerKey: "U5eGtwDWMXlaJbpJwcPiT3JZI",
    consumerSecret: "zMNYm243jVxMn9VavwyoTo3TNfTYKrli8TuGJQ59dxVtAYPTiu",
    // callbackで受け取りたいURLを指定します。
    callbackURL: "http://127.0.0.1:5000/callback"
  },
  // 検証用コールバック。検証するだけ
    function (token, tokenSecret, profile, done) {
        console.log("callback時の処理を記述します？");
 //       console.log(token, tokenSecret, profile);
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));


app.get('/', function(request, response) {
  response.render('index');
});
//app.get(path, callback [, callback ...])
 
// /oauthにアクセスした時
app.get('/auth/twitter',passport.authenticate('twitter'), function (req, res, next) {
    console.log("hello");
    console.log(req, res, next);
});

// /oauth/callbackにアクセスした時（Twitterログイン後）
app.get('/callback',passport.authenticate('twitter', { successRedirect: '/success',failureRedirect: '/fail' }), function(req, res) {
    console.log("ok!");
   res.redirect('/success'); //indexへリダイレクトさせる
});

//app.use('/success', express.static(__dirname));

app.get('/success',function(req,res){
    console.log("認証成功！");
    console.log(req.user);
    var data=req.user;//JSON.parse(req.user);
    console.log(data.name);
    console.log(req.user.name)
 /*   for(var a in req.user){
        console.log(a+"   a");
      console.log(req.user[a])  
    }*/
    var rendobj={
        name:data.displayName,
        img:data._json.profile_image_url,
        tweet:data._json.description
    };
    res.render('success.ejs',rendobj);
});


app.get('/fail',function(req,res){
    console.log("認証失敗・・・");
 //   console.log(req.user);
  //  res.render('s1');
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//流れcallback時、シリア、デシ
