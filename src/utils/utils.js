function debounce(func, wait) {
  let timeout = null;
  return function () {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    let context = this;
    let args = arguments;
    timeout = setTimeout(func.apply(context, args), wait);
  }
}

export default debounce;