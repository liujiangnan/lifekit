 
ShowWaitting(true);
$(function(){
  ShowWaitting(false);
  ready();
})
 



function ready() {

  Vue.component('my-menu', {
    template: '<div>'+
                '<template v-for="(item,index) in menus">'+ 
                  '<template  v-if="item.children">'+
                    '<el-submenu>'+
                      '<template slot="title"><i class="el-icon-menu"></i>{{item.name}}</template>'+
                      '<my-menu :menus="item.children"></my-menu>'+
                    '</el-submenu> '+
                  '</template>'+
                  '<template v-else>'+
                      '<el-menu-item :index="index">'+
                        '<i class="el-icon-star-off"></i>'+
                        '<span  slot="title">{{item.name}}</span>'+
                      '</el-menu-item> '+
                  '</template> '+ 
                '</template> '+
              '</div> ',  
     props:{ 
       "menus":Object
     }
  });

  new Vue({
    el: '#app', 
    created() {
      let that = this;
      net.getData("loadConfigData",function(res){
        res = JSON.parse(res); 
        if(res.code===200&&res.data){ 
          that.initForm(res.data.home);
          that.initMenu(res.data.menu);
          that.initLogin(res.data.loginUser);
        } else {
          this.$message.error({ showClose: true, message: res.msg, duration: 2000 });
        }
      });
    },
    data: function() {
      return {
        form: {},
        isCollapse: false,
        visible: false, 
        loginUser: null, 
        navs:[],
        menus:[],   
        mainUrl: "",  
      }
    },
    methods: { 
      changeCollapse(){
        this.isCollapse = this.isCollapse?false:true;
      },
      initForm(formData){
        this.form = formData 
      },
      initMenu(menuData){
        this.navs = menuData;
      },
      initLogin(loginUser){ 
        this.loginUser = loginUser; 
      },
      navClick(navData){
        if(navData.children&&navData.children.length>0){  
          this.menus = navData.children;
        }else{
          this.menus = [];
        }
        if(navData.url){
          this.mainUrl = navData.url;
        }
      }
    }
  })
}