<template>
  <div class="app-container">
    <h1>整体布局</h1>
    <el-divider></el-divider>
    <el-tag>顶部布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="6">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="headerfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
          <el-form-item label="文字大小">
              <el-select v-model="headerfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in headerfontsizedata"
                :key="item.name"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>  
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-tag>指标布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="12">
          <el-form-item label="是否隐藏">
              <el-select v-model="targetdisplay" placeholder="请选择">
              <el-option
                v-for="item in targetdisplaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
             <el-input v-model="targetdata" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col> 
         <el-col :span="12">
          <el-form-item label="指标文字大小">
              <el-select v-model="targetIndexfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in targetfontsizedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="指标文字颜色">
              <el-color-picker v-model="targetIndexfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="数值文字大小">
              <el-select v-model="targetfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in targetfontsizedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="数值文字颜色">
              <el-color-picker v-model="targetfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
         
       
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-tag>左侧布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="12">
          <el-form-item label="是否隐藏">
              <el-select v-model="leftdisplay" placeholder="请选择">
              <el-option
                v-for="item in leftdisplaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="leftfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字大小">
              <el-select v-model="leftfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in leftfontsizedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>  
        <el-col :span="12">
          <el-form-item label="图标类型">
              <el-select v-model="leftblock" placeholder="请选择">
              <el-option
                v-for="item in leftblockdata"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>  
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
             <el-input v-model="leftdata" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col> 
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-tag>中间布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="6">
          <el-form-item label="类型">
              <el-select v-model="centertype" placeholder="请选择">
              <el-option
                v-for="item in centertypedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>  
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-tag>右侧布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="12">
          <el-form-item label="是否隐藏">
              <el-select v-model="rightdisplay" placeholder="请选择">
              <el-option
                v-for="item in rightdisplaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="rightfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字大小">
              <el-select v-model="rightfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in rightfontsizedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="图标类型">
              <el-select v-model="rightblock" placeholder="请选择">
              <el-option
                v-for="item in rightblockdata"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
             <el-input v-model="rightdata" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>   
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-tag>底部布局</el-tag>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="12">
          <el-form-item label="是否隐藏">
              <el-select v-model="footerdisplay" placeholder="请选择">
              <el-option
                v-for="item in footerdisplaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="footerfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="12">
          <el-form-item label="文字大小">
              <el-select v-model="footerfontsizeval" placeholder="请选择">
              <el-option
                v-for="item in footerfontsizedata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col>   
        <el-col :span="12">
          <el-form-item label="图标类型">
              <el-select v-model="footerblock" placeholder="请选择">
              <el-option
                v-for="item in footerblockdata"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
             <el-input v-model="footerdata" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col> 
      </el-row>
    </el-form>
    <el-divider></el-divider>
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="24">
          <el-form-item label="">
              <el-button type="primary" size="small" @click="save" class="el-button filter-item el-button--primary el-button--mini">保存</el-button>
          </el-form-item>
        </el-col> 
         
      </el-row>
    </el-form>
  </div>
</template>
<script>


