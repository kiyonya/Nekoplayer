export function debounce(func, wait, immediate = false) {
  let timeout
  return function (...args) {
    const context = this
    if (immediate && !timeout) {
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args)
      }
      timeout = null
    }, wait)
  }
}
