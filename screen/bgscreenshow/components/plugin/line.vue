<template>
  <div style="width:100%;height:100%" >
        <div :id="'myLine'+echartsID" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'EchartLine',
  props:['echartsID','echartsData'],
  data() {
   return{  
     lineoption:{}
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
                  color:'#97e7fb'
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#97e7fb'
                }
              },
              axisLabel:{
                color:that.lineoption.x.color
              },
              data: that.echartsData.xAxisdata
            },
            yAxis: {
              splitLine:{
                lineStyle:{
                  type:'dashed',
                  color:'#97e7fb'
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#97e7fb'
                }
              },
              axisLabel:{
                color:that.lineoption.y.color//'#97e7fb'
              }
            },
            series: [{
                name: '销量',
                type: 'line',
                data:that.echartsData.seriesdata
            }]
        });
    }
  },
  mounted(){
    this.lineoption=JSON.parse(this.$.cookie('lineoption'))
    var objID='myLine'+this.echartsID
    this.initLine(objID)
  },

}
</script>
<style >


</style>

