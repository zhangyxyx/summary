<template>
  <div class="bgscreenright" style="height:100%">
     <el-row v-for="item in rightdata" :key="item.id" :style="{boxSizing:rightboxSizing,height:'calc('+rightheight+'% - 20px)',background:rightbg,backgroundSize:rightbgSize,marginBottom:rightmargin+'px'}">
        <el-col class="everytitle" :span="24" 
          :style="{color:item.color,fontSize:item.fontSize}">
            {{item.name}}
        </el-col>
        {{item.type}}
        <el-col :span="24" style="height:85%">
          <div v-if="item.type==='line'" style="width:100%;height:100%;" :id="'echartright'+item.id">
            <EchartLine :echartsID="'echartright'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='bar'" style="width:100%;height:100%;" :id="'echartright'+item.id">
            <EchartBar :echartsID="'echartright'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='pie'" style="width:100%;height:100%;" :id="'echartright'+item.id">
            <EchartPie :echartsID="'echartright'+item.id" :echartsData="item.data"/>
          </div>
        </el-col>
     </el-row>
  </div>
</template>
<script>
import EchartLine from './plugin/line.vue'
import EchartBar from './plugin/bar.vue'
import EchartPie from './plugin/pie.vue'
export default {
  name: 'Right',
  components:{
    EchartLine:EchartLine,
    EchartBar:EchartBar,
    EchartPie:EchartPie
  },
  data() {
    return{
        rightboxSizing:'border-box',
        rightdata:[],
        rightheight:'50%',
        rightbg:'',
        rightbgSize:'100% 100%',
        rightcolor:'#000',
        rightfontsize:'15',
        rightmargin:'20',
        righttype:'line'
    }
  },
  methods:{
    
  },
  mounted(){
      var that=this
      this.Bus.$on('renderRight',function(msg){
          var arr=msg.righttableData
          that.rightboxSizing='border-box'
          that.rightheight=(100/arr.length)
          that.rightbg=msg.rightbg
          that.rightbgSize='100% 100%'
          that.rightmargin='20'
          that.rightdata.splice(arr.length)
          console.log(1111)
          for(var i=0;i<arr.length;i++){
            var json={
              name:arr[i]['name'],
              type:arr[i]['echartstype'],
              color:arr[i]['color'],
              fontSize:arr[i]['fontSize'],
              id:arr[i]['sort'],
              data:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[10, 20, 36, 10, 10, 20]
              }
            }
            that.$set(that.rightdata,i,json)
          }
      })
  },

}
</script>
<style >
.bgscreenright .everytitle{
  height:15%;
  display:flex;
  align-items: center;
  justify-content: center;
}
</style>