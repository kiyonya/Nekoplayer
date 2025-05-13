<template>
    <div class="page">
        <div class="ctx" ref="ctx">
            <div class="g">
                <h1>NEKOPLAYER</h1>
                <span>猫猫播放器</span>
            </div>
            <div class="g">
                <p>这是我的第一个vue作品</p>
                <p>也是我自学前端做的最大的工程</p>
                <p>还有诸多不足 请多赐教</p>
            </div>
            <div class="g">
                <h2>程序</h2>
                <h3>阿清喵(Kiyonya)</h3>
            </div>
            <div class="g">
                <h2>鸣谢</h2>
                <h3>御坂</h3>
            </div>
            <div class="g">
                <p>基于Neteast Cloud Music Api</p>
                <a href="https://gitlab.com/Binaryify/NeteaseCloudMusicApi" target="_blank">github仓库</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
    }
</script>
<style scoped>
@keyframes scroll {
    to{
        transform: translateY(-60%);
    }
}
.ctx{
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 9rem;
    position: absolute;
    transform: translateY(100%);
    animation:  scroll 30s linear forwards;
}
h1{
    font-size: 2rem;
}
span{
    font-size: 1.1rem;
    opacity: 0.5;
}
p{
    font-size: 1.3rem;
    opacity: 0.75;
}
.g{
    display: flex;
    flex-direction: column;
    text-align: center;
   gap: 0.5rem;
}
a{
    text-decoration: none;
    color: var(--text-color);
}
</style>