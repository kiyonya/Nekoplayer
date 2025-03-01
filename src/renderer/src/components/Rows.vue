<template>
    <div class="row">
        <button class="b" @click.stop="this.$refs.view.scrollLeft -= this.$refs.view.clientWidth" @dblclick.stop="this.$refs.view.scrollLeft = 0">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20" class="fa"><path  d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z"/></svg>

        </button>
        <div class="view" ref="view">
            <div class="grid" :style="{gridTemplateRows:`repeat(${row},1fr)`,gridTemplateColumns:`repeat(${Math.ceil(length / row)},calc(${(100 / (col || row))}% - (${((col || row) - 1).toString()} * ${gap[1]}) / ${row}))`,gap:`${gap[0]} ${gap[1]}`}" ref="grid">
                <slot></slot>
            </div>
        </div>
        <button class="b" @click.stop="this.$refs.view.scrollLeft += this.$refs.view.clientWidth;" @dblclick.stop="this.$refs.view.scrollLeft = this.$refs.view.scrollWidth">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="fa" ><path d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z"/></svg>

        </button>
    </div>
</template>
<script>
    export default{
        data(){
            return{
            }
        }
        ,
        props:["row","length","gap","col"]
    }
</script>
<style>
.row{
    width: 100%;
    height: 15rem;
    display: flex;
    flex-direction: row;
}
.b{
    width: 2rem;
    height: 100%;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.view{
    height: 100%;
    width: calc(100% - 4rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    position: relative;
}
.view::-webkit-scrollbar{
    display: none;
}
.grid{
    width: 100%;
    height: 100%;
    display: grid;
}
.fa{
    width: 70%;
}
.disable{
    opacity: 0.5;
    pointer-events: none;
}
</style>