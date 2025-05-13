<template>
    <div class="v-progress">
        <span class="progress-current _v-p-span">{{ formatSecond(this.currentTime) }}</span>
        <input type="range" name="" id="" min="0" max="1" step="0.001" class="v-p-slider" :style="`--progress:${this.progress.toFixed(5) * 100}%`"  @input="updateTime" v-model="value">
        <span class="progress-full _v-p-span">{{ formatSecond(this.duration) }}</span>
    </div>
</template>
<script>
import {formatSecond} from "../utils/timers";
export default {
    data() {
        return {
            progress: 0,
            calProgress: '',
            value:0
        }
    },
    methods: {
        formatSecond,
        updateTime(){
            this.$audio.changeTime(this.value * this.duration)
        }
    },
    props: ['currentTime','duration','prg'],
    watch:{
        currentTime(){
            this.progress = this.currentTime / this.duration ? this.currentTime / this.duration : 0
            this.value = this.progress.toFixed(10)
        }
    }
}
</script>
<style>
.v-progress {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    gap: 0.5rem;
}

.v-progress ._v-p-span {
    font-size: 0.9rem;
    font-weight: bold;
    position: relative;
}

.v-progress .v-p-slider {
    --m: var(--progress-slider-progress);
    --b: var(--progress-slider-background);
    --progress: 0%;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    flex: 1;
    height: 3px;
    background: -webkit-linear-gradient(var(--m), var(--m)) no-repeat var(--b);
    background-size: var(--progress) 100%;
    border-radius: 5px;
    flex-shrink: 0;
}

.v-progress .v-p-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: var(--progress-slider-thumb);
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    box-shadow: 1px 1px 2px #00000034;
}

.v-progress .v-p-slider:hover::-webkit-slider-thumb {
    opacity: 1;
}
</style>