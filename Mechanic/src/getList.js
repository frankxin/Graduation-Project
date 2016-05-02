var fs = require('fs')



var fileNameRegExp = /(\S+).md/i

module.exports = function (absolutePath) {
  var fileNameArr = fs.readdirSync(absolutePath)
  
  fileNameArr = fileNameArr.map(function(v, i){
    //[0] is the whole fileName , exp: demo.md
    //[1] is the name , exp: demo
    return v.match(fileNameRegExp)[1]
  })
  
  return fileNameArr
  
}