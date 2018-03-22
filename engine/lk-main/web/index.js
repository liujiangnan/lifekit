 
ShowWaitting(true);
$(function(){
  ShowWaitting(false);
  ready();
})

function ready() {
  new Vue({
    el: '#app',
    created() {
      let that = this;
      net.getData("loadConfigData",function(res){
        res = JSON.parse(res); 
        if(res.code===200&&res.data){ 
          that.initForm(res.data.home);
          that.initMenuList(res.data.menu);
        } else {
          this.$message.error({ showClose: true, message: res.msg, duration: 2000 });
        }
      });
    },
    data: function() {
      return {
        isCollapse: false,
        visible: false,
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      changeCollapse(){
        this.isCollapse = this.isCollapse?false:true;
      }
    }
  })
}