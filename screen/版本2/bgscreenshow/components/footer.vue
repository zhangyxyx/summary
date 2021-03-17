<template>
  <div class="bgscreenfooter" style="height:100%;">
     <el-row v-for="item in footerdata" :key="item.id" :style="{width:footerwidth+'%',height:footerheight,background:footerbg,backgroundSize:footerbgSize,marginTop:footermargin+'px',float:footerfloat}">
        <el-col class="everytitle" :span="24" 
          :style="{color:item.color,fontSize:item.fontSize}">
            {{item.name}}
        </el-col>
        <el-col :span="24" style="height:85%">
          <div v-if="item.type==='line'" style="width:100%;height:100%;" :id="'echartfooter'+item.id">
            <EchartLine :echartsID="'echartfooter'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='bar'" style="width:100%;height:100%;" :id="'echartfooter'+item.id">
            <EchartBar :echartsID="'echartfooter'+item.id" :echartsData="item.data"/>
          </div>
          <div v-else-if="item.type==='pie'" style="width:100%;height:100%;" :id="'echartfooter'+item.id">
            <EchartPie :echartsID="'echartfooter'+item.id" :echartsData="item.data"/>
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
  name: 'Footer',
  components:{
    EchartLine:EchartLine,
    EchartBar:EchartBar,
    EchartPie:EchartPie
  },
  data() {
   return{
        footerfloat:'left',
        footerdata:[],
        footerwidth:'',
        footerheight:'calc(100% - 20px)',
        footerbg:'',
        footerbgSize:'100% 100%',
        footercolor:'#000',
        footerfontsize:'15',
        footermargin:'10',
        footertype:'',
   }
  },
  methods:{
    
  },
  mounted(){
    var that=this
    this.Bus.$on('renderFooter',function(msg){
        if(parseInt(msg.footertableData.length)===1){
          that.footerwidth=100
        }else{
          that.footerwidth=(100/msg.footertableData.length)-3
        }
        that.footerbg=msg.footerbg,
        that.footerbgSize='100% 100%'
        var arr=msg.footertableData
        that.footerdata.splice(arr.length)
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
          that.$set(that.footerdata,i,json)
        }
    })
  },

}
</script>
<style >
.bgscreenfooter{
  display:flex;
  justify-content: space-between;
}
.bgscreenfooter .everytitle{
  height:15%;
  display:flex;
  align-items: center;
  justify-content: center;
}

</style>

