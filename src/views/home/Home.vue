<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"
                 ref="tabControl1" class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll"
           :pull-up-load="true" @pullingUp="loadMore"><!-- 时时监听，上拉加载   -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
<!--    <goods-list :goods="goods[currentType].list"></goods-list>-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
<!--    <back-top @click.native="backClick" v-show="true"></back-top>-->
  </div>
</template>

<script>
  // 跟当前页面有关的
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

// 公共的，跟业务有关的
  import NavBar from "../../components/common/navbar/NavBar";
  import TabControl from "../../components/content/tabcontrol/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";
  import BackTop from "../../components/content/backTop/BackTop";

  // 网络,工具
  import {getHomeMultidata, getHomeGoods} from "../../network/home";
  import {debounce} from "../../common/utils";
  import {itemListenerMixin} from "../../common/mixin";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
    },
    mixins: [itemListenerMixin],
    data() {
      //保存一开始请求到的数据
      return {
        banners: [],
        recommends: [],
        //流行，精选，新款里面请求到的数据
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        //一开始默认
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    // //销毁函数
    // destroyed() {
    //   // console.log('home destroyed');
    // },
    // 进来
    activated() {
      // console.log('activated');
      //进来时调用位置
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      //刷新
      this.$refs.scroll.refresh()
    },
    //离开
    deactivated() {
      // console.log('deactivated');
      //离开时记录位置
      // this.saveY = this.$refs.scroll.scroll.y
      this.saveY = this.$refs.scroll.getScrollY()
      // console.log(this.saveY);
    },
    //生命周期,一开始就活跃
    created() {
      //1.请求到的多个数据
      //一开始请求到的数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {

      //3。手动代码点击一次
      // this.tabClick(0)


      /**
       * 防抖操作重新封装到common->mixin中，下面的也可以用
       * */
      // //1.图片加载完成的事件监听
      // //防抖操作,50毫秒
      // const refresh = debounce(this.$refs.scroll.refresh,50)
      //
      // // 3.监听item中图片是否加载完成  bug
      // this.$bus.$on('itemImageLoad', () => {
      //   // console.log('----');
      //   //重新再执行，定义高度
      //   // this.$refs.scroll.scroll.refresh()
      // //   refresh()
      // })
    },
    methods: {
      /**
       * 事件监听相关的方法*/
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      //监听返回顶部
      backClick() {
        //不封装监听
        // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
        //封装监听
        this.$refs.scroll.scrollTo(0, 0)

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
      //上拉加载更多
      loadMore() {
        // console.log('上拉加载');
        //正在记录是哪个类型，流行或者新款
        this.getHomeGoods(this.currentType)

      },
      swiperImageLoad() {
        //2.获取tabControl的offsetTop
        //所有的组件都有一个属性$el：用于获取组件中的元素
        // console.log(this.$refs.tabControl2.$el.offsetTop);
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /**
       * 网络请求相关的方法*/
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        //动态获取页码数
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          //添加保存
          this.goods[type].list.push(...res.data.list)
          // for (let n of res.data.list) {
          //   this.goods[type].list.push(n)
          // }
          this.goods[type].page += 1


          //上拉加载
          //自动调用才能进行下一次调用
          // this.$refs.scroll.scroll.finishPullUp()
          //进行封装的调用
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*在使用浏览器原生滚动时，为了导航不跟一起滚动*/
    /*padding-top: 44px;*/

  /*  当前窗口视图满屏*/
    height: 100vh;

    position: relative;
  }

  .home-nav {
    color: #fff;
    background-color: var(--color-tint);
  /*在使用浏览器原生滚动时，为了导航不跟一起滚动*/
  /*  定位最上面导航*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 0;*/
  /*  z-index: 9;*/
  }
  /*不起作用*/
  /*.tab-control {*/
  /*  !*原生的滚动停留到顶部*!*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/

  /*设置滑动的样式*/
  .content {
    overflow: hidden;

    /*计算可以滑动的区域*/
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content {*/
  /*  !*上面的导航和下面的导航一共93*!*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/

  .tab-control {
    /*相对定位*/
    position: relative;
    z-index: 9;
  }

</style>