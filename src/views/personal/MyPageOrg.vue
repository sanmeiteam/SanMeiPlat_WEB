<template>
  <div class="app-container">
    承办方首页，建设中...
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
