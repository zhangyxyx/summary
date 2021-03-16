<template>
  <div style="height:100%">
    <el-row class="header" :style="{height:headerheight+'%',background:headerbg,backgroundSize:headerbgSize}">
      <span :style="{color:headercolor,fontSize:headerfontsize+'px'}">顶部标题</span>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'Header',

  data() {
   return{
      headerbg:'',
      headerheight:'100',
      headerbgSize:'100% 100%',
      headercolor:'#000',
      headerfontsize:'15',
   }
  },
  methods:{
    
  },
  mounted(){
    var that=this
    this.Bus.$on('renderHeader',function(msg){
      that.headerbg=msg.headerbg,
      that.headerbgSize='100% 100%',
      that.headercolor=msg.color,
      that.headerfontsize=msg.fontSize
    })
  },

}
</script>
<style >
.header{
  background-size:100% 100%;
  display:flex;
  align-items: center;
  justify-content: center;
}

</style>

