<template>
  <div class="bgscreencenter" style="width:100%;height:100%">
     <EchartMap :echartsID="centerid" style="width:100%;height:100%"/>
  </div>
</template>
<script>
import EchartMap from './plugin/map.vue'
export default {
  name: 'Center',
  components:{
    EchartMap:EchartMap,
  },
  data() {
    return{
        centerid:'echartcenterMap'
    }
  },
  methods:{
    
  },
  mounted(){
     
  },

}
</script>
<style >
</style>

