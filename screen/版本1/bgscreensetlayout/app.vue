<template>
  <div class="app-container">
    <Main/>
    <setLine/>
    <setBar/>
    <setMap/>
    <el-row>
      <el-col :span="24" style="text-align:right">
         <el-button type="primary" size="small" @click="exportjson" class="el-button filter-item el-button--primary el-button--mini">导出</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import Main from './components/main.vue'
import setLine from './components/setline.vue'
import setBar from './components/setbar.vue'
import setMap from './components/settopo.vue'
export default {
  name: 'setlayout',
  components:{
    Main:Main,
    setLine:setLine,
    setBar:setBar,
    setMap:setMap
  },
  data() {
   return{}
  },
  methods:{
    exportjson(){
        var screendata=this.$.cookie('screendata');
        var data = screendata
        //encodeURIComponent解决中文乱码
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);
        //通过创建a标签实现
        let link = document.createElement("a");
        link.href = uri;
        //对下载的文件命名
        link.download =  "页面结构配置文件.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  },
  mounted(){
    
  },

}
</script>
<style >

</style>

