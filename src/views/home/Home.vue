<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
  </div>
</template>

<script>
  import NavBar from "../../components/common/navbar/NavBar";
  import {getHomeMultidata} from "../../network/home";

  export default {
    name: "Home",
    components: {
      NavBar
    },
    data() {
      //保存一开始请求到的数据
      return {
        banners: [],
        recommends: []
      }
    },
    //生命周期,一开始就活跃
    created() {
      //1.请求到的多个数据
      getHomeMultidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    }
  }
</script>

<style scoped>
  .home-nav {
    color: #f2f2f2;
    background-color: var(--color-tint);

  }

</style>