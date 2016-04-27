var libDir = __dirname

function start(mdName){
  return require(libDir + '/func').start(mdName)
}

module.exports = {
	start: start
}