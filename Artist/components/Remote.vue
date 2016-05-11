<template>
  <div class="m-remote">
    <h3>This is a remote controler</h3>
    <note></note>
      <!-- Accent-colored raised button with ripple -->
    <button @click="prev" class="m-btn-left mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent m-btn">
      Prev page
    </button>
    <button @click="next" class="m-btn-right mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent m-btn">
      Next page
    </button>
  </div>

 <!--  <button @click="prev">Prev page</button>
  <button @click="next">Next page</button> -->
</template>

<script>
  import io from "socket.io-client"
  import noteComponent from "./Note.vue"
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
      this.bindEvent()
    },
    methods: {
      next: function(){
        console.log('click right')
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
<style>
  .m-remote{
    width: 100%;
    /*height: 100%;*/
    overflow: hidden;
  }
  button.m-btn-left{
    left: 0;
  }
  .mdl-button--accent.mdl-button--accent.mdl-button--raised.m-btn-right{
    right: 0;
    background-color: rgb(33, 150, 243);
  }
  button.m-btn{
    position: fixed;
    bottom: 0;
    width: 50%;
    height: 13rem;
    font-size: 2rem;
    display: inline-block;
    margin-top: 10px;
  }
</style>