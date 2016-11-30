/**
 * Web请求路由
 */
function route(app){
    var sysconfig = require(root_path+'/iotlib/src/config/sysconfig.json');

    var url = require("url");

    //浏览器地址栏请求或刷新
    app.get('/', function (req, res) {
        var host = req.headers['host'];
        res.render('modules/index.ejs', { 'title': sysconfig.title, 'logo': sysconfig.logo, 'host': host});
    });


    app.get('/skyframe', function (req, res) {
        var host = req.headers['host'];
        var urlobj = req.query;
        var server = urlobj.server;
        var views = urlobj.views;
        var initMethod = urlobj.initMethod;
        var parms = {};
        for(var temp in urlobj){
            if(temp!='server'&&temp!='views'&&temp!='initMethod'){
                parms[temp] = urlobj[temp];
            }
        }
        res.render('iotlib/web/skyframe/skyframe.ejs',
            { 'host': host, 'server':server, 'views':views,'initMethod':initMethod,'parms':parms});

    });

    app.post('/getView', function (req, res) {
        var socket = net.getNetclientInstanceForReq(req);
        var flag = socket.isload();
        if(flag){
            var server = req.body.server;
            var method = req.body.method;
            var parms = req.body.parms;
            var mdlService = require(root_path + '/' + server);
            var svc = new mdlService();

            if(method==="getEjs"){
                if(svc["init"]){
                    svc["init"](req, res, parms);
                }else{
                    res.render(parms,{});
                }
            }else{
                svc[method](req, res, parms);
            }
        }else{
            res.render('iotlib/web/skyframe/error.ejs',{});
        }
    });

}
module.exports = route;
