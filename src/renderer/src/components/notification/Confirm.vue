<template>
    <ModalWindow :title="title" v-if="show" @close="()=>{
        show = false;
        this.$emit('cancel')
    }" :min-width="'20rem'" :min-height="'8em'">
        <div class="confirm">
            <div class="msg">{{ msg }}</div>
            <div class="buttons">
                <button v-for="btn in buttons" @click.stop="this.$emit('select',btn?.act || 'anom')" :class="btn.style">
                    {{ btn.label }}
                </button>
            </div>
        </div>
    </ModalWindow>
</template>
<script>
import ModalWindow from '../windows/ModalWindow.vue';
export default{
    data(){
        return{
            show:true
        }
    },
    components:{
        ModalWindow
    },
    props:['title','msg','buttons'],
    emits:['select','cancel']
}
</script>
<style scoped>
.confirm{
    width: 25rem;
    height:10rem;
    display: flex;
    flex-direction: column;
    color: var(--text);
    justify-content: space-between;

    .msg{
        font-size: 1rem;
        color: var(--text-o-2);
    }

    .buttons{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;


        button{
            width: fit-content;
            height: fit-content;
            padding: 0.5rem 1rem;
            min-width: 8rem;
            font-size: 1.2rem;
            color: inherit;
            border: none;
            font-weight: bold;
            background: var(--ui);
            border-radius: 3rem;
        }

        .strong{
            color: white;
            background: var(--strong);
        }
    }
}





</style>