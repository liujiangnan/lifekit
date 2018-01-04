ShowWaitting(true);
//element框架需要先加载完js才能正常使用
$.getScript("lk-main/web/lib/element-ui/lib/index.js", function() {
  ShowWaitting(false);
  ready();
});

function ready() {
  new Vue({
    el: '#app',
    data: function() {
      return {
        visible: false,
        activeIndex: '1',
        activeIndex2: '1',
        tets: true
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      changeCollapse(){
        this.tets = this.tets?false:true;
      }
    }
  })
}