var koa = require('koa'),
    app = koa(),
     fs = require('fs'),
fxPrezi = require('./src/fxPrezi'),
getList = require('./src/getList'),
 router = require('koa-router')(),
 libDir = __dirname

/**
 * 处理展示主页的请求
 */
router.get('/md/:name', function *(next) {
  console.log('处理markdown中..')
  var content = fxPrezi.start(this.params.name) //同步的
  console.log('处理markdown成功')
  this.response.set({
    'Content-Type': 'text/html'
  })
  
  this.body = getJsonp.call(this, [{content: content}])

})

/** 
 * 处理展示列表的请求
 */
router.get('/list', function *(next){
  
  var list = getList(libDir + '/ppts')
  
  this.body = getJsonp.call(this, [{list: list}])
  
})

/**
 * getJsonp 需要通过绑定上下文环境调用，且上下文环境中有this.request参数
 */
function getJsonp(obj){
  this.request.query.callback + '(' + JSON.stringify(obj) + ');'
}

// router.get('/favicon.ico', function *(next) {
//   this.response.set({
//     'Content-Type': 'image/x-icon'
//   })
//   var content =  fs.readFileSync('./img/favicon.ico')
//   this.body = content
// })

function escapQuot(html){
  return String(html).replace(/"/g, '&quot;');
    // .replace(/&(?!\w+;)/g, '&amp;')
    // .replace(/</g, '&lt;')
    // .replace(/>/g, '&gt;')
    
};

app.use(router.routes())
app.listen(3000, function(){console.log('listen on 3000 port')})
