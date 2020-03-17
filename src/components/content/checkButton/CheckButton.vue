<template>
  <div class="check-buttom" :class="{check: isChecked}">
    <img src="../../../assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .check-buttom {
    /*改成圆角*/
    border-radius: 50%;
  /*  给边框*/
    border: 2px solid #aaa;
  }

  .check {
    background-color: red;
    border-color: red;
  }
</style>