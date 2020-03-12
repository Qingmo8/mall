
//防抖操作，delay等的时间
export function debounce(func, delay) {
  let  timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    },delay)
  }
}