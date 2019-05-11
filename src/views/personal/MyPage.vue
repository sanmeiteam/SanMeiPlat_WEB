<template>
  <div class="app-container">
    学员使用须知：
    <hr>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {

      }
    },
    created() {

    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    methods: {

    }
  }
</script>
