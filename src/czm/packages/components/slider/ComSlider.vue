<template>
    <div class="slider">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Slider"
    }
</script>

<style scoped>
.slider{background: blue;
    width: 100%;min-height: 200px;
    overflow: hidden;;
    box-sizing: border-box;
}
</style>