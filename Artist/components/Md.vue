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
				this.bindEvent()
			})
		},
		methods: {
			bindEvent: function (){
				document.onkeydown = function(){
					alert('love you')
				}
			},
			load: function (){
				return new Promise((resolve,reject) => {
					$.ajax({
						url: "http://127.0.0.1:3000/md/demo",
						method: 'GET',
						dataType: 'jsonp',
						headers: {
							"Access-Control-Allow-Origin" : "*"
						}
					}).done(function(data){
						this.message = data.content
						resolve()
					}.bind(this))
				})
			}
		}
	}
</script>