<template>
  <div class="app">
    <form id="search">
      Search <input name="query" v-model="searchQuery">
    </form>
    <div is="demo-grid"
      v-bind:data="gridData"
      v-bind:columns="gridColumns"
      v-bind:filter-key="searchQuery">
    </div>


    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <!-- use the modal component, pass in the prop -->
    <modal :show.sync="showModal">
      <!--
        you can use custom content here to overwrite
        default content
      -->
      <h3 slot="header">custom header</h3>
    </modal>
  </div>
</template>

<script>
import DemoGrid from './DemoGrid.vue'
import Modal from './Modal.vue'

export default {
  data: function() {
    return {
      searchQuery: '',
      showModal: false,
      gridColumns: ['name', 'power'],
      gridData: [{
        name: 'Chuck Norris',
        power: Infinity
      }, {
        name: 'Bruce Lee',
        power: 9000
      }, {
        name: 'Jackie Chan',
        power: 7000
      }, {
        name: 'Jet Li',
        power: 8000
      }]
    }
  },
  components: {
    DemoGrid,
    Modal
  }
}
</script>