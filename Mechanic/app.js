var koa = require('koa'),
    app = koa(),
     fs = require('fs'),
fxPrezi = require('./src/fxPrezi'),
 router = require('koa-router')()

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

  this.body = this.request.query.callback + 
    '(' + JSON.stringify({content: content}) + ');'
})

/** 
 * 处理展示列表的请求
 */
router.get('/list', function *(next){
  this.body = 'list'
})

function escapQuot(html){
  return String(html).replace(/"/g, '&quot;');
    // .replace(/&(?!\w+;)/g, '&amp;')
    // .replace(/</g, '&lt;')
    // .replace(/>/g, '&gt;')
    
};

app.use(router.routes())
app.listen(3000, function(){console.log('listen on 3000 port')})
