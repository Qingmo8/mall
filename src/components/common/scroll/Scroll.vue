<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      //是否要时时监听，0，1不是时时监听，2只监听一次，3事时监听
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click:true,
        //是否要时时监听，0，1不是时时监听，2只监听一次，3事时监听
        probeType: this.probeType,
        //上拉
        pullUpLoad: this.pullUpLoad,
      })
      //2.监听滚动的位置
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        //自定义事件，将其传出去
        this.$emit('scroll', position)
      })



      //不封装监听  监听的组件返回按钮需要的坐标
      // this.scroll.scrollTo(0, 0),

      //3.监听上拉加载事件
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多');
        //自定义发出事件：上拉加载
        this.$emit('pullingUp')
      })
    },
    //封装监听  监听的组件返回按钮需要的坐标
    methods: {
      scrollTo(x, y, time=200) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      //图片加载完就执行一次refresh，以解决上拉时的卡顿bug
      //封装图片加载完成重新计算高度bug
      refresh() {
        // console.log('----');
        this.scroll && this.scroll.refresh()
      },
      //主动调用的封装,home进行调用
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      //记录位置
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>