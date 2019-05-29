# common-util 通用函数库提取

### Why?
### 为了优化前端接口调用,我们可能需要限制访问后台的频率.随意在我们的项目中,使用了一些技术,失效数据首次访问远程后,吧数据存入内存中(闭包实现),
### 限制使用了2个方向的优化,一个是Promise的缓存,一个是Ajax返回后的数据缓存;


```sh
npm install 尚未发布:>
```

## 函数封装了cachePromise 
```js

$cacheUtil.cachePromise('getGoods',
                        new Promise(()=>{}),
                        {cache:true,lasttime:3}
                        ).then(res=>console.log('ret',res) );


```
## 函数封装了cachePost  
#### 为了方便后期变更ajax实例对象,所以第一个参数传入ajax的实例(如果自己写要包含post,get方法哦)
```js

let url = 'https://etradetest.linkedcare.cn/etrade/product/productClass';
let params = {shoppingGroup:0, tenantId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51',userId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51:55:80'};
           
$cacheUtil.cachePost($axios,
                    url,
                    params,
                    {cache:true,lasttime:3}
                   ).then(res=>console.log('ret',res) );

```
## 函数封装了cacheGet 
#### 为了方便后期变更ajax实例对象,所以第一个参数传入ajax的实例(如果自己写要包含post,get方法哦)
```js
let url = 'https://etradetest.linkedcare.cn/etrade/product/productClass';
let params = {shoppingGroup:0, tenantId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51',userId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51:55:80'};
           
$cacheUtil.cacheGet($axios,
                    url,
                    params,
                    {cache:true,lasttime:3}
                   ).then(res=>console.log('ret',res) );

```

## demo
```js
        import cacheUtil from './src/czm/libs/util/cache'
        import axios from 'axios'
        window.$cacheUtil = cacheUtil;
        window.$axios = axios;
        
         function getPromise(key,params) {
                return new Promise((rj,re)=>{
                      rj({key:key,params:params,timestamp:new Date().getTime()})
                 }
                );
        }

       function testPromise() {
            window.$cacheUtil.cachePromise('getGoods',getPromise('p1',{id:10001}),{cache:true,lasttime:3}).then(res=>{
                console.log('ret',res)
            });
        }
        
        function testPost() {
            let url = 'https://etradetest.linkedcare.cn/etrade/product/productClass';
            let params = {shoppingGroup:0, tenantId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51',userId:'8ff89de7-1c0b-4849-93b9-e68e8e201d51:55:80'};
            window.$cacheUtil.cachePost(window.$axios, url, params,{cache: false, lasttime: 3}).then(res => {console.log('ret', res)});
        }
```


