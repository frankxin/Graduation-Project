/**
 *
 * TODO: 
 * 	1.读取文件，传给md_parser去转换
 * 
 */

var fs = require('fs'),
marked = require('./marked')

var libDir = __dirname
		pptDir = '/../ppts/demo.md' //Path relative to this file

function start(){

	var targetFile = libDir + pptDir,
				 content = ''

	if(fs.existsSync(targetFile)){

		content = fs.readFileSync(targetFile, 'utf-8').toString()
		console.log(marked(content))

	}else{
		console.log('No such Files')
	}
}

module.exports = {
	start: start
}