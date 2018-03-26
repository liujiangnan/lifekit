
function deleteEngine(){
  let ids = [];
  let checked = $('.table').find(":checked");
  checked.each(function(){
    ids.push($(this).val()); 
  });
  net.getData("deleteEngine",ids,function(res){
    if(res==="success"){
      showAlert("提示","删除成功！"); 
      checked.each(function(){
        $(this).parent().parent().hide().remove();
      });
    }else{
      showAlert("提示","删除失败！"); 
    }
  });
}


$(function(){

  $("#del").bind('click',function(){ 
    let checked = $('.table').find(":checked");
    if(!checked||checked.length===0){
      showAlert("提示","请选择要删除的组件！"); 
      return;
    }
    showModal(
      "提示",
      "确定删除选中组件？",
      '<button type="button" onClick="deleteEngine()" class="btn btn-default" data-dismiss="modal">确定</button>'+
      '<button type="button" class="btn btn-default" data-dismiss="modal" >取消</button>'
    ); 
  });

  $("#add").bind('click',function(){
    document.location.href = "/lifekit-role/engineDetailView";
  });

  $("#edit").bind('click',function(){
    let checked = $('.table').find(":checked").eq(0);
    let id = checked.val();
    document.location.href = "/lifekit-role/engineDetailView?id="+id;
  });

  $(".table tr").bind('click',function(){
    var check = $(this).find(":checkbox").eq(0); 
    check.prop("checked", !check.prop("checked"));
    let checked = $('.table').find(":checked");
    if(checked.length===1){
      $("#edit").show();
    }else{
      $("#edit").hide();
    }
  });
})