<template>
    <div class="sg">
        <img src="@/assets/images/pgup.svg" alt="" class="left i icon" @click="left">
        <div class="dsp" ref="displayArea">
            <div class="grid" :style="{ gridTemplateColumns: `repeat(${Math.ceil(this.array.length / 3)},32%)` }">
                <div class="shell" v-for="song in this.array">
                  <RcmdSong :cover="song.al.picUrl" :name="song.name" :artist="song.ar"
                    :key="song.id" :id="song.id"></RcmdSong>  
                </div>
            </div>
        </div>
        <img src="@/assets/images/pgdn.svg" alt="" class="right i icon" @click="right">
    </div>
</template>
<script>
import { ref } from 'vue';
import RcmdSong from './Song_Small.vue';
export default {
    components: {
        RcmdSong
    },
    data() {
        return {
            showLeft:undefined,
            showRight:undefined,
        }
    },
    methods:{
        left(){
            this.$refs.displayArea.scrollLeft -= this.$refs.displayArea.clientWidth
            console.log(this.showLeft)
        },
        right(){
            this.$refs.displayArea.scrollLeft += this.$refs.displayArea.clientWidth
        }
    },
    mounted(){
        this.showLeft = (this.$refs.displayArea.scrollLeft !== 0)
        this.showRight = (this.$refs.displayArea.scrollRight !== 0)
    },
    props: ['array']
}
</script>
<style scoped>
.sg {
    width: 100%;
    height:fit-content;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.dsp{
    flex: 0.99;
    display: flex;
    align-items: center;
    justify-content: center;
    height:fit-content;
    position: relative;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    mask: linear-gradient(90deg,#000000fe 0%, #000 2%,#000,98%,transparent);
}
.dsp::-webkit-scrollbar{
    display: none;
}
.grid {
    width: 100%;
    height: fit-content;
    display: grid;
    grid-template-rows: repeat(3,3cqw);
    gap: 1rem calc(2%);
    
}
.re-song{
    flex-shrink: 0;
    
}
.shell{
    width: 100%;
    scroll-snap-align: start;
    position: relative;
}
.shell::before{
    content: "";
    width: 100%;
    height: 1px;
    top: -0.5rem;
    position: absolute;
    background-color: var(--devide-color-l);
}
.i {
    width: 1.2cqw;
    transform: scaleY(1.5);
   opacity: var(--text-opacity-3);
}
</style>