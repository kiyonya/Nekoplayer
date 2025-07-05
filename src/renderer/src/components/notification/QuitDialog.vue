<template>
    <ModalWindow :title="title" v-if="show" @close="() => {
        show = false;
        this.$emit('cancel')
    }" :min-width="'20rem'" :min-height="'8em'">
        <span v-if="msg" class="msg">{{ msg }}</span>
        <div class="confirm">
            <button v-for="b in buttons" @click="() => {
                show = false;
                this.$emit('select', b.act)
            }">{{ b.label }}</button>
        </div>
    </ModalWindow>
</template>
<script>
import ModalWindow from '../windows/ModalWindow.vue';
export default {
    data() {
        return {
            show: true
        }
    },
    components: {
        ModalWindow
    },
    props: ['title', 'msg', 'buttons'],
    emits: ['select', 'cancel', 'nevershow']
}
</script>
<style scoped>
.msg {
    font-size: 1rem;
    color: var(--text-o-2);
}
span {
    color: var(--text-o-1);
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.confirm {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    button {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.25rem;
        background-color: var(--component-diff);
        color: var(--text-o-1);
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
    }

    button:hover {
        background: var(--strong);
        color: white;
    }

}
</style>