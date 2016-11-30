/**
 * Created by zhy on 16/11/30.
 */

var sqlHelp = require("lifekit-mysqlhelper").Sqlparser();

function UserLogin(app,passport){
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function (user, done) {//保存user对象
        done(null, user);//可以通过数据库方式操作
    });

    passport.deserializeUser(function (user, done) {//删除user对象
        done(null, user);//可以通过数据库方式操作
    });

    passport.use('local', new LocalStrategy(
        function (username, password, done) {
            var data = {
                username: username,
                password: password
            };
            var sql = sqlHelp.queryWithColumns("LK_BASE_USER",data);
            global.dbhelper.execDataSet(sql,function(error,rows){
                if(error){
                    console.log(error);
                }
                if(rows.length>0){
                    var user = {GUID:rows[0]["GUID"],NAME:rows[0]["NAME"]};
                    return done(null, user);
                }else{
                    return done(null, false);
                }
            });
        }
    ));

    app.post('/login',passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: false
        }),
        function(req, res) {
            // 验证成功则调用此回调函数
            res.send('success');
        }
    );

    app.get('/login',function(req, res){
        res.send("fail");
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/islogin',function(req,res){
        res.send(req.isAuthenticated());
    });


}
module.exports = UserLogin;