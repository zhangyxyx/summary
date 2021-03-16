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
   }
  },
  methods:{
    initLine(objID){
      var that=this
        let myChart = this.$echarts.init(document.getElementById(objID))
        myChart.setOption({
            series : [
                {
                    name: '访问来源',
                    type: 'pie',    // 设置图表类型为饼图
                    radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                    data:[          // 数据数组，name 为数据项名称，value 为数据项值
                        {value:235, name:'视频广告'},
                        {value:274, name:'联盟广告'},
                        {value:310, name:'邮件营销'},
                        {value:335, name:'直接访问'},
                        {value:400, name:'搜索引擎'}
                    ]
                }
            ]
        })
    }
  },
  mounted(){
    var objID='myLine'+this.echartsID
    this.initLine(objID)
  },

}
</script>
<style >


</style>

