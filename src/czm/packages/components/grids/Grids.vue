<template>
    <div class="girds">
        <div v-for="(data,index) in datas" :key="index" class="grids-item"
             :style="{float:'left',marginLeft:marginLeft+'px',width:boxWidthInner+'px'}">
            <slot name="default" :data="data"></slot>
        </div>
    </div>
</template>

<script>
    /***
     * 行等比间距列表
     * 原理: 遍历数组,并生成div元素,然后根据计算结果,给我子类加上marginLeft,float等属性
     * 并把数据回传到父类的slot模板中,渲染;使用了v-slot技术
     *
         <Grids :colNum="3" :boxWidth="20" unit="%" :datas="baseComs">
         <template v-slot:default="scope">
         <div class="components">
         {{scope.data.name}}
         </div>
         </template>
         </Grids>
     */
    export default {
        name: "Grids",
        props:{
            datas:{ //要展示的数组
              type:Array,
              default:[]
            },
            colNum:{//每一行要分多少列
                type:Number,
                default:1
            },
            boxWidth:{//每一列的宽度
                type:Number,
                default:0
            },
            unit:{//单位 px:像素,%:百分比
                type:String,
                default:'px'
            }
        },
        data(){
            return {
                marginLeft:0,
                boxWidthInner:0
            }
        },
        mounted() {

            let {width,height} = this.$el.getBoundingClientRect();
            if(this.unit=='px'){
                this.boxWidthInner = this.boxWidth;
            }else{
                //百分比
                this.boxWidthInner =  width*parseFloat(this.boxWidth)/100;
            }
            let mLeft =  (width - this.colNum * parseFloat(this.boxWidthInner) ) /( (this.colNum+1));
            this.marginLeft = mLeft
        }

    }
</script>

<style scoped>
</style>