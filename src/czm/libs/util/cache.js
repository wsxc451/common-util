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
     * @param promiseObj 需要缓存的promise,当首次或者失效时,会调用这个promise,再次调用时,会直接取上次的promise
     * @param options 一些参数,如lasttime (缓存时间秒为单位),cache(是否缓存标识符true|false)
     * @returns
     */
    _.cachePromise = function (){
       return  pCachePromise.apply(this,arguments)
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
    var pCachePromise = (function() {

        var cacheArr = [];

        var __cachePromisreDefaultOptions = {
            cache:true,
            lasttime:60
        };

        return  function (key,promiseFn,options) {
            let optionsMerge = Object.assign(__cachePromisreDefaultOptions,options);
            let name = key;
            if(optionsMerge.cache===true){
                if( _isExits(name)===false){
                    cacheArr.push({key:name,promise:promiseFn,createtime:(new Date().getTime()),endtime:(new Date().getTime() + options.lasttime*1000) });
                    return promiseFn;
                }else{
                    //存在的话,需要在检测下过期时间
                    let newPro = _getExits(name);
                    if(_isExpire(newPro)===true){
                        //如果当前promise已经过期,则需要更新createtime,和promise,还有endtime
                        newPro.createtime = (new Date().getTime());
                        newPro.endtime = (new Date().getTime() + options.lasttime*1000);
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
            return (new Date().getTime()>endtime)
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