export default {
  name: 'Main',

  data() {
   return{
     //顶部设置
     headerfontrcolor:'#fff',
     headerfontsizeval:'16',
     headerfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     //指标设置
     targetfontrcolor:'#fff',
     targetfontsizeval:'16',
     targetIndexfontrcolor:'#fff',
     targetIndexfontsizeval:'16',
     targetblockindex:0,
     targetfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     targetblock:'',
     targetblockdata:[
       {name:'折线图',id:'line'},
       {name:'柱形图',id:'bar'},
       {name:'饼图',id:'pie'},
     ],
     targetdata:'1',
     targetdisplay:'显示',
     targetdisplaydata:[ 
       {name:'显示',id:'显示'},
       {name:'隐藏',id:'隐藏'},
      ],
     //左侧设置
     leftfontrcolor:'#fff',
     leftfontsizeval:'16',
     leftblockindex:0,
     leftfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     leftblock:'line',
     leftblockdata:[
       {label:'折线图',value:'line'},
       {label:'柱形图',value:'bar'},
       {label:'饼图',value:'pie'},
     ],
     leftdata:'1',
     leftdisplay:'显示',
     leftdisplaydata:[ 
       {name:'显示',id:'显示'},
       {name:'隐藏',id:'隐藏'},
      ],
     //右侧设置
     rightfontrcolor:'#fff',
     rightfontsizeval:'16',
     rightblockindex:0,
     rightfontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
     rightblock:'line',
     rightblockdata:[
       {label:'折线图',value:'line'},
       {label:'柱形图',value:'bar'},
       {label:'饼图',value:'pie'},
     ],
     rightdata:'1',
     rightdisplay:'显示',
     rightdisplaydata:[ 
       {name:'显示',id:'显示'},
       {name:'隐藏',id:'隐藏'},
      ],
      //中间设置
      centertype:'',
      centertypedata:[
        {name:'地图',id:'map0'},
        {name:'地图-有点和连线的',id:'map1'},
        {name:'地图-带显示条件的',id:'map2'},
      ],
      //底部设置
      footerfontrcolor:'#fff',
      footerfontsizeval:'16',
      footerblockindex:0,
      footerfontsizedata:[
        {name:'14',id:'14'},
        {name:'15',id:'15'},
        {name:'18',id:'18'},
        {name:'20',id:'20'},
        {name:'25',id:'25'},
        {name:'30',id:'30'},
        {name:'35',id:'34'},
      ],
      footerblock:'line',
      footerblockdata:[
        {label:'折线图',value:'line'},
        {label:'柱形图',value:'bar'},
        {label:'饼图',value:'pie'},
      ],
      footerdata:'1',
      footerdisplay:'显示',
      footerdisplaydata:[ 
       {name:'显示',id:'显示'},
       {name:'隐藏',id:'隐藏'},
      ],

      screendata:{
        main:{
          bg:'url('+require('assets/img/bg.png')+') no-repeat',
          bgSize:"100% 100%"
        },
        header:{
          color:'#fff',
          fontSize:'16',
          headerheight:60,
          headermagin:10,
          headerbg:'url('+require('assets/img/header.png')+') no-repeat'
        },
        target:{
          color:'#fff',
          fontSize:'16',
          Indexcolor:'#fff',
          IndexfontSize:'16',
          targetheight:60,
          targetmagin:10,
          targetbg:'url('+require('assets/img/path_bg.png')+') no-repeat',
          targetdata:1,
          targetdisplay:'显示',
        },
        left:{
          color:'#fff',
          fontSize:'16',
          leftbg:'url('+require('assets/img/left.png')+') no-repeat',
          leftdata:1,
          lefttype:'line',
          leftdisplay:'显示',
        },
        center:{
          type:'map'
        },
        right:{
          color:'#fff',
          fontSize:'16',
          footermargin:"10px 0px",
          rightbg:'url('+require('assets/img/left.png')+') no-repeat',
          rightdata:1,
          righttype:'line',
          rightdisplay:'显示',
        },
        footer:{
          color:'#fff',
          fontSize:'16',
          footerheight:150,
          footerbg:'url('+require('assets/img/left.png')+') no-repeat',
          footerdata:1,
          footertype:'line',
          footerdisplay:'显示',
        }
     },
   }
  },
  methods:{
    //保存
    save(){
      this.screendata.header.color=this.headerfontrcolor
      this.screendata.header.fontSize=this.headerfontsizeval

      this.screendata.target.color=this.targetfontrcolor
      this.screendata.target.fontSize=this.targetfontsizeval
      this.screendata.target.Indexcolor=this.targetIndexfontrcolor
      this.screendata.target.IndexfontSize=this.targetIndexfontsizeval
      this.screendata.target.targetdata=this.targetdata
      this.screendata.target.targetdisplay=this.targetdisplay

      this.screendata.left.color=this.leftfontrcolor
      this.screendata.left.fontSize=this.leftfontsizeval
      this.screendata.left.leftdata=this.leftdata
      this.screendata.left.leftdisplay=this.leftdisplay
      this.screendata.left.lefttype=this.leftblock

      this.screendata.right.color=this.rightfontrcolor
      this.screendata.right.fontSize=this.rightfontsizeval
      this.screendata.right.rightdata=this.rightdata
      this.screendata.right.rightdisplay=this.rightdisplay
      this.screendata.right.righttype=this.rightblock

      this.screendata.footer.color=this.footerfontrcolor
      this.screendata.footer.fontSize=this.footerfontsizeval
      this.screendata.footer.footerdata=this.footerdata
      this.screendata.footer.footerdisplay=this.footerdisplay
      this.screendata.footer.footertype=this.footerblock

      this.$.removeCookie('screendata')
      this.$.cookie('screendata', JSON.stringify(this.screendata));
      this.$message({
          message: '保存成功',
          type: 'success'
        });

    }
  },
  mounted(){
    if(this.$.cookie('screendata')===undefined){
      this.$.cookie('screendata',JSON.stringify(this.screendata))
    }
    this.screendata=JSON.parse(this.$.cookie('screendata'))
    this.headerfontrcolor=this.screendata.header.color
    this.headerfontsizeval=this.screendata.header.fontSize

    this.targetfontrcolor=this.screendata.target.color
    this.targetfontsizeval=this.screendata.target.fontSize
     this.targetIndexfontrcolor=this.screendata.target.Indexcolor
    this.targetIndexfontsizeval=this.screendata.target.IndexfontSize
    this.targetdata=this.screendata.target.targetdata
    this.targetdisplay=this.screendata.target.targetdisplay

    this.leftfontrcolor=this.screendata.left.color
    this.leftfontsizeval=this.screendata.left.fontSize
    this.leftdata=this.screendata.left.leftdata
    this.leftdisplay=this.screendata.left.leftdisplay
    this.leftblock=this.screendata.left.lefttype

    this.rightfontrcolor=this.screendata.right.color
    this.rightfontsizeval=this.screendata.right.fontSize
    this.rightdata=this.screendata.right.rightdata
    this.rightdisplay=this.screendata.right.rightdisplay
    this.rightblock=this.screendata.right.righttype

    this.footerfontrcolor=this.screendata.footer.color
    this.footerfontsizeval=this.screendata.footer.fontSize
    this.footerdata=this.screendata.footer.footerdata
    this.footerdisplay=this.screendata.footer.footerdisplay
    this.footerblock=this.screendata.footer.footertype


  },

}
</script>
<style >
.app-container .el-form.app-form.el-form--inline .row-1 .addblock .el-form-item .el-form-item__content input{
  width:100px;
}
.app-container .el-form.app-form.el-form--inline .row-1 .addblock .el-form-item .el-form-item__content > div{
  width:100px;
}
</style>

