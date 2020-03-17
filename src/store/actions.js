
export default {

  addCart(context,payload) {
   return new Promise((resolve, reject) => {
     // state.cartList.push(payload)
     //1.查找之前数组中是否有该商品
     let oldProduce = context.state.cartList.find(item => item.iid === payload.iid)
     //2.判断oldProduce
     if (oldProduce) {//数量加1
       // oldProduce.count += 1
       context.commit('addCounter',oldProduce)
       resolve('当前的商品数量加1')
     } else {//添加新的商品
       payload.count = 1
       // state.cartList.push(payload)
       context.commit('addToCart',payload)
       resolve('添加新的商品')
     }
   })
  }
}