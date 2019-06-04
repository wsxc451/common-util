import Vue from "vue";


Vue.directive('dropable', {
    bind(el,binding){
        console.log('drop. bind')
        // el.onmouseenter =function(e){
        //     console.log('onmouseenter')
        //     // console.log(e.pageY,el.offsetTop,el.getBoundingClientRect())
        //     console.log('dropable',e.relatedTarget)
        //
        //     if(hasClass(e.relatedTarget,'components')){
        //         console.log('component over')
        //
        //         el.appendChild(createAddDiv());
        //     }
        //    // e.preventDefault;
        // }
        //
        // el.onpointerenter  = function (e) {
        //     console.log('onpointerenter',e)
        // }


    },
    unbind:function(el,binding,nodeDom){
        //  el.onmousemove = null;
    }
})


Vue.directive('dragable', {
    bind(el,binding){
        console.log('dragable. bind')  //
        el.onmousedown =function(e){
            // console.log(e.pageY,el.offsetTop,el.getBoundingClientRect())
            var keyx = e.pageX - el.offsetLeft;
            var keyy = e.pageY - el.offsetTop;

            var clientRect  = el.getBoundingClientRect();

            console.log(e.pageX,el.offsetLeft,keyx)

            //拖拽时,把元素设置为透明度为0.5;然后body新增一个box,使用transfrom:translate3d(0,0,0);


            var startPointX = e.pageX;
            var startPointY = e.pageY;

            //var clone = document.createElement('div');
            var clone = el.cloneNode(false);
            clone.style.margin = '';
            clone.style.float = 'none';
            clone.style.boxSizing = 'border-box';
            clone.style.position = 'absolute';
            clone.id = 'cloneComponents';
            //clone.className = 'cloneComponents';
            clone.innerHTML = el.innerHTML;
            clone.style.top = clientRect.y+'px';
            clone.style.left =clientRect.x+'px';
            // clone.style.top = '0px';
            //clone.style.left = '0px';


            var isAppend = false;


            document.onmousemove = function(e){
                console.log('move...')
                if(isAppend==false){
                    document.body.appendChild(clone);
                }
                //let _left =  e.pageX - keyx;
                let _left = e.pageX - startPointX;
                let _top = e.pageY - startPointY;

                clone.style.transform = 'translate3d('+(_left)+'px,'+(_top)+'px,0)';
            }

            document.onmouseup = function(){
                document.onmousemove = document.onmousedown = null;
                var cloneC = document.getElementById("cloneComponents")
                if(cloneC){
                    cloneC.remove();
                }
            }

            e.preventDefault();
        }
    },
    unbind:function(el,binding,nodeDom){
        el.onmousedown = null;
        var cloneC = document.getElementById("cloneComponents")
        if(cloneC){
            cloneC.remove();
        }
    }
})

var hasClass = (function(){
    var div = document.createElement("div") ;
    if( "classList" in div && typeof div.classList.contains === "function" ) {
        return function(elem, className){
            return elem&&elem.classList.contains(className) ;
        } ;
    } else {
        return function(elem, className){
            var classes = elem.className.split(/\s+/) ;
            for(var i= 0 ; i < classes.length ; i ++) {
                if( classes[i] === className ) {
                    return true ;
                }
            }
            return false ;
        } ;
    }
})() ;


function createAddDiv(){
    var div = document.createElement('div');
    div.innerHTML = '<div>Add</div>';
    return div;
}

