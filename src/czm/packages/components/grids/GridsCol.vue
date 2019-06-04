<template>
    <div class="girds">
        <slot></slot>
        <div class="clear"></div>
    </div>
</template>

<script>
    /***
     * 行等比间距列表
     * 原理: 遍历子类,然后根据计算结果,给我子类加上marginLeft,float等属性
     <GridsCol :colNum="3" :boxWidth="20" unit="%">
     <div class="components" v-for="(com,index) in baseComs" :key="com.id">
     {{com.name}}
     </div>
     </GridsCol>
     */
    export default {
        name: "GridsCol",
        props:{
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
        created(){
            console.log('GridCol created.....')
        },
        mounted() {
            console.log('GridCol mounted.....')
            setTimeout(()=>{
                let slots = this.$slots.default||[];
                console.log('.....',slots)
                let mL = this.getMarginLeft();
                Array.prototype.forEach.call(slots,(slot)=>{
                    slot.elm.style.marginLeft = mL+'px';
                    slot.elm.style.float = 'left';
                    slot.elm.style.width = this.boxWidthInner+'px';
                });

            },0)
            // var that = this;
            // that.$nextTick(()=>{
            //     var slots = this.$slots.default;
            //     console.log('00000',slots,this.$slots)
            //     that.$nextTick(()=>{
            //
            //         slots = that.$slots.default;
            //         console.log('1111',slots,this.$slots)
            //         //   slots = this.$slots.default||[];
            //         let mL = that.getMarginLeft();
            //         slots.forEach((slot)=>{
            //                 slot.elm.style.marginLeft = mL+'px';
            //                 slot.elm.style.float = 'left';
            //                 slot.elm.style.width = that.boxWidthInner+'px';
            //         })
            //     })
            // })
        },
        methods:{
            getMarginLeft(){
                let {width,height} = this.$el.getBoundingClientRect();
                if(this.unit=='px'){
                    this.boxWidthInner = this.boxWidth;
                }else{
                    //百分比
                    this.boxWidthInner =  width*parseFloat(this.boxWidth)/100;
                }
                let mLeft =  (width - this.colNum * parseFloat(this.boxWidthInner) ) /( (this.colNum+1));
                //如果宽度试着超过bodyWidth,mLeft会小于0
                return  Math.max(0,mLeft);
            }
        }

    }
</script>

<style scoped>
    .clear {clear: both}
</style>