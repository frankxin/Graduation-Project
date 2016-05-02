<template>
	<p id="md">{{{ message }}}</p>
</template>

<script>
	export default {
		data: function(){
			return{
				message: 'loading...'
			}
		},
		created: function(){
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
					this.message = data.content
				}.bind(this))
			}
		}
	}
</script>