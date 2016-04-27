<template>
	<p id="md">{{{ message }}}</p>
</template>

<script>
	export default {
		template: '<p id="md">{{message}}</p>',
		data: function(){
			return{
				message: 'loading...'
			}
		},
		created: function(){
			debugger
			console.log(this)
			this.load()
		},
		methods: {
			load: function(){
				$.ajax({
					url: "http://127.0.0.1:3000/md/demo",
					method: 'GET',
					dataType: 'jsonp',
					headers: {
						"Access-Control-Allow-Origin" : "*"
					}
				}).done(function(data){
					console.log(data)
					// this.message = unescape(data)
				})
			}
		}
	}
</script>