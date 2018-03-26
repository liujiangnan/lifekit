var frame = new skyframe(); //获取对象 

$(function(){ 
 
  $('#roleManage').bind('click',function(){
    $(this).addClass("active");
    $("#engineManage").removeClass("active"); 
    frame.init({ //初始化
      id:"center",
      container:$("#centerFrame"),
      engine:"lifekit-role/roleManage"
    });
  });
  $('#engineManage').bind('click',function(){
    $(this).addClass("active");
    $("#roleManage").removeClass("active"); 
    frame.init({ //初始化
      id:"center",
      container:$("#centerFrame"),
      engine:"lifekit-role/engineManage"
    });
  });
  $("#menubtn").bind('click',function(){
    var txt = $(this).prop("zk");
    if(txt==="1"){
      $("#menuTD").css("width","5%"); 
      $("#roleTxt").hide();
      $("#engineTxt").hide();
      $(this).prop("zk","0"); 
    }else{
      $("#menuTD").css("width","15%");  
      $("#roleTxt").show();
      $("#engineTxt").show();
      $(this).prop("zk","1");
    } 
  });
});

$('#roleManage').trigger('click');