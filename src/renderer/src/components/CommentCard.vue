<template>
<div class="comment">
    <div class="user">
        <div class="user-avatar"> 
            <img :src="useravatar" alt="" class="blur" crossorigin="anonymous" >
            <img :src="useravatar" alt="" class="main" crossorigin="anonymous" >
        </div>
        <div class="user-detial">
            <div class="user-name" @click="$emit('userclick',userid)">{{ username }}</div>
            <span>
                <span class="ip">{{ ip }}</span>
                <span class="time">{{ timestr }}</span>
            </span>
        </div>
    </div>
    <div class="content" v-html="content.replace(/\n/g,'<br/>')">

    </div>
    <div class="action">



    </div>
</div>
</template>
<script>
    export default {
        props:['username','useravatar','userid','commentid','content','bereplied','ip','highlight','liked','likes','time','timestr'],
        emits:['userclick','commentclick','like'],

        methods:{
            formatContent(raw){
                return raw.replace('\n','<br/>').replace(/<[^>]+>/g,'').replace(/@\[.*?\]/g,'')
            }
        }
    }
</script>
<style scoped>
.comment{
    width: 100%;
    height: fit-content;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 1rem ;
    background: var(--component-diff);
    border-radius: var(--br-2);
    gap: 1rem;
    .user{
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .user-avatar{
        width: 3rem;
        height: 3rem;
        position: relative;
        margin-right: 1rem;
        display: flex;
        justify-content: center;
        img{
            position:absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            aspect-ratio: 1/1;
            border-radius: 50%;
        }
        .blur{
            width: 90%;
            height: 90%;
            filter: blur(5px);
            z-index: 0;
            bottom: -3px;
            opacity: 0.3;
        }
    }
    .user-avatar:hover{
        cursor: pointer;
        .blur{
            bottom: -6px;
        }
    }
    .user-detial{
        display: flex;
        flex-direction: column;

        .user-name{
            font-size: 1rem;
            font-weight: bold;
            color: var(--text-o-1);
            cursor: pointer;
        }
        .user-name:hover{
            text-decoration: underline;
        }
        .ip{
            font-size: 0.8rem;
            color: var(--text-o-4);
            margin-right: 0.5rem;
        }
        .time{
            font-size: 0.8rem;
            color: var(--text-o-4);
        }
    }

    .content{
        width: 100%;
        font-size: 1rem;
        color: var(--text-o-2);
        line-height: 1.5rem;
        word-break: break-word;
    }
}


</style>