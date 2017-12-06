function service(net) {

  net.data.items = [{name:"abc",value:"1"},{name:"abc",value:"1"}]; 
  net.data.a = 2; 
  let myObj = {"key":"hello","value":{"a":"123"}};
  net.data.myObj = myObj;

  let index = 1;

  let flag = true;

  // setInterval(function(){
  //   index++;
  //   if(index>9){
  //     index = 0;
  //   }
  //   net.data.a = index;
  // },10);

  this.test = function(){
    // net.data.items[0].name="1111";
    // net.data.items.pop(); 
    // net.data.items.push({name:"ghi",value:"789"});
    // net.data.items[1] = {name:"ghi",value:"789"};
    // net.data.items.splice(2,1,{name:"ghi",value:"789"}); 
    // net.data.items.shift(); 
    // index++;
    // let x = {name:"ghi",value:index+""};
    // net.data.items.unshift(x); //无法通过 

  }

  this.test1 = function(){
    // index++;
    // let x = {name:"jkl",value:index+""};
    // net.data.items.unshift(x); //无法通过
    // net.data.a = "hello world!!";
    // delete net.data.myObj.value.a;
    // console.log(net.data.myObj.value);

    flag = false;
  }

}

module.exports = service; 


// let arr = [1,1,1,1,1,1];
// arr.splice(2,2,2);
// console.log(arr);
 