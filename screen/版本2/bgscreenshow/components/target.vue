<template>
  <div class="bgscreentarget" style="height:100%;">
     <el-row v-for="item in targetdata" :key="item.id" :style="{color:targetcolor,width:targetwidth+'%',height:targetheight,background:targetbg,backgroundSize:targetbgSize,marginTop:targetmargin+'px',float:targetfloat}">
        <el-col class="everytitle" :span="24" :style="{fontSize:item.fontSize+'px',color:item.color}">
            {{item.name}}
        </el-col>
        <el-col class="everytitle" :span="24" :style="{fontSize:item.fontSize1+'px',color:item.color1}">
          {{item.name1}}
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

        that.targetIndexcolor=msg.Indexcolor
        that.targetIndexfontsize=msg.IndexfontSize
        var arr=msg.targettableData
        that.targetdata.splice(arr.length)
        for(var i=0;i<arr.length;i++){
          var json={
            id:arr[i]['sort'],
            name:arr[i]['name'],
            color:arr[i]['color'],
            fontSize:arr[i]['fontSize'],
            name1:arr[i]['name1'],
            color1:arr[i]['color1'],
            fontSize1:arr[i]['fontSize1'],
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

