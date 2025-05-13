const lazyloadImage = new IntersectionObserver((enteies)=>{
    enteies.forEach((item)=>{
        if(item.isIntersecting){
            const images = item.target.querySelectorAll(".lazyload")
            for(let img of images){
                img.src = img.dataset.src
                img.classList.remove("lazyload")
            }
            lazyloadImage.unobserve(item.target)
        }
    })
})
export function observer(element){
    lazyloadImage.observe(element)
}