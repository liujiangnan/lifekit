
function saveEngine(){
  $(this).unbind("click");
  var id = $("#id").val();
  var name = $("#name").val();
  var url = $("#url").val();
  var description = $("#description").val();
  var engineAuths = [];
  var codes = $(".table [name='codeTd']");
  var names = $(".table [name='nameTd']");
  var descs = $(".table [name='descTd']");
  codes.each(function(i,n){
    var authObj = {
      code:$(n).text(),
      name:names.eq(i).text(),
      description:descs.eq(i).text()
    }; 
    engineAuths.push(authObj);
  });
  var obj = {
    id:id,
    name:name,
    url:url,
    description:description,
    engine_auths:engineAuths
  };
  net.getData("saveEngine",obj,function(res){
    if(res==="success"){
      alert("保存成功");
    } 
    document.location.href = "/lifekit-role/engineManage";
  }); 
}

$(function(){  

  $("#saveEngine").bind('click',saveEngine);

  $("#cancle").bind('click',function(){
    history.go(-1);
  });
  
  $("#addAuth").bind('click',function(){
    var dom = $(".authRow").eq(0).clone(true); 
    dom.bind('click',function(){
      var check = $(this).find(":checkbox").eq(0); 
      check.prop("checked", !check.prop("checked"));
    });
    $('.table').append(dom);
  });

  $("#delAuth").bind('click',function(){
    $('.table').find(":checked").each(function(){
      $(this).parent().parent().hide().remove();
    });
  });

  $(".table tr").bind('click',function(){
    var check = $(this).find(":checkbox").eq(0); 
    check.prop("checked", !check.prop("checked"));
  });

  $("[name='codeTd']").bind('dblclick',function(){  
    var txt = $(this).text().trim();
    var dom = $("#cloneContaner").find('[name="cloneInput"]').eq(0).clone(true);
    dom.prop("name","auth_code").prop("placeholder","请输入权限编码");
    dom.blur(function(){
      var txt = $(this).val();
      $(this).parent().html(txt);
    });
    $(this).empty().append(dom);
    $(this).find(":input").val(txt).show().focus(); 
  }) 

  $("[name='nameTd']").bind('dblclick',function(){  
    var txt = $(this).text().trim();
    var dom = $("#cloneContaner").find('[name="cloneInput"]').eq(0).clone(true);
    dom.prop("name","auth_name").prop("placeholder","请输入权限名称");
    dom.blur(function(){
      var txt = $(this).val();
      $(this).parent().html(txt);
    });
    $(this).empty().append(dom);
    $(this).find(":input").val(txt).show().focus(); 
  });

  $("[name='descTd']").bind('dblclick',function(){  
    var txt = $(this).text().trim();
    var dom = $("#cloneContaner").find('[name="cloneInput"]').eq(0).clone(true);
    dom.prop("name","auth_description").prop("placeholder","请输入权限描述");
    dom.blur(function(){
      var txt = $(this).val();
      $(this).parent().html(txt);
    });
    $(this).empty().append(dom);
    $(this).find(":input").val(txt).show().focus();
  });

  
})