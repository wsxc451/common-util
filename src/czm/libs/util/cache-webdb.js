/***
 * h5端 模拟数据库
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
     *@param sql INSERT INTO 表名称  (列1, 列2,...) VALUES (值1, 值2,....)
     */
    _.insert = function (sql){
      // let arrs = sliceSQLToArray(sql);
      return  pCacheWebdb.insert(sql);
    }

    _.insertObj = function (tablename,obj){
        // let arrs = sliceSQLToArray(sql);
        return  pCacheWebdb.insertObj(tablename,obj);
      }

      _.insertObjArr = function (tablename,objArr){
        // let arrs = sliceSQLToArray(sql);
        return pCacheWebdb.insertObjArr(tablename,objArr);
      }
  
  

    _.getTables = function(){
        return pCacheWebdb.getTables();
    }

    /***
     *@param sql SELECT 字段1,字段2,字段3 FROM 表名称 ORDER BY 字段名 LIMIT 0,100 
     */
    _.select = function (sql){
        return pCacheWebdb.select(sql);
    }

    /**
     *@param sql UPDATE 表名称 SET 列名称 = 新值,列名称2 = 新增2  WHERE 列名称 = 某值
     */
    _.update = function (sql){
       
    }

    /**
     *@param sql DELETE FROM 表名称 WHERE 列名称 = 值
     */
    _.delete = function (sql){
       
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
    var pCacheWebdb = (function() {

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

        return  {
                dbStorage:cacheArr,
                insert:insert,
                insertObj:insertObj,
                insertObjArr:insertObjArr,
                select:select,
                getTables:getTables
        };


        function insertObj(tablename,obj){
          //  Object.assign(obj,{key:_getUid()});
            _tableInsert(tablename,obj);
            return obj;
        }

        function insertObjArr(tablename,objArr){
            for(let i=0;i<objArr.length;i++){
                // if(!objArr[i].key){
                //     Object.assign(objArr[i],{key:_getUid()});
                // }
                _tableInsert(tablename,objArr[i]);
            }
           
            return objArr;
        }

       /**
         *  SELECT 字段1,字段2,字段3 FROM 表名称 ORDER BY 字段名 LIMIT 0,100 
         *  SELECT (name,age) FROM goods WHERE (age > 30)
         * */
        function select(sql){
             let ret = _getSelectKO(sql)
            // let {tablename,fields,values} = ret;
            console.log(ret)
            // let obj = Object.create(null);
            // obj.key = _getUid();
            // console.log(fields,values)
            // for(let i =0;i<fields.length;i++){
            //         obj[fields[i]]=values[i]
            // }
                    // obj.age>=10

          
            var fnWhereStr = [  ];

            let conditions = ret.conditions;
            var fn = null;
            if(conditions.length>0){
                conditions.forEach((con)=>{
                    fnWhereStr.push(" obj."+con.leftStr+" "+con.oper+" "+con.rightStr);
                });

                 fn =  new Function("obj","return ("+fnWhereStr.join("&&")+");"  );

                 console.log(fnWhereStr.join("&&"))
            }


            let retF = _tableSelect(ret.tablename,fn);
            //fields 如果包含*,则不再过滤
            if(ret.fields.indexOf("*")>=0){
                return retF;
            }
            //返回过滤字段后的数据
            return _filterFields(ret.fields,retF)
        }


        function _filterFields(fileds,arr){
                let retFilter = [];
                arr.forEach(item=>{
                     let newObj = {};
                     fileds.forEach(field=>{
                        newObj[field] = item[field]
                     });
                     retFilter.push(newObj)
                })
                return retFilter;
        }

        function insert(sql){
            let ret = _getInsertKO(sql)
            let {tablename,fields,values} = ret;
            let obj = Object.create(null);
            //obj.key = _getUid();
            console.log(fields,values)
            for(let i =0;i<fields.length;i++){
                    obj[fields[i]]=values[i]
            }

           
            _tableInsert(tablename,obj);
            return obj;
         //  console.log(ret)
        }

        function getTables(){
            return cacheArr;
        }



        function _tableInsert(tablename,obj){
            if(_isExits(tablename)===false){
                cacheArr.push({
                    key:tablename,
                    datas:[obj]
                })
            }else{
                tableObj = _getExits(tablename);
                tableObj.datas.push(obj);
            }
        }

        function _tableSelect(tablename,condition){
            let tableObj = _getExits(tablename);
            console.log(tableObj)
            if(!tableObj){
                return [];
            }
            if(condition){
                return   tableObj.datas.filter((item)=>{
                    return condition.call(null,item);
                })
            }else{
                return tableObj.datas;
            }
             
        }

        function _S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }

        function _getUid(){
          
            return (_S4()+_S4()+"-"+_S4()+"-"+_S4()+"-"+_S4()+"-"+_S4()+_S4()+_S4());
        }

  


        function _sliceSQLToArray(sql){
            let sqlKeysArr = sql.trim().split(/\s+/);
            return sqlKeysArr;
        }

        //SELECT name , age FROM goods WHERE  age = 100 AND type = 1 
        function _getFileds(sql){
                    //SELECT name , age FROM
            let selectPreStr = sql.replace(/SELECT(.*)FROM(.*)/g,"$1");;//去除掉前后部分
            //selectPreStr = selectPreStr.replace(/(^\s+)|(\s+$)/g,"");
            selectPreStr = selectPreStr.replace(/\s/g,"");
            console.log(selectPreStr)
            return selectPreStr.split(",");
            // let sqlArr = _sliceSQLToArray(sql);
            // let startIndex = _getIndexBySqlKey('SELECT',sqlArr); 
            // let endIndex = _getIndexBySqlKey('FROM',sqlArr);

            // console.log('...',startIndex,endIndex)
            // return sqlArr.slice(startIndex+1,endIndex);
        }

         /***
         *@param sql SELECT (name,age) FROM goods WHERE  age = 100 AND type = 1 
         */
        function _getSelectKO(sql){
            let arrs = _sliceSQLToArray(sql);
            
            let result = {
                    tablename:arrs[_getIndexBySqlKey('FROM',arrs)+1],
                    fields:[],
                    values:[]
            }
    
            let intoKeyIndex =  _getIndexBySqlKey('SELECT',arrs);
            if(intoKeyIndex==-1){
                throw new Exception('SELECT 不存在');
            }
            //这里吧('name','30') 转成 ['name','30'] 再使用eval
            //let fieldsStr = arrs[ intoKeyIndex+2].replace(/\(/g,'[').replace(/\)/g,']');
            //result.fields = eval(fieldsStr); 
            //let fieldsStr = arrs[ intoKeyIndex+1].replace(/\(|\)/g,'');
            //result.fields = fieldsStr.split(","); 
              result.fields = _getFileds(sql);
              console.log('fields,,,',result)
            // let valuesKeyIndex =  _getIndexBySqlKey('WHERE',arrs);
            // if(valuesKeyIndex==-1){
            //     throw new Exception('WHERE 不存在');
            // }
    
            //TODO 检测下标越界
            // let valuesStr = arrs[ valuesKeyIndex+1].replace(/\(|\)/g,'');
            // result.values = valuesStr.split(",");  
            // console.log(valuesStr,result.values)


            result.conditions = _getWhereConditions(sql);
            return result;
        }
    
        /***
         *@param sql INSERT INTO 表名称  (列1, 列2,...) VALUES (值1, 值2,....)
         */
        function _getInsertKO(sql){
            let arrs = _sliceSQLToArray(sql);
            
            let result = {
                    tablename:arrs[_getIndexBySqlKey('INTO',arrs)+1],
                    fields:[],
                    values:[]
            }
    
            let intoKeyIndex =  _getIndexBySqlKey('INTO',arrs);
            if(intoKeyIndex==-1){
                throw new Exception('INFO 不存在');
            }
            //这里吧('name','30') 转成 ['name','30'] 再使用eval
            //let fieldsStr = arrs[ intoKeyIndex+2].replace(/\(/g,'[').replace(/\)/g,']');
            //result.fields = eval(fieldsStr); 
            let fieldsStr = arrs[ intoKeyIndex+2].replace(/\(|\)/g,'');
         
            result.fields = fieldsStr.split(","); 

       
            let valuesKeyIndex =  _getIndexBySqlKey('VALUES',arrs);
            if(valuesKeyIndex==-1){
                throw new Exception('VALUES 不存在');
            }
    
            //TODO 检测下标越界
            // let valuesStr = arrs[ valuesKeyIndex+1].replace(/\(|\)/g,'');
            // result.values = valuesStr.split(",");  
            // console.log(valuesStr,result.values)


            //这里吧('name','30') 转成 ['name','30'] 再使用eval
             let valuesStr = arrs[ valuesKeyIndex+1].replace(/\(/g,'[').replace(/\)/g,']');
             result.values = eval(valuesStr); 
             console.log(valuesStr,result.values)
            return result;
        }

        /**
         * 根据sql字符串,返回 一个数组,[{leftStr:'',oper:'',rightStr:''},...]
         * 这里如果分词错误,就会报错.所以要加入检测机制
         * tips: WHERE 1 = 1 时,要把1过滤掉哦:>
         * @param {*} str 
         */
        function _getWhereConditions(str){
               let retArr =[];
                //SELECT (name,age) FROM goods WHERE  age = 100 AND type = 1 ORDER BY age DESC
                //检测是否有WHERE
                 if(str.toLowerCase().indexOf('where')>=0){
                    str = str.replace(/(.*)WHERE(.*)/g,"$2");;//去除掉前后部分
                    //  age = 100 AND type = 1 ORDER BY age DESC
                  let whereArr = _sliceSQLToArray(str);
                  //首次放进去三个 遇见AND就继续往后找三位
                  let index = 0;
                  do{
                     let operCompile = (whereArr[index+1]==='=')?'==':whereArr[index+1];
                     if(whereArr[index]!='1'){
                        retArr.push({leftStr:whereArr[index],oper:operCompile,rightStr:whereArr[index+2]} )
                     }
                     
                  }while( whereArr[index+3]=='AND' &&(index+=4)&& index<=whereArr.length)
                 }
                 console.log(retArr,'------');
                return retArr;
        }
     
        function _getIndexBySqlKey(key,arr){
               key = key.toLowerCase();
               let fIndex = arr.findIndex((val)=>{
                   return val.toLowerCase() === key;
               });
            //    if(fIndex>=0&& fIndex<arr.length){
            //        return arr[fIndex]
            //    }
               return fIndex;
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