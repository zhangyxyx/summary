<template>
  <div class="bgscreenleft" style="height:100%">
     <el-row v-for="item in leftdata" :key="item.id" :style="{boxSizing:leftboxSizing,height:leftheight+'%',background:leftbg,backgroundSize:leftbgSize,marginBottom:leftmargin+'px'}">
        <el-col class="everytitle" :span="24" 
          :style="{color:leftcolor,fontSize:leftfontsize}">
            {{item.name}}
        </el-col>
        <el-col :span="24" style="height:85%">
          <div v-if="item.type==='line'" style="width:100%;height:100%;" :id="'echartleft'+item.id">
            <EchartLine :echartsID="'echartleft'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='bar'" style="width:100%;height:100%;" :id="'echartleft'+item.id">
            <EchartBar :echartsID="'echartleft'+item.id" :echartsData="item.data"/>
          </div>
        </el-col>
     </el-row>
  </div>
</template>
<script>
import EchartLine from './plugin/line.vue'
import EchartBar from './plugin/bar.vue'
export default {
  name: 'Left',
  components:{
    EchartLine:EchartLine,
    EchartBar:EchartBar
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
          that.leftboxSizing='border-box'
          that.leftheight=(100/parseInt(msg.leftdata))-6
          that.leftbg=msg.leftbg
          that.lefttype=msg.lefttype
          that.leftbgSize='100% 100%'
          that.leftcolor=msg.color
          that.leftfontsize=msg.fontSize
          that.leftmargin='20'
          that.leftdata.splice(parseInt(msg.leftdata))
          for(var i=0;i<parseInt(msg.leftdata);i++){
            var json={
              name:'底部标题1',type:that.lefttype,id:i,
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

