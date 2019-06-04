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
                                    <div class="components" v-dragable v-for="(com,index) in baseComs" :key="com.id">
                                            {{com.name}}
                                    </div>
                            </GridsCol>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="高级组件" name="super">
                        高级组件
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="main-body" v-dropable>

            </div>
            <div class="main-right">

            </div>

        </el-main>
    </el-container>
</div>
</template>

<script type="text/babel">
    import Vue from 'vue'
    import Grids from '../components/grids/Grids'
    import GridsCol from '../components/grids/GridsCol'
     export default {
        name:'PageAdmin',
        components:{Grids,GridsCol},
        data(){
            return {
              msg:'hi',
                tabPosition:1,
                leftTabActive:'base',
                baseComs:[]
            }
        },
        mounted() {
            console.log('PageAdmin')
               let baseComs = [];

                for( let i = 0;i<10;i++){
                    baseComs.push({
                        name:'基础组件_'+i,
                        img:'',
                        type:'',
                        id:i
                    })
                }
            this.baseComs = baseComs;
                this.$nextTick(()=>{
                    console.log('ab',this.$refs['ab'])
                    console.log(this.$refs['GridsCol'])
                })
        },
         methods:{
             handleClick(e){
                 console.log(e)
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
    .admin-container-main .components {box-sizing:border-box;border:1px solid #e3e3e3;margin-bottom:15px;}
    .admin-container-main .main-body {flex:1;background:#e3e3e3;}
    .admin-container-main .main-right {border-left:1px solid #e3e3e3;width:300px;}
</style>