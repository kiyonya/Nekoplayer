<template>
  <div class="check">
    <input type="checkbox" name="autoSetup" id="autoSetup" class="checkbox" @change="$emit('value',$event.target.checked)" :checked="bind || false"/>
    <span class="label">{{ label || "这是一个单选框" }}</span>
  </div>
</template>
<script>
export default {
  props: ['label','bind']
}
</script>
<style scoped>
.check{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.6rem;
}
.checkbox{
    width: 1rem;height: 1rem;
    font-weight: bold;
    appearance: none;
    background: var(--hover);
    border-radius: 0.2rem;
}
.checkbox:checked{
    background: var(--strong);
    ~span{
        color: var(--strong);
    }
}
.label{
   font-weight: bold;
   font-size: 1rem;
   opacity: var(--text-o-2);
}

</style>
