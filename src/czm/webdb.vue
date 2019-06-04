<template>
    <div class="webdb">
            <div :v-for="(table) in datas">
                        {{table.tablename}}
            </div>

    </div>
</template>
<script>
export default  Vue.extend({
    props:{
        datas:{
            type:Number
        }
    },
    data(){
        return {
            lists:[]
        }
    }
  }) 
</script>

<style >
    
</style>