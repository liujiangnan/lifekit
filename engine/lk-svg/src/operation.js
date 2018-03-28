
const fs = require("fs");

function operation(net){ 

  let svgpath = root_path+'/engine/lk-svg/web/svg.ejs';

  this.getSvgText = function (data,callback){
    fs.readFile(svgpath, 'utf8', callback); 
  }

  this.saveSvg = function(data,callback){
    fs.writeFile(svgpath, data, 'utf8', callback);
  }

}

module.exports = operation;