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
    _.cacheImage = function (){
       return  pCacheImage.fn.apply(this,arguments)
    }

    _.log = function(){
        pCacheImage.log.apply(this);
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
    var pCacheImage = (function() {

        var cacheArr = [];

        /**
         * 默认配置
         * @type {{cache: boolean, lasttime: number}}
         * @private
         */
        var __cacheDefaultOptions = {
            cache:true,
            lasttime:60
        };

        
        var fn =  function (imageUrl,options) {
            let optionsMerge = Object.assign(__cacheDefaultOptions,options);
            let name = imageUrl;
            return new Promise((resolve,reject)=>{
                if(optionsMerge.cache===true){
                    if( _isExits(name)===false){
                        _getBase64(imageUrl).then((base64)=>{
                            cacheArr.push({key:name,data:base64,createtime:(new Date().getTime()),endtime:(new Date().getTime() + optionsMerge.lasttime*1000) });
                            console.log('imageUrl不存在,新建Base64')
                            resolve(base64);
                        });
                        
                    }else{
                        //存在的话,需要在检测下过期时间
                        let newPro = _getExits(name);
                        if(_isExpire(newPro)===true){
                            //如果当前promise已经过期,则需要更新createtime,和promise,还有endtime
                            _getBase64(imageUrl).then((base64)=>{
                                console.log('ImageCache已经存在,但过期了,重新获取并返回')
                                newPro.createtime = (new Date().getTime());
                                newPro.endtime = (new Date().getTime() + optionsMerge.lasttime*1000);
                                newPro.data = base64;
                                resolve(base64);
                            });
                        }else{
                            console.log('ImageCache缓存未过期,从缓存加载')
                            resolve(newPro.data);
                        }
    
                    }
                }else{
                    //如果不需要缓存,则直接返回Imgurl
                    console.log('不需要缓存,获取最新promise')
                    return imageUrl;
                }
            });
         
        };


        return {
            fn:fn,
            log
        }


        function log(){
            console.log(cacheArr)
        }


        function _getBase64(img){
            function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
                var canvas = document.createElement("canvas");
                canvas.width = width ? width : img.width;
                canvas.height = height ? height : img.height;
        
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                var dataURL = canvas.toDataURL();
                return dataURL;
            }
            var image = new Image();
            image.crossOrigin = '';
            image.src = img;
            return new Promise((resolve,reject)=>{
                image.onload =function (){
                    resolve(getBase64Image(image));//将base64传给done上传处理
                }
            });
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