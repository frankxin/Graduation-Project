/**
 *
 * TODO: 
 * 	1.读取文件，传给md_parser去转换
 * 
 */

var fs = require('fs'),
marked = require('./marked')

var libDir = __dirname
		pptDir = '/../ppts/demo.md', //Path relative to this file
		PLACEHOLDER_TOKEN = '&&FRANKZHANG&&'

function start(){

	var targetFile = libDir + pptDir,
				 content = '',
				contents = [],
				  slides = [],
		 slideRegExp = /\[slide.*\]/i,
		     noteReg = /\[note\]([\s\S]+)\[\/note\]/im,
				magicReg = /\[magic\b(.*)([\s\S]+)\[\/magic\]/im,
			 separator = /[\=]{4,}/g;

	if(fs.existsSync(targetFile)){

		content = fs.readFileSync(targetFile, 'utf-8').toString()
		contents = content.split(slideRegExp)
		//content[0] are user config datas
		parseConfig(contents.shift())
		
		contents.forEach(function(v, i) {
			
			//处理note字段
			var note = noteReg.exec(v)
			if(note){
				v = v.replace(noteReg, '')
				note = marked(note[1]).trim()
			}
			//处理magic字段
			var magic = magicReg.exec(v)
			if(magic){
				magic = magic[2].split(separator).filter(function(v) {
					return v && v.trim()
				})
				if (magic.length > 1) {
          v = v.replace(magicReg, '\n' + PLACEHOLDER_TOKEN + '\n')
        } else {
          v = v.replace(magicReg, magic[0]);
        }
				console.log(magic)
			}
			
			v = v.trim()

			slides.push({content: v, note: note})
			
		})
		
		console.log(slides)

	}else{
		console.log('No such Files')
	}
}

function parseConfig(string) {
	console.log(string)
}

module.exports = {
	start: start
}