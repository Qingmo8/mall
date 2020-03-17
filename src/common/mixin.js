import {debounce} from "./utils";
import BackTop from "../components/content/backTop/BackTop";
import {POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    let newRefesh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      newRefesh()
    }
    this.$bus.$on('itemIMgLoad', this.itemImgListener)
    // console.log('我是混入');
  }
}


//回到顶部
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
      isTabFixed: false,
    }
  },
  methods: {

    //监听返回顶部
    backClick() {
      //不封装监听
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      //封装监听
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}


export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}