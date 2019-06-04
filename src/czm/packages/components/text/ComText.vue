<template>
    <div class="text">
     <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "ComText"
    }
</script>

<style scoped>
    .text{background: yellow;padding: 15px;}
</style>