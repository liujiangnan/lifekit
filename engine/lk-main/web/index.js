 
ShowWaitting(true);
$(function(){
  ShowWaitting(false);
  ready();
})

function ready() {
  new Vue({
    el: '#app',
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