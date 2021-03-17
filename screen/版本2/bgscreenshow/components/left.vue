<template>
  <div class="bgscreenleft" style="height:100%">
     <el-row v-for="item in leftdata" :key="item.id" :style="{boxSizing:leftboxSizing,height:'calc('+leftheight+'% - 20px)',background:leftbg,backgroundSize:leftbgSize,marginBottom:leftmargin+'px'}">
        <el-col class="everytitle" :span="24" 
          :style="{color:item.color,fontSize:item.fontSize}">
            {{item.name}}
        </el-col>
        <el-col :span="24" style="height:85%">
          <div v-if="item.type==='line'" style="width:100%;height:100%;" :id="'echartleft'+item.id">
            <EchartLine :echartsID="'echartleft'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='bar'" style="width:100%;height:100%;" :id="'echartleft'+item.id">
            <EchartBar :echartsID="'echartleft'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='pie'" style="width:100%;height:100%;" :id="'echartleft'+item.id">
            <EchartPie :echartsID="'echartleft'+item.id" :echartsData="item.data"/>
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
  name: 'Left',
  components:{
    EchartLine:EchartLine,
    EchartBar:EchartBar,
    EchartPie:EchartPie
  },
  data() {
    return{
        leftboxSizing:'border-box',
        leftdata:[],
        leftheight:'',
        leftbg:'',
        leftbgSize:'100% 100%',
        leftcolor:'#000',
        leftfontsize:'15',
        leftmargin:'20',
        lefttype:'line'
    }
  },
  methods:{
    
  },
  mounted(){
      var that=this
      this.Bus.$on('renderLeft',function(msg){
        console.log(msg)
          var arr=msg.lefttableData
          that.leftboxSizing='border-box'
          that.leftheight=(100/arr.length)
          that.leftbg=msg.leftbg
          that.leftbgSize='100% 100%'
          that.leftmargin='20'
          that.leftdata.splice(arr.length)
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
            that.$set(that.leftdata,i,json)
          }
      })
  },

}
</script>
<style >
.bgscreenleft .everytitle{
  height:15%;
  display:flex;
  align-items: center;
  justify-content: center;
}
</style>

