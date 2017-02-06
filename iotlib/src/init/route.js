/**
 * Web请求路由
 */
function route(app){
    var sysconfig = require(root_path+'/iotlib/src/config/sysconfig.json');

    var url = require("url");
    var fs = require("fs");


    fs.readdir(root_path+"/modules",function(err,fileNameArray){

        fileNameArray.asynEach(function(i,n,flag){
            var filepath = root_path+"/modules/"+n;
            var stat = fs.lstatSync(filepath);
            if(stat){
                console.log("正在装载'"+n+"'模块..");
                app.get("/"+n,function(req,res){
                    var host = req.headers['host'];
                    res.render('iotlib/web/skyframe/skyframe.ejs',
                        { 'host': host, 'server':n});
                });


                app.post('/'+n+'/getView', function (req, res) {
                    req.body.server = n;
                    var socket = net.getNetclientInstanceForReq(req);
                    var flag = socket.isload();
                    if(flag){
                        var method = req.body.method;
                        var parms = req.body.parms;
                        var mdlService = require(filepath + '/src/service');
                        var svc = new mdlService();

                        if(method==="getEjs"){
                            if(svc["init"]){
                                svc["init"](req, res, parms);
                            }else{
                                res.render("modules/"+n+"/web/index.ejs",{});
                            }
                        }else{
                            svc[method](req, res, parms);
                        }
                    }else{
                        res.render('iotlib/web/skyframe/error.ejs',{message:"非法访问"});
                    }
                });
                console.log("模块'"+n+"'装载完成..");
            }
            flag();
        },function(){
            console.log("所有模块装载完成...");
        });
    });

    //浏览器地址栏请求或刷新
    app.get('/', function (req, res) {
        var host = req.headers['host'];
        res.render('modules/index.ejs', { 'title': sysconfig.title, 'logo': sysconfig.logo, 'host': host});
    });

}
module.exports = route;
