function service(net) {

  net.data.items = [
    {name:"abc",value:"123"},
    {name:"abc",value:"123"},
    {name:"abc",value:"123"},
    {name:"abc",value:"123"}
  ];
  net.data.items.push({name:"def",value:"456"});

  this.test = function(){
    // net.data.items[1].name="1111";
    // net.data.items.pop();

    // net.data.items.push({name:"ghi",value:"789"});
  }

}

module.exports = service;
 