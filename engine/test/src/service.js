function service(net) {

  net.data.items = [{name:"abc",value:"1"},{name:"abc",value:"1"}];  

  let index = 2;

  this.test = function(){
    // net.data.items[0].name="1111";
    // net.data.items.pop(); 
    // net.data.items.push({name:"ghi",value:"789"});
    // net.data.items[1] = {name:"ghi",value:"789"};
    // net.data.items.splice(2,1,{name:"ghi",value:"789"}); 
    // net.data.items.shift(); 
    index++;
    let x = {name:"ghi",value:index+""};
    net.data.items.unshift(x); //无法通过
  }

  this.test1 = function(){
    index++;
    let x = {name:"jkl",value:index+""};
    net.data.items.unshift(x); //无法通过
  }

}

module.exports = service; 


// let arr = [1,1,1,1,1,1];
// arr.splice(2,2,2);
// console.log(arr);
 