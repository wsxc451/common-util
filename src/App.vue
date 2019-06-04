<template>
    <div>
        <PageAdmin></PageAdmin>

    </div>
</template>

<script>
    import Vue from 'vue'
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    import PageAdmin from '../src/czm/packages/admin/index'
    import Grids from './czm/packages/dpage/Grids'
    Vue.use(ElementUI)
    Vue.use(PageAdmin)
    export default {
        name: "App",
        components:{ Grids }
    }
</script>

<style scoped>

</style>