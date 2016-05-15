<template>
	<p>This is list!</p>
  <ul>
    <li v-for="item in listUrl">
      <a target="new_blank" href="{{item.url}}">{{item.name}}</a>
    </li>
  </ul>
  <p>{{message}}</p>
</template>

<script>
  import Config from "./config.js"
	export default {
    data: function(){
      return {listUrl: null}
    },
    created: function(){
      this.load().then((data)=>{
        var listUrl = this.generateUrlArray(data)
        console.log(listUrl)
        this.listUrl = listUrl
      })
    },
    methods: {
      generateUrlArray: function(list){
        return list.map((v,i)=>{
          return {
            name: v,
            url: Config.baseHost + '/#!/md/' + v
          }
        })
      },
      load: function (){
        return new Promise((resolve,reject) => {
          // zepto of this version don't have  callback module , so you can't use xhr.done()...
          $.ajax({
            url: Config.apiUrl + "list",
            method: 'GET',
            dataType: 'jsonp',
            success: (data) => {
              console.log(data.list)
              resolve(data.list)
            }
          })
        })
      }
    }
  }
</script>