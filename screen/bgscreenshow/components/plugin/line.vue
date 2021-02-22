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
                  color:'rgba(151,213,251,.5)'
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
                  color:'rgba(151,213,251,.5)'
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
                smooth:true,
                symbol:'none',
                lineStyle:{
                  color:that.lineoption.lineonecolor
                },
                data:[10,24,34,67,14,22]
            },{
                name: '销量2',
                type: 'line',
                smooth:true,
                symbol:'none',
                lineStyle:{
                  color:that.lineoption.linetwocolor
                },
                data:[10,24,88,7,37,66]
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

