var os = require('os');
var _ = require('lodash');
var fs = require('fs');
var compose = require('lodash/fp/compose');

function Config(){
  this.dirname = __dirname;
}

Config.prototype.getIpAddress = function(netJson){
  var address = '';
  address = netJson.en0[1].address;
  return address;
}
Config.prototype.generateConfigFile = function(addr){
  return `export default {
    apiUrl: "http://${addr}:3000/",
    baseHost: "${addr}:8080"
  }`
}
Config.prototype.resolveToConfigFile = function(fileName){
  return `${this.dirname}/../components/${fileName}`
}
Config.prototype.writeFileSync = function(file){
  fs.writeFileSync(this.resolveToConfigFile('config.js'), file, 'utf8');
}
Config.prototype.run = function(){
  var netJson = {},generateConfig = null;
  netJson = os.networkInterfaces();
  generateConfig = compose(this.generateConfigFile,this.getIpAddress);
  fs.writeFileSync(this.resolveToConfigFile('config.js'), generateConfig(netJson), 'utf8');
  console.log(`Change config.js's ip address to ${this.getIpAddress(netJson)}`);
}

var c = new Config();
c.run();