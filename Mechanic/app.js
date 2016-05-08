var koa = require('./koaMixSocket'),
    app = koa(),
     fs = require('fs'),
fxPrezi = require('./src/fxPrezi'),
getList = require('./src/getList'),
 router = require('koa-router')(),
 libDir = __dirname

// app.io.use(function*(next){
//   console.log('somebody connected')
//   console.log(this.headers)
// })

app.io.on('connection',function(socket){
  console.log('somebody connected!!!!!!')
  socket.on('click right', function(){
    console.log('click right')
    socket.broadcast.emit('click right')
  })
  socket.on('click left', function(){
    console.log('click left')
    socket.broadcast.emit('click left')
  })
  socket.on('send note',function (note) {
    console.log('send note receive')
    console.log('Note!!!! is :' + note)
    socket.broadcast.emit('send note',note)
  })
})

// app.io.route('click right',function*(){
//   console.log('receive click right event')
// })

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
  
  // console.log(getJsonp.call(this, {content: content}))
  
  this.body = getJsonp.call(this, {content: content})

})

/** 
 * 处理展示列表的请求
 */
router.get('/list', function *(next){
  
  var list = getList(libDir + '/ppts')
  
  this.body = getJsonp.call(this, {list: list})
  
})

/**
 * getJsonp 需要通过绑定上下文环境调用，且上下文环境中有this.request参数
 */
function getJsonp(obj){
  return this.request.query.callback + '(' + JSON.stringify(obj) + ');'
}

app.use(router.routes())
app.listen(3000, function(){console.log('listen on 3000 port')})
