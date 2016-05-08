/**
 *
 * TODO: 
 * 	1.读取文件，传给md_parser去转换
 * 
 */

var fs = require('fs'),
marked = require('./marked')

var libDir = __dirname
		pptDir = '/../ppts/', //Path relative to this file
		PLACEHOLDER_TOKEN = '&&FRANKZHANG&&',
		MARKED_PLACEHOLDER_TOKEN = marked(PLACEHOLDER_TOKEN)

/**	
 * start: 启动函数
 * params：
 * 	- mdName: 要解析的markdown文件的名字
 * 
 */
function start(mdName){

	var 	 content = '',
				contents = [],
				  slides = [],
		 slideRegExp = /\[slide.*\]/i,
		     noteReg = /\[note\]([\s\S]+)\[\/note\]/im,
				magicReg = /\[magic\b(.*)([\s\S]+)\[\/magic\]/im,
			 separator = /[\=]{4,}/g,
			 mdRoute = libDir + pptDir + mdName + '.md'

	if(fs.existsSync(mdRoute)){

		content = fs.readFileSync(mdRoute, 'utf-8').toString()
		contents = content.split(slideRegExp)
		//content[0] are user config datas
		parseConfig(contents.shift())
		
		contents.forEach(function(v, i) {
			var magicData = []
			
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
					magicData = magic.map(function(v){
						return '<div class=\"magic-slide\">' + marked(v) + '<\/div>'
					})
        } else {
          v = v.replace(magicReg, magic[0])
        }
			}
			
			v = marked(v.trim())
			
			slides.push(parseCore({content: v, note: note, magic: magicData}))
			
		})
		
		// console.log(slides)
		return slides.join('\n')

	}else{
		console.log('No such Files')
	}
}

/**
 * parseConfig : handle the config and writer informations
 */
function parseConfig(string) {
	// console.log(string)
}

/**
 * 
 * parseCore
 * params.content: the main marked content
 * params.note: the note in one page
 * params.magic: the transform of content in one page
 * 
 */
function parseCore(params) {
	
	var slideTagStart = '<slide class=\"slide\">',
			magicContent = ''
	
	//fill magic DOM
	magicContent = parseMagic(params.magic)
	params.content = params.content.replace(MARKED_PLACEHOLDER_TOKEN, magicContent)
	
	//generate note DOM
	if (params.note) {
    params.note = ['<aside class="note">', '<section>', params.note, '</section>', '</aside>'].join('\n')
  } else {
    params.note = ''
  }
	
	//generate slide container
	return slideTagStart + params.note + '<section class="slide-wrap">' + params.content + '</section></slide>'
}

function parseMagic(magic){
	magic = magic.map(function(v){
		return '<div class=\"magic-entity\">' + v + '<\/div>'
	})
  return '<div class=\"magic\">' + magic.join('\n') + '</div>'
}

module.exports = {
	start: start
}