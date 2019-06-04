<<<<<<< HEAD
import Vue from 'vue'

import App from './src/App.vue';
//require('./src/czm/libs/util/dragable')
import  './src/czm/libs/util/dragable'
=======
import cacheUtil from './src/czm/libs/util/cache'
import webdb from './src/czm/libs/util/cache-webdb'
import imageCache from './src/czm/libs/util/cache-image'
import axios from 'axios'
window.$cacheUtil = cacheUtil;
window.$imageCache = imageCache;
window.$webdb = webdb;
window.$axios = axios;

 
>>>>>>> 37219e3137ba2ea07bc10b9f1574ba2c208d2cab


new Vue({
    el: '#app',
    render: h => h(App)
});