/***
 * 缓存工具类模块工具类
 * @author 曹志明
 * @date 2019-5-29
 */
(function () {

    // 根据不同的模块环境变量，决定root的值
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global =='object' && global.global ===global && global ||
        this || {};


    var _ = function () {
        if(!(this instanceof _)) {return new _()}
    };



    /***
     * promise缓存函数
     * @param key 缓存key
     * @param promiseObj 需要缓存的promise,当首次或者失效时,会调用这个promise,再次调用时,会直接取上次的promise ,
     *                   需要注意,这里要传入一个new Promise,而不要传入一个promise实例,否则,promise不会变化
     * @param options 一些参数,如lasttime (缓存时间秒为单位),cache(是否缓存标识符true|false)
     * @returns
     */
    _.cachePromise = function (){
       return  pCachePromise.apply(this,arguments)
    }



    /***
     * Ajax缓存函数
     * @param key 缓存key
     * @param ajaxInstance axios|httpjs. ajax实例对象
     * @param method POST,GET
     * @param params ajax 参数
     * @param options 一些参数,如lasttime (缓存时间秒为单位),cache(是否缓存标识符true|false)
     * @returns
     */
    _.cacheAjax = function (ajaxInstance,url,method,params,options){
        return  pCacheAjax.apply(this,[ajaxInstance,url,'POST',params,options])
    }


    _.cachePost = function (ajaxInstance,url,params,options){
        return  pCacheAjax.apply(this,[ajaxInstance,url,'POST',params,options])
    }


    _.cacheGet = function (ajaxInstance,url,params,options){
        return  pCacheAjax.apply(this,[ajaxInstance,url,'GET',params,options])
    }



    _.test = function(){
        console.log('_test',arguments)
    }


    /**--------------------common Inner Class ----------------Begin**/

    /***
     * 按照key值缓存Promise,如果同名的promise已经存在,则直接返回promise
     * 一个闭包函数,返回一个方法,这个方法接收一个key,一个promise实例,返回这个promise,如果第一次,则创建,如果第二次,则直接返回
     * @type {Function}
     */
    var pCacheAjax = (function() {

        var cacheArr = [];

        /**
         * 默认配置
         * @type {{cache: boolean, lasttime: number}}
         * @private
         */
        var __cacheAjaxDefaultOptions = {
            cache:true,
            lasttime:60
        };

        return  function (ajaxInstance,url,method,params,options) {
            var axios = ajaxInstance;
            let optionsMerge = Object.assign(__cacheAjaxDefaultOptions,options);
            //检测url是否已经访问过,如果已经访问过,则直接读取缓存的json

            if(_isExits(url)==true){
                let cacheData = _getExits(url);
                if(_isExpire(cacheData)===true){
                    console.log('expire',cacheArr)
                    return  new Promise((resolve,reject)=> {
                        var ajaxPromise = _getPromiseByMethod(url,axios,method,params);
                        ajaxPromise.then(res => {
                            cacheData.createtime = (new Date().getTime());
                            cacheData.endtime = (new Date().getTime() + optionsMerge.lasttime*1000);
                            cacheData.ret = res;
                            resolve(res);
                            console.log('数据已经存在,但过期了,重新获取并返回')
                        }).catch(err=>reject(err));
                    });
                }else{
                    return  new Promise((resolve,reject)=>{
                        console.log('数据已经存在,直接返回未过期')
                        resolve(cacheData)
                    });
                }


            }else{
                console.log('数据不存在,创建并返回')
                 var ajaxPromise = _getPromiseByMethod(url,axios,method,params);
                 return  new Promise((resolve,reject)=> {
                      ajaxPromise.then(res => {
                        cacheArr.push({
                            key: url, createtime: (new Date().getTime()),
                            endtime: (new Date().getTime() + optionsMerge.lasttime * 1000), retData: res
                        });

                        resolve(res);
                    }).catch(err=>reject(err));
                });
            }


        };


        function _getPromiseByMethod(url,axios,method='POST',params) {
            if(method&&method.toUpperCase()==='POST'){
                return new Promise((resolve,reject)=>{
                    var params = new URLSearchParams();
                    Object.keys(params).forEach((key)=>{
                        params.append(key, Object.key);
                    });

                    axios.post(url, params).then( (response)=> {
                        resolve(response)
                    }).catch( (error)=> {
                        reject(error)
                    });
                });
            }else{
                return new Promise((resolve,reject)=> {
                    axios.get(url, {
                        params: params
                    }).then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        reject(error)
                    });
                });
            }

        }

        function _isExpire(proObj) {
            let {endtime} = proObj;
            return (new Date().getTime()>=endtime)
        }

        function _isExits(key){
            return (cacheArr.findIndex((data)=>{ return data.key ===key })>-1)?true:false;
        }

        function _getExits(key){
            return cacheArr.find((data)=>{ return data.key ===key });
        }

    })();



    /***
     * 按照key值缓存Promise,如果同名的promise已经存在,则直接返回promise
     * 一个闭包函数,返回一个方法,这个方法接收一个key,一个promise实例,返回这个promise,如果第一次,则创建,如果第二次,则直接返回
     * @type {Function}
     */
    var pCachePromise = (function() {

        var cacheArr = [];

        /**
         * 默认配置
         * @type {{cache: boolean, lasttime: number}}
         * @private
         */
        var __cachePromisreDefaultOptions = {
            cache:true,
            lasttime:60
        };

        return  function (key,promiseFn,options) {
            let optionsMerge = Object.assign(__cachePromisreDefaultOptions,options);
            let name = key;
            if(optionsMerge.cache===true){
                if( _isExits(name)===false){
                    cacheArr.push({key:name,promise:promiseFn,createtime:(new Date().getTime()),endtime:(new Date().getTime() + optionsMerge.lasttime*1000) });
                    return promiseFn;
                }else{
                    //存在的话,需要在检测下过期时间
                    let newPro = _getExits(name);
                    if(_isExpire(newPro)===true){
                        //如果当前promise已经过期,则需要更新createtime,和promise,还有endtime
                        newPro.createtime = (new Date().getTime());
                        newPro.endtime = (new Date().getTime() + optionsMerge.lasttime*1000);
                        newPro.promise = promiseFn;
                        console.log('expire',cacheArr)
                        return promiseFn;
                    }else{
                        return  newPro.promise|| null
                    }

                }
            }else{
                //如果不需要缓存,则直接返回promiseFn
                return promiseFn;
            }
        };

        function _isExpire(proObj) {
            let {endtime} = proObj;
            return (new Date().getTime()>=endtime)
        }

        function _isExits(key){
            return (cacheArr.findIndex((data)=>{ return data.key ===key })>-1)?true:false;
        }

        function _getExits(key){
            return cacheArr.find((data)=>{ return data.key ===key });
        }

    })();

    /**--------------------common Inner Class ---------------- End**/


    /**
     * 为了实现_.test()与_().test()调用都是同一个方法，所以采用下面这个方法封装；
     * 而_.mixin就是动态批量完成方法注入
     */
    // _.prototype.test= function(){
    //     //_.test(...arguments)
    //     _.test.apply(this,arguments)
    //     console.log('prototype_test',...arguments)
    // }

    //为了实现_,_();这样两种调用方式;把对象的方法，都设置到原型链上；
    _.mixin = function (obj) {
        Object.keys(obj).forEach((method)=>{
            var func = obj[method];
            _.prototype[method] = function(...arg){
                func.apply(this,arg);
            }
        });

    }

    _.mixin(_);
    //导出通用的AMD,CMD，ES6类
    if(typeof exports !='undefined' && !exports.nodeType){
        if(typeof module != 'undefined' && !module.nodeType&&module.exports){
            exports = module.exports = _;
        }
        exports._ = _;
    }else{
        root._ = _;
    }

})();