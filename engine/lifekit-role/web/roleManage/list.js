
function deleteRole(){
  let ids = [];
  let checked = $('.table').find(":checked");
  checked.each(function(){
    ids.push($(this).val()); 
  });
  net.getData("deleteRole",ids,function(res){
    if(res==="success"){
      showAlert("提示","删除成功！"); 
      checked.each(function(){
        $(this).parent().parent().hide().remove();
      });
      $("#edit").hide();
      $("#person").hide();
      $("#engine").hide();
    }else{
      showAlert("提示","删除失败！"); 
    }
  });
}


$(function(){

  $("#del").bind('click',function(){ 
    let checked = $('.table').find(":checked");
    if(!checked||checked.length===0){
      showAlert("提示","请选择要删除的角色！"); 
      return;
    }
    showModal(
      "提示",
      "确定删除选中角色？",
      '<button type="button" onClick="deleteRole()" class="btn btn-default" data-dismiss="modal">确定</button>'+
      '<button type="button" class="btn btn-default" data-dismiss="modal" >取消</button>'
    ); 
  });

  $("#add").bind('click',function(){
    net.getView("getEjs","lifekit-role/web/roleManage/addOrEdit.ejs",function(res){ 
      $(".container-fluid").html(res);
    }); 
  });

  $("#edit").bind('click',function(){
    let checked = $('.table').find(":checked").eq(0);
    let id = checked.val();
    net.getView("roleDetail",id,function(res){
      $(".container-fluid").html(res);
    }); 
  });

  $("#person").bind('click',function(){
    let checked = $('.table').find(":checked").eq(0);
    let id = checked.val();
    net.getView("getUserList",id,function(res){
      $(".container-fluid").html(res);
    }); 
  });

  $("#engine").bind('click',function(){
    let checked = $('.table').find(":checked").eq(0);
    let id = checked.val();
    net.getView("getEngineList",id,function(res){
      $(".container-fluid").html(res);
    }); 
  });

  $(".table tr").bind('click',function(){
    var check = $(this).find(":checkbox").eq(0); 
    check.prop("checked", !check.prop("checked"));
    let checked = $('.table').find(":checked");
    if(checked.length===1){
      $("#edit").show();
      $("#person").show();
      $("#engine").show();
    }else{
      $("#edit").hide();
      $("#person").hide();
      $("#engine").hide();
    }
  });
})