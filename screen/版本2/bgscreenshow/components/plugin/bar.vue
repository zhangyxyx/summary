<template>
  <div style="width:100%;height:100%" >
        <div :id="'myBar'+echartsID" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'EchartBar',
  props:['echartsID','echartsData'],
  data() {
   return{  
   }
  },
  methods:{
    initLine(objID){
      var that=this
        let myChart = this.$echarts.init(document.getElementById(objID))
        myChart.setOption({
            tooltip: {},
            grid:{
              top:'20%',
              bottom:'20%',
              right:'10%',            
              left:'15%',
            },
            xAxis: {
              splitLine:{
                lineStyle:{
                  type:'dashed',
                  color:'rgba(151,213,251,.5)'
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#97e7fb'
                }
              },
              axisLabel:{
                color:'#97e7fb'
              },
              data: that.echartsData.xAxisdata
            },
            yAxis: {
              splitLine:{
                lineStyle:{
                  type:'dashed',
                  color:'rgba(151,213,251,.5)'
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#97e7fb'
                }
              },
              axisLabel:{
                color:'#97e7fb'
              }
            },
            series: [{
                name: '销量',
                type: 'bar',
                data:that.echartsData.seriesdata
            }]
        });
    }
  },
  mounted(){
    var objID='myBar'+this.echartsID
    this.initLine(objID)
  },

}
</script>
<style >


</style>

