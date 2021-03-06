import Vue from 'vue'

import App from './src/App.vue';
import  './src/czm/libs/util/dragable'
// import cacheUtil from './src/czm/libs/util/cache'
// import webdb from './src/czm/libs/util/cache-webdb'
// import imageCache from './src/czm/libs/util/cache-image'
import axios from 'axios'
// window.$cacheUtil = cacheUtil;
// window.$imageCache = imageCache;
// window.$webdb = webdb;
window.$axios = axios;


new Vue({
    el: '#app',
    render: h => h(App)
});
