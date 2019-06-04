<template>
    <div>
        <div class="demo1">
            <GridsCol :colNum="3" :boxWidth="20" unit="%">
                <div class="components" v-dragable  v-for="(com,index) in baseComs" :key="com.id">
                    {{com.name}}
                </div>
            </GridsCol>
        </div>

        <div class="demo1">
<!--            <Grids :colNum="3" :boxWidth="20" unit="%" :datas="baseComs">-->
<!--                <template v-slot:default="scope">-->
<!--                    <div class="components">-->
<!--                        {{scope.data.name}}-->
<!--                    </div>-->
<!--                </template>-->
<!--            </Grids>-->
        </div>
    </div>

</template>

<script>
    import Grids from '../components/grids/Grids'
    import GridsCol from '../components/grids/GridsCol'
    export default {
        name: "Grids",
        components:{Grids,GridsCol},
        data(){
            return {
                baseComs:[]
            }
        },
        created(){
            console.log('Grid created.....')
        },
        mounted() {
            console.log('Grids mounted.....')
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
        }
    }
</script>

<style >
    .cloneComponents{position: absolute;top: 0;left: 0;border: 1px solid #e3e3e3;
           background: #e3e3e3;}
.components{ border: 1px solid #e3e3e3;padding: 15px;
transition-duration: 10ms;
}
.components:hover{ cursor:move}
</style>