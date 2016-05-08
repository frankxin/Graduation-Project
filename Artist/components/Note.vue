<template>
  <p>
    {{{note}}}
  </p>
</template>
<style></style>
<script>
  import io from "socket.io-client"
  import Config from "./config"
  export default {
    data: function(){
      return {
        socket: null,
        note: ''
      }
    },
    created: function(){
      this.socket = io(Config.apiUrl)
      this.noteReceive()
    },
    methods: {
      noteReceive: function(){
        this.socket.on('send note',(note)=>{
          this.note = note
        })
      }
    }
  }
</script>