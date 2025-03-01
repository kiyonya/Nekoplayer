<template>
    <Teleport to="body" @click="this.$emits('click')">
        <div class="msg">
            <span>{{ msg }}</span>
        </div>
    </Teleport>
</template>
<script>
    export default{
        name:'MessageNotification',
        props:{
            msg:{
                type:String,
                default:()=>"信息"
            }
        },
        emits:['click']
    }
</script>
<style scoped>
@keyframes msgin {
    from{
        transform: translateY(50px);
        opacity: 0;
    }
}
.msg{
    width: 5rem;
    height: fit-content;
    box-sizing: border-box;
    padding: 0.3rem 0.5rem;
    background: var(--component);
    box-shadow: var(--shadow-flow);
    position: fixed;
    z-index: 9999999;
   left: calc(50% - 2.5rem);
   bottom: 5.6rem;
   color: var(--text);
   border-radius: var(--br-3);
   text-align: center;
   animation: msgin .5s cubic-bezier(0.39, 0.575, 0.565, 1);
}
</style>