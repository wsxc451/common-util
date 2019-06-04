<template>
<div class="admin">
    <el-container class="admin-container">
        <el-header class="admin-container-header">
            <el-radio-group v-model="tabPosition" style=" ">
                <el-radio-button label="top">保存</el-radio-button>
                <el-radio-button label="right">预览</el-radio-button>
                <el-radio-button label="bottom">导出</el-radio-button>
            </el-radio-group>
        </el-header>
        <el-main class="admin-container-main">
            <div class="main-left">
                <el-tabs v-model="leftTabActive" type="card" @tab-click="handleClick">
                    <el-tab-pane label="基础组件" name="base">
                        <div class="components-container">
                            <GridsCol ref="GridsCol" :colNum="2" :boxWidth="30" unit="%">
                                    <div class="components" draggable="true"  v-for="(com,index) in baseComs"
                                         @dragstart="dragstart($event,com)"
                                         :key="com.id">
                                            {{com.name}}
                                    </div>
                            </GridsCol>
                            <div class="clear"></div>

                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="高级组件" name="super">
                        高级组件
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="main-body" id="main-body"
                 @drop="drop"
                 @dragover="dragover"
                 @dragenter="dragenter"
            >

                <draggable v-model="bodyComs"
                           ghost-class="ghost"
                           group="people" @start="drag=true" @end="drag=false">
                    <transition-group type="transition" name="flip-list">
                    <div class="components-block" :class="element.class"
                         v-for="(element,index) in bodyComs"
                         :key="index">

                        <Component :is="element.com">
                            {{element.name}}
                        </Component>

                    </div>
                    </transition-group>

                </draggable>
            </div>
            <div class="main-right">

            </div>

        </el-main>
    </el-container>
</div>
</template>

<script>
    import Grids from '../components/grids/Grids'
    import GridsCol from '../components/grids/GridsCol'
    import draggable from 'vuedraggable'
    import ComText from '../components/text/ComText'
    import ComSlider from '../components/slider/ComSlider'
     export default {
        name:'PageAdmin',
        components:{Grids,GridsCol,draggable,ComSlider,ComText},
        data(){
            return {
              msg:'hi',
                tabPosition:1,
                leftTabActive:'base',
                baseComs:[],
                bodyComs:[{name:'1111',id:1,com:'ComText'},{name:'222',id:2,com:'ComSlider'},
                    {name:'333',id:3,com:'ComText'}]
            }
        },
        mounted() {
            console.log('PageAdmin')
               let baseComs = [];

                for( let i = 0;i<10;i++){
                    baseComs.push({
                        name:'基础组件_'+i,
                        img:'',
                        com:i%2==0?'ComText':'ComSlider',
                        class:i%2==0?'ComText':'ComSlider',
                        type:'',
                        id:i
                    })
                }
            this.baseComs = baseComs;
        },
         methods:{
             handleClick(e){
                 console.log(e)
             },
             dragstart(event,com){
                 console.log('dragstrat', event,com)
                 event.dataTransfer.setData('com', JSON.stringify(com))
             },
             drop (event) {
                 console.log('drop', event)
                 console.log(event.dataTransfer.getData('com'))
                 let comInfo =JSON.parse(event.dataTransfer.getData('com'));


                 this.bodyComs.push(comInfo);

             },
             dragover (event) {
                 event.preventDefault()
             },
             dragenter(event){
                 console.log('dragenter', event)
                 //enter时间获取不到值
                 //console.log(event.dataTransfer.getData('com'))
             },
             addComShow(){

             }
         }
     }
</script>
<style>
    .admin {background:#fff;position:absolute;width:100%;height:100%;top:0;left:0;}
    .admin-container {width:100%;height:100%;padding:0;}
    .admin-container-header {background:#333;line-height:60px;border-bottom:1px solid #666;}
    .admin-container-main {display:flex;flex-direction:row;padding:0;}
    .admin-container-main .main-left {border-right:1px solid #e3e3e3;width:300px;}
    .admin-container-main .components {box-sizing:border-box;border:1px solid #e3e3e3;margin-bottom:15px;color: #ff5500}
    .admin-container-main .components:hover {cursor:move;}
    .admin-container-main .main-body {flex:1;background:#e3e3e3;}
    .admin-container-main .main-right {border-left:1px solid #e3e3e3;width:300px;}

    .components-block{border: 1px dashed #1e98e3; }

    .flip-list-move {
        transition: transform 0.5s;
    }
    .no-move {
        transition: transform 0s;
    }
    .ghost {
        opacity: 0.5;
        background: #c8ebfb;
    }


</style>