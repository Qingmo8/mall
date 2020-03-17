<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">-->
<!--          {{item}}-->
<!--        </li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "../../network/detail";
  import {itemListenerMixin, backTopMixin} from "../../common/mixin";
  import {debounce} from "../../common/utils";

  import {mapActions} from 'vue'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,

      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
      }
    },
    created() {
      //1.保存传入iid
      this.iid = this.$route.params.iid;

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        const data = res.result;
        //1.获取顶部的图片进行轮播
        this.topImages = data.itemInfo.topImages;
        //2.获取商品信息
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);
        //3.创建获取店铺信息的对象
        this.shop = new Shop(data.shopInfo);
        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo;
        //5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        //6。取出评论信息,判断是否有评论
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      });

      //3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })
      /**标题与内容联动效果*/
      //4.给getThemeTopY赋值（对给this.themeTopYs赋值的操作进行防抖操作）
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

        this.themeTopYs.push(Number.MAX_VALUE)

        // console.log(this.themeTopYs);
      },100)
    },
    mounted() {
      // console.log('mounted');
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },


    methods: {

      imageLoad() {
        this.$refs.scroll.refresh()

        //标题与内容联动
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      //移动到特定位置时，导航栏与内容联动
      contentScroll(position) {
        //1.获取y值
        const positionY = -position.y

        //2.position和导航栏中的值进行对比
        //【0，7893，9423，10025】
        //positoinY在0 和 7893 之间，index=0
        //positoinY在7893 和 9423 之间，index=1
        //positoinY在9423 和 10025 之间，index=2

        //positoinY超过10025，index=3
        /**内容滚动，显示正确的标题*/
        let length = this.themeTopYs.length
        for (let i = 0; i<length; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // if (this.currentIndex !== i && ((i < length-1 && positoinY >= this.themeTopYs[i]
          //     && positoinY <this.themeTopYs[i+1]) || (i === length-1 && positoinY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i;
          //   console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
      },

      //监听滚动位置从而隐藏返回顶部图标
      contentScroll(position) {
        // console.log(position);
        //大于位置1500改为false
        //判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1500
        //2.决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      addToCart() {
        //1.获取购物车需要的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车里
        // this.$store.commit('addCart',product)

        this.$store.dispatch('addCart',product).then(res => {
          // console.log(res)
          // console.log(this.$toast.show);
          console.log(this.$toast);
          this.$toast.show(res, 1500)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  /*给高度*/
  .content {
    /*background-color: #fff;*/
    height: calc(100% - 44px - 49px);
  }

</style>