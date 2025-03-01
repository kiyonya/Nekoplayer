<template>
    <div class="slider">
        <div class="s"></div>
        <div class="p"></div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.slider{
    position: relative;
    background-color: rgb(255, 9, 9);
    display: flex;
    align-items: center;
}
.p{
    width: 50%;
    height: 100%;
    background-color: blue;
}
.s{
    height: 0.9rem;
    aspect-ratio: 1/1;
    flex-shrink: 0;
    background-color: chartreuse;
    border-radius: 50%;
    position: absolute;
}
</style>