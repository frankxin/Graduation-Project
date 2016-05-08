<template>
	<slides id="slides">{{{ message }}}</slides>
</template>

<script>
	import io from "socket.io-client"
	import Config from "./config"
	export default {
		data: function(){
			return{
				message: 'loading...',
				socket: null
			}
		},
		created: function(){
			this.socket = io('http://localhost:3000/')
			console.log(this.socket)
			this.load().then(() => {
				//内容的html从后端获取，获取后才能绑定事件
				
				this.initDom()
				this.socket.emit('send note',$('.slide').find('.now .note').html())
				this.bindEvent()
			})
		},
		methods: {
			initDom: function(){
				var $slide = $('.slide')
				$slide.addClass('next')
				$slide.eq(0).removeClass('next').addClass('now')
				//为每一页中的元素都要进行初始化
				for(var i=0; i<$slide.length ;i++){
				  let	everySlide = $($slide[i])
				  let $magicEntity = everySlide.find('.magic-entity')
				  $magicEntity.addClass('next')
				  $magicEntity.eq(0).removeClass('next').addClass('now')
				} 
			},
			overviewMode: function(){
				var $slide = $('.slide')
				var $slides = $('#slides')
				$('#app').addClass('overview')
				this.overviewMove($slides, $slide)
			},
			magicSlide: function(keyCode){
				var $slides = $('#slides')
				var $slideNow = $slides.children('.now')
				var $magic = $slideNow.find('.magic')
				var $magicEntity = $magic.find('.magic-entity')
				var numOfPos = $magic.children('.now').index()
				if(keyCode === 39){
					if(numOfPos === $magicEntity.length-1){
						return true
					}else{
						$magic.children('.now').removeClass('now').addClass('prev').next().removeClass('next').addClass('now')
						return false
					}
				}else if(keyCode === 37 ){
					if(numOfPos === 0){
						return true
					}else{
						$magic.children('.now').removeClass('now').addClass('next').prev().removeClass('prev').addClass('now')
						return false
					}
				}else{

				}
			},
			animateUl: function(keyCode){
				var $slides = $('#slides')
				var $slideNow = $slides.children('.now').find('.slide-wrap')
				var $ul = $slideNow.find('ul')
				var $li = $ul.find('li')
				var numOfPos = $ul.find('.build').length - 1
				if(keyCode === 39){
					if(numOfPos === $li.length-1){
						return true
					}else{
						$li.eq(numOfPos + 1).addClass('build')
						return false
					}
				}else if(keyCode === 37){
					if(numOfPos === -1){
						return true
					}else{
						$li.eq(numOfPos).removeClass('build')
						return false
					}
				}
			},
			concatTransformStr: function(num){
				return `translate(${num}%, 0) scale3d(.3, .3, .3)`
			},
		  overviewMove: function($slides, $slide) {
		  	// debugger
				var indexCurr = $slides.children('.now').index()
				$slide.eq(indexCurr).css('transform', this.concatTransformStr(0))
				for (var i = indexCurr, step = 0; i > 0; i--) {
					$slide.eq(i - 1).css('transform', this.concatTransformStr(step - 32))
					step -= 32
				}
				for (var i = indexCurr, step = 0; i < $slide.length; i++) {
					$slide.eq(i + 1).css('transform', this.concatTransformStr(step + 32))
					step += 32
				}
			},
			exitOverviewMode: function(){
				var $slide = $('.slide')
				$('#app').removeClass('overview')
				for (var i = 0; i < $slide.length; i++) {
					$slide.eq(i).css('transform',"")
				}
			},
			bindEvent: function (){
				var $slide = $('.slide'),
					 $slides = $('#slides')

				this.socket.on('click right',function(){
					var e = $.Event("keydown");//模拟一个键盘事件
          e.keyCode = 39
          $(document).trigger(e)
				})

				this.socket.on('click left',function(){
					var e = $.Event("keydown");//模拟一个键盘事件
          e.keyCode = 37
          $(document).trigger(e)
				})

				document.onkeydown = (e)=>{
					console.log(e.which)
					//这里首先要判断当前页面是不是有需要magic的元素
					// debugger
					if(e.keyCode === 83){
						if($('.overview').length){
							this.exitOverviewMode()
						}else{
							this.overviewMode()
						}
						return false
					}
					if ($('body').children('.overview').length) {
						if (e.keyCode === 39) {
							if($slides.children('.now').next().length){
								$slides.children('.now').removeClass('now').addClass('prev').next().removeClass('next').addClass('now')
								this.overviewMove($slides, $slide)
							}else{
								//最后一个Slider
							}
						} else if (e.keyCode === 37) {
							if($slides.children('.now').prev().length){
								$slides.children('.now').removeClass('now').addClass('next').prev().removeClass('prev').addClass('now')

								this.overviewMove($slides, $slide)
							}else{
								//第一个slider
							}
						}	
						return false
					}
					if($slides.children('.now').find('.magic').length){
						//这里如果magic域存在，那么左右轮播事件有可能被挟持，如果此时magic在第一部分，则向左轮播事件被通过
						//如果此时magic在最后，则向右轮播事件通过，其他事件均执行magic，并return false
						if(this.magicSlide(e.keyCode)){}else{
							return false
						}
					}
					if($slides.children('.now').find('.slide-wrap ul').length){
						if(this.animateUl(e.keyCode)){}else{
							return false
						}
					}
					if(e.keyCode === 39){
						if($slides.children('.now').next().length !== 0){
							$slides.children('.now').removeClass('now').addClass('prev').next().removeClass('next').addClass('now')
						}
					}else if(e.keyCode === 37){
						if($slides.children('.now').prev().length !== 0){
							$slides.children('.now').removeClass('now').addClass('next').prev().removeClass('prev').addClass('now')
						}
					}else{
						return false
					}
					this.socket.emit('send note', $('.slide').find('.now .note').html())
				}
			},
			load: function (){
				return new Promise((resolve,reject) => {
					// zepto of this version don't have  callback module , so you can't use xhr.done()...
					$.ajax({
						url: Config.apiUrl + "md/demo",
						method: 'GET',
						dataType: 'jsonp',
						success: (data) => {
							this.message = data.content
						  resolve()
						}
					})
				})
			}
		}
	}
</script>