<template>
  <div id="app">
    <router-view class='root-view'></router-view>
  </div>
</template>

<script>
  export default {
    name: 'file-system'
  }
</script>

<style>
  .root-view {
    height: 100% !important;
  }
</style>
