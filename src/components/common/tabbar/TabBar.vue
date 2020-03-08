<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "TabBar"
  }
</script>

<style scoped>
  #tab-bar {
    display: flex;
    background-color: #f2f2f2;

  /*  跑到下面*/
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;

  /*  搞阴影*/
    box-shadow: 0px -3px 1px rgba(100,100,100,.2);
  }
</style>