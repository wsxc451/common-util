<template>
    <div>
        <PageAdmin></PageAdmin>
    </div>
</template>

<script>
    import Vue from 'vue'
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    import PageAdmin from './czm/packages/admin/PageAdmin'
    Vue.use(ElementUI)
 //   Vue.use(PageAdmin)
    export default {
        name: "App",
        components:{ PageAdmin  }
    }
</script>

<style scoped>

</style>