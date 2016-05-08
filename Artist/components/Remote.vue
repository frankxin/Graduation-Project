<template>
  <h1>This is a remote controler</h1>
  <note></note>
  <button @click="prev">Prev page</button>
  <button @click="next">Next page</button>
</template>

<script>
  import io from "socket.io-client"
  import noteComponent from "./Note.vue"
  export default {
    data: function(){
      return {
        socket: null,
        note: ''
      }
    },
    created: function(){
      this.socket = io('http://192.168.8.105:3000/')
      this.bindEvent()
    },
    methods: {
      next: function(){
        this.socket.emit('click right')
      },
      prev: function(){
        this.socket.emit('click left')
      },
      noteRecieve: function(){
        this.socket.on('send note',(note)=>{
          this.note = note
        })
      },
      bindEvent: function(){
        // this.noteRecieve()
        document.onkeydown = (e)=>{
          if(e.keyCode === 39){
            this.socket.emit('click right')
            console.log('i click right')
          }
        }
      }
    },
    components: {
      'note' : noteComponent
    }
  }
</script>