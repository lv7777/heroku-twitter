var passport = require('passport');
// モジュールロード
// passport-twitterモジュールを事前にnpm installしておく必要があります。
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
  


var express = require('express');
var app = express();
    app.use(passport.initialize());
    
 app.use(express.cookieParser()); // read cookies (needed for auth)
  app.use(express.bodyParser()); // get information from html forms
  
  app.use(passport.session());
  app.use(app.router);
  
  
app.set('port', (process.env.PORT || 5000));

 app.use(express.static(__dirname));

// // views is directory for all template files
 app.set('views', __dirname);
// app.set('view engine', 'ejs');

app.set('view engine', 'html');


passport.serializeUser(function (user, done) {
    done(null, user);
});
 
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new TwitterStrategy({
    // 上記アプリ登録で取得したキーを指定します。
    consumerKey: "U5eGtwDWMXlaJbpJwcPiT3JZI",
    consumerSecret: "zMNYm243jVxMn9VavwyoTo3TNfTYKrli8TuGJQ59dxVtAYPTiu",
    // callbackで受け取りたいURLを指定します。
    callbackURL: "https://twitter-auth-test.herokuapp.com/callback"
  },
  // Callback時の処理を記載します。
    function (token, tokenSecret, profile, done) {
        console.log(token, tokenSecret, profile);
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));


app.get('/', function(request, response) {
  response.render('index');
});

// 認証を開始する処理を記載します。
app.get('/auth/twitter', passport.authenticate('twitter'));

// コールバックで呼び出された際の処理を記載します。
app.get('/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

