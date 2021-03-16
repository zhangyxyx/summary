<template>
  <div class="bgscreentarget" style="height:100%;">
     <el-row v-for="item in targetdata" :key="item.id" :style="{color:targetcolor,width:targetwidth+'%',height:targetheight,background:targetbg,backgroundSize:targetbgSize,marginTop:targetmargin+'px',float:targetfloat}">
        <el-col class="everytitle" :span="24" 
          :style="{fontSize:targetIndexfontsize+'px',color:targetIndexcolor}">
            {{item.name}}
        </el-col>
        <el-col :span="24" style="height:50%;text-align:center;">
          234
        </el-col>
     </el-row>
  </div>
</template>
<script>
import EchartLine from './plugin/line.vue'
import EchartBar from './plugin/bar.vue'
export default {
  name: 'Footer',
  components:{
    EchartLine:EchartLine,
    EchartBar:EchartBar
  },
  data() {
   return{
        targetfloat:'left',
        targetdata:[],
        targetwidth:'',
        targetheight:'calc(100% - 20px)',
        targetbg:'',
        targetbgSize:'100% 100%',
        targetIndexcolor:'#000',
        targetcolor:'#000',
        targetIndexfontsize:'15',
        targetfontsize:'15',
        targetmargin:'10',
   }
  },
  methods:{
    
  },
  mounted(){
    var that=this
    this.Bus.$on('renderTarget',function(msg){
        if(parseInt(msg.targetdata)===1){
        that.targetwidth=100
        }else{
          that.targetwidth=(100/msg.targetdata)-3
        }
        console.log(msg)
        that.targetbg=msg.targetbg,
        that.targetbgSize='100% 100%',
        that.targetcolor=msg.color
        that.targetfontsize=msg.fontSize
        that.targetIndexcolor=msg.Indexcolor
        that.targetIndexfontsize=msg.IndexfontSize
        that.targetdata.splice(parseInt(msg.targetdata))
        for(var i=0;i<parseInt(msg.targetdata);i++){
          var json={
            name:'指标标题1',type:'line',id:i,
            leftlinedata:{
              xAxisdata:["1月","2月","3月","4月","5月","6月"],
              seriesdata:[10, 20, 36, 10, 10, 20]
            }
          }
          that.$set(that.targetdata,i,json)
        }
    })
  },

}
</script>
<style >
.bgscreentarget{
  display:flex;
  justify-content: space-between;
}
.bgscreentarget .everytitle{
  height:50%;
  display:flex;
  align-items: center;
  justify-content: center;
}

</style>

