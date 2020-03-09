<template>
  <div class="recommend">
    <div v-for="item in recommends" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
  
</template>

<script>
  export default {
    name: "RecommendView",
    props: {
      recommends: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>
  .recommend {
    /*水平*/
    display: flex;
    /*居中*/
    text-align: center;
    width: 100%;
    font-size: 12px;
    padding: 15px 0 30px;
    border-bottom: 8px solid #eee;
  }

  .recommend-item {
  /*  均匀分布*/
    flex: 1;
  }

  .recommend-item img {
    width: 70px;
    height: 70px;
    margin-bottom: 10px;
  }

</style>