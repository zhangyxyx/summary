<template>
  <div class="app-container">
    <h1>折线图设置</h1>
    <el-divider></el-divider>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="12">
          <el-form-item label="x轴文字大小">
              <el-select v-model="xfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in xfontsizedata"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="x轴文字颜色">
              <el-color-picker v-model="xfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="y轴文字大小">
              <el-select v-model="yfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in yfontsizedata"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="y轴文字颜色">
              <el-color-picker v-model="yfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        
        <el-col :span="24">
          <el-form-item label="">
              <el-button type="primary" size="small" @click="saveline" class="el-button filter-item el-button--primary el-button--mini">保存</el-button>
          </el-form-item>
        </el-col>  
      </el-row>
    </el-form>
  </div>
</template>
<script>

export default {
  name: 'setline',

  data() {
   return{
     xfontrcolor:'#fff',
     xfontsizeval:'16',
     xfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     yfontrcolor:'#fff',
     yfontsizeval:'16',
     yfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     lineoption:{
       x:{
         color:'#000',
         fontSize:'16'
       },
       y:{
         color:'#000',
         fontSize:'16'
       },
     },
   }
  },
  methods:{
    saveline(){
      this.lineoption.x.color=this.xfontrcolor
      this.lineoption.x.fontSize=this.xfontsizeval
      this.lineoption.y.color=this.yfontrcolor
      this.lineoption.y.fontSize=this.yfontsizeval
      this.$.removeCookie('lineoption')
      this.$.cookie('lineoption', JSON.stringify(this.lineoption));
      this.$message({
          message: '保存成功',
          type: 'success'
        });
    }
  },
  mounted(){
    if(this.$.cookie('lineoption')===undefined){
      this.$.cookie('lineoption',JSON.stringify(this.screendata))

    }
    this.lineoption=JSON.parse(this.$.cookie('lineoption'))
    this.xfontrcolor=this.lineoption.x.color
    this.xfontsizeval=this.lineoption.x.fontSize
    this.yfontrcolor=this.lineoption.y.color
    this.yfontsizeval=this.lineoption.y.fontSize
  },

}
</script>
<style >

</style>

