<template>
	<slides id="slides">{{{ message }}}</slides>
</template>

<script>
	var async = require('./common.js')
	export default {
		data: function(){
			return{
				message: 'loading...'
			}
		},
		created: function(){
			this.load().then(() => {
				//内容的html从后端获取，获取后才能绑定事件
				this.bindEvent()
			})
		},
		methods: {
			bindEvent: function (){
				var $slide = $('.slide'),
					 $slides = $('#slides')
				$slide.eq(0).addClass('now')
				$slide.eq(1).addClass('next')
				document.onkeydown = function(e){
					console.log(e.which)
					if(e.keyCode === 39){
						if($slides.find('.now').next().length !== 0){
							$slides.find('.now').removeClass('now').addClass('prev').prev().removeClass('prev')
						  $slides.find('.next').removeClass('next').addClass('now').next().addClass('next')
						}
					}else if(e.keyCode === 37){
						if($slides.find('.now').prev().length !== 0){
							$slides.find('.now').removeClass('now').addClass('next').prev().removeClass('prev').addClass('now')
							$slides.find('.next').removeClass('.next')
						}
					}else{
						return false
					}
				}
			},
			load: function (){
				return new Promise((resolve,reject) => {
					// zepto of this version don't have  callback module , so you can't use xhr.done()...
					$.ajax({
						url: "http://127.0.0.1:3000/md/demo",
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