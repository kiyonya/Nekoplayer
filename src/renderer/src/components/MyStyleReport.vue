<template>
    <div class="mask"></div>
    <div class="style-report">
        

    </div>
</template>
<script>

</script>
<style>
    .style-report{
        width: 45%;
        height: 90%;
        background: var(--app-theme);
        position: fixed;
        z-index: 151;
        left: 27.5%;
        top: 5%;
        border-radius: 0.5rem;
        box-shadow: 1px 1px 8px #0000001d;
    }
    .mask{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 149;
        left: 0;
        top: 0;
        backdrop-filter: brightness(0.9) blur(1px);
    }
</style>