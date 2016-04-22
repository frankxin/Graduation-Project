var libDir = __dirname

function start(){
  require(libDir + '/func').start()
}

module.exports = {
	start: start
}