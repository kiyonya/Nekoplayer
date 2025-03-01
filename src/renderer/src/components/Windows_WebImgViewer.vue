<template>
    
    <div class="viewer">
        <button class="exit"><img src="@/assets/images/close.svg" alt="" class="i icon" @click="$emit('close',true)"></button>
        <div class="img-ctn">
            <img :src="this.img" alt="" class="img"
                @wheel="calcScale($event)"
                :style="{ transformOrigin: `${this.ix}px ${this.iy}px`, transform: `scale(${this.scale})` }">
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            ix: 0,
            iy: 0,
            scale: 1,
        }
    },
    methods: {
        calcScale(e) {
            e.preventDefault()
            this.ix = e.layerX ;
            this.iy = e.layerY ;
            if (e.deltaY < 0) {
                this.scale += 0.1
            }
            else {
                if (this.scale >= 0.5) {
                    this.scale -= 0.1
                }
            }
        },
    },
    props:['img']
}
</script>
<style scoped>
@keyframes viewer-in {
    from{
        opacity: 0;
        transform: translateY(-100px);
    }
}
.viewer {
    width: 100vw;
    height: 100vh;
    backdrop-filter: brightness(0.5);
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    display: flex;
    
}

.img-ctn {
    width: 65vw;
    height: 75vh;
    margin: auto;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    animation:  viewer-in .3s ease;
}

.img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    position: absolute;
}
.exit{
    width: 2cqw;
    aspect-ratio: 1/1;
    position: absolute;
    right: 4rem;
    top: 2rem;
    border: none;
    background-color: transparent;
    border-radius: 8px;
}
.i{
    width: 5em;
    transition: .4s;
}
.i:hover{
    transform: rotate(180deg);
}
</style>