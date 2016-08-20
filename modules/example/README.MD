#测试模块

    用于各个编写好的业务模块进行简单的界面预览与测试
    
#调用方式

```javascript

    var frame = new skyframe();
    frame.init({
        id:"testframe",
        container:$("body"),
        server:"modules/example/src/QiangPro",
        views:"modules/example/web/example.ejs",
        closeable:false,
        maximizeable:false,
        minimizeable:false,
        moveable:false,
        style:{},
        parms:''
    });

```