
const  IntersectionAPI = {
  observer: null,
  callbacks: new Map(), 
  init(options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      ...defaultOptions,
      ...options,
    });
  },

  handleIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const callback = this.callbacks.get(target);

        if (callback) {
          callback(target); 
          this.observer.unobserve(target); 
          this.callbacks.delete(target); 
        }
      }
    });
  },

  observe(element, callback) {
    if (!element || !callback) {
      console.error('Element and callback are required.');
      return;
    }

    this.callbacks.set(element, callback); 
    this.observer.observe(element); 
  },
};
export default IntersectionAPI



