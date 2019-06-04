# common-util 通用函数库提取

### Why?? 万物皆可盘(缓存)
### 为了优化前端接口调用,我们可能需要限制访问后台的频率.随意在我们的项目中,使用了一些技术,失效数据首次访问远程后,把数据存入内存中(闭包实现),
### 限制使用了2个方向的优化,一个是Promise的缓存,一个是Ajax返回后的数据缓存;


```sh
npm install 尚未发布:>
```

## 函数封装了cachePromise  cache:是否缓存, lasttime:缓存时间(秒),过期后自动再次获取
```js

$cacheUtil.cachePromise('getGoods',
                        new Promise(()=>{}),
                        {cache:true,lasttime:3}
                        ).then(res=>console.log('ret',res) );


```
## 函数封装了cachePost  
#### 为了方便后期变更ajax实例对象,所以第一个参数传入ajax的实例(如果自己写要包含post,get方法哦) cache:是否缓存, lasttime:缓存时间(秒),过期后自动再次获取
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
#### 为了方便后期变更ajax实例对象,所以第一个参数传入ajax的实例(如果自己写要包含post,get方法哦) cache:是否缓存, lasttime:缓存时间(秒),过期后自动再次获取
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


## 函数封装了cacheImage 
####  封装了图片远程加载到后缓存base64到内存(闭包函数)   cache:是否缓存, lasttime:缓存时间(秒),过期后自动再次获取
```js
let imageUrl = 'https://oscimg.oschina.net/oscnet/d49ee0030b41c8ed36ff85e442767f0cfd5.jpg';
$cacheUtil.cacheImage(imageUrl,{cache:true,lasttime:3}) .then(base64=>console.log(base64) );

```

## demo
```js
import imageCache from './src/czm/libs/util/cache-image' 
 window.$imageCache = imageCache;
        function testImageCache(){
            let imgTest = [
                'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/03/02/ChMkJlv9AveIDfZfACROyMb514AAAtasgOPc88AJE7g811.jpg',
                'https://oscimg.oschina.net/oscnet/d49ee0030b41c8ed36ff85e442767f0cfd5.jpg'
            ]

            for(let i=0;i<imgTest.length;i++){
                window.$imageCache.cacheImage(imgTest[i],{lasttime:10})
                 .then(base64=>{
                    let img = new Image();
                    img.src = base64;
                    document.body.append(img);
                    window.$imageCache.log()
                }
              );
            }
        }

```



## 函数封装了模拟实现sql 操作 ( 数据量不要太大,因为是存在闭包里面, 一千以内数据没问题,缓存商品分类啊,资讯标题啊...)
####   本人能力有限,所以写的是单表操作,而且不支持复杂的组合, 主要是数据查询语句解析分解不会!!!!
#### 还是把表明作为key,数据作为value,存储; 过滤字段,还有过滤数据,都是在全局中匹配过滤的. 所以性能肯定不是mysql那样的;
```js
import webdb from './src/czm/libs/util/cache-webdb'
 window.$webdb = webdb;
//模拟 INSERT 操作 
 window.$webdb.insert("INSERT INTO goods (name,age,type) VALUES ('xiaoming',29,1) ")
//模拟 INSERT 操作 Obj形式
 window.$webdb.insert("tablename",{name:'daming',age:20,type:1})


//模拟 SELECT 操作 
 window.$webdb.select("SELECT name,age,type FROM goods WHERE age >= 50 AND type = 1")
//模拟 UPDATE 操作 
 window.$webdb.update("UPDATE goods SET (name,age,type) VALUES ('mayun',80,2) WHERE age >= 50 AND type = 1")
//模拟 DELETE 操作 
 window.$webdb.delete("delete WHERE age >= 50 AND type = 1")
```
