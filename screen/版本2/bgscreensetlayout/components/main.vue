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
                v-for="item in displaydata"
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
             <el-button type="primary" size="small" @click="targetadd" class="el-button--mini">添加</el-button>
              <el-button type="primary" size="small" @click="targetremove" class="el-button--mini">删除</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" >
          <el-form-item label="">
             <el-table :data="targettableDatafunc" style="width: 100%;" height="250" @selection-change="targethandleSelectionChangeTag">
                <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                <el-table-column label="标题名称" prop="name" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="标题颜色" prop="color" align="center" >
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="标题大小" prop="fontSize" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.fontSize" placeholder="请选择">
                        <el-option 
                         v-for="item in fontsizedata"
                        :key="item.name"
                        :label="item.id"
                        :value="item.name">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
                <el-table-column label="数值名称" prop="name" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.name1" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="数值颜色" prop="color" align="center" >
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color1"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="数字大小" prop="fontSize" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.fontSize1" placeholder="请选择">
                        <el-option 
                         v-for="item in fontsizedata"
                        :key="item.name"
                        :label="item.id"
                        :value="item.name">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
            </el-table>
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
                v-for="item in displaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
            <el-input v-model="leftdata" placeholder="请输入"></el-input>
            <el-button type="primary" size="small" @click="leftadd" class="el-button--mini">添加</el-button>
            <el-button type="primary" size="small" @click="leftremove" class="el-button--mini">删除</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="">
             <el-table :data="lefttableDatafunc" style="width: 100%;" height="250" @selection-change="lefthandleSelectionChangeTag">
                <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                <el-table-column label="标题名称" prop="name" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="图表类型" prop="echartstype" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.echartstype" placeholder="请选择">
                        <el-option 
                          v-for="item in echartblockdata"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
                <el-table-column label="标题颜色" prop="color" align="center" >
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="标题大小" prop="fontSize" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.fontSize" placeholder="请选择">
                        <el-option 
                         v-for="item in fontsizedata"
                        :key="item.name"
                        :label="item.id"
                        :value="item.name">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
            </el-table>
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
                v-for="item in displaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
            <el-input v-model="rightdata" placeholder="请输入"></el-input>
            <el-button type="primary" size="small" @click="rightadd" class="el-button--mini">添加</el-button>
            <el-button type="primary" size="small" @click="rightremove" class="el-button--mini">删除</el-button>
          </el-form-item>
        </el-col>  
        <el-col :span="24" >
          <el-form-item label="">
             <el-table :data="righttableDatafunc" style="width: 100%;" height="250" @selection-change="righthandleSelectionChangeTag">
               <el-table-column type="selection" width="55" reserve-selection></el-table-column>
               <el-table-column label="标题名称" prop="name" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="图表类型" prop="echartstype" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.echartstype" placeholder="请选择">
                        <el-option 
                          v-for="item in echartblockdata"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
                <el-table-column label="标题颜色" prop="color" align="center" >
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="标题大小" prop="fontSize" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.fontSize" placeholder="请选择">
                        <el-option 
                         v-for="item in fontsizedata"
                        :key="item.name"
                        :label="item.id"
                        :value="item.name">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
            </el-table>
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
                v-for="item in displaydata"
                :key="item.name"
                :label="item.id"
                :value="item.name">
              </el-option>
              </el-select>  
          </el-form-item>
        </el-col> 
        <el-col :span="12" class="addblock">
          <el-form-item label="显示块">
             <el-input v-model="footerdata" placeholder="请输入"></el-input>
             <el-button type="primary" size="small" @click="footeradd" class="el-button--mini">添加</el-button>
             <el-button type="primary" size="small" @click="footerremove" class="el-button--mini">删除</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" >
          <el-form-item label="">
             <el-table :data="footertableDatafunc" style="width: 100%;" height="250" @selection-change="footerhandleSelectionChangeTag">
               <el-table-column type="selection" width="55" reserve-selection></el-table-column>
               <el-table-column label="标题名称" prop="name" align="center" >
                  <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="图表类型" prop="echartstype" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.echartstype" placeholder="请选择">
                        <el-option 
                          v-for="item in echartblockdata"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
                <el-table-column label="标题颜色" prop="color" align="center" >
                  <template slot-scope="scope">
                    <el-color-picker v-model="scope.row.color"></el-color-picker>
                  </template>
                </el-table-column>
                <el-table-column label="标题大小" prop="fontSize" align="center" >
                  <template slot-scope="scope">
                      <el-select v-model="scope.row.fontSize" placeholder="请选择">
                        <el-option 
                         v-for="item in fontsizedata"
                        :key="item.name"
                        :label="item.id"
                        :value="item.name">
                        </el-option>
                      </el-select> 
                  </template>
                </el-table-column>
            </el-table>
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
     //图表类型
      echartblockdata:[
       {label:'折线图',value:'line'},
       {label:'柱形图',value:'bar'},
       {label:'饼图',value:'pie'},
     ],
     //文字大小
     fontsizedata:[
       {name:'14',id:'14'},
       {name:'15',id:'15'},
       {name:'18',id:'18'},
       {name:'20',id:'20'},
       {name:'25',id:'25'},
       {name:'30',id:'30'},
       {name:'35',id:'34'},
     ],
      //显示隐藏
      displaydata:[ 
       {name:'显示',id:'显示'},
       {name:'隐藏',id:'隐藏'},
      ],
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
      targetblock:'',
      targetdata:'1',
      targetdisplay:'显示',
      targettableData:[],
      targetchecks:[],
     //左侧设置
      leftfontrcolor:'#fff',
      leftfontsizeval:'16',
      leftblockindex:0,
      leftblock:'line',
      leftdata:'1',
      leftdisplay:'显示',
      lefttableData:[],
      leftchecks:[],
     //右侧设置
      rightfontrcolor:'#fff',
      rightfontsizeval:'16',
      rightblockindex:0,
      rightblock:'line',
      rightdata:'1',
      rightdisplay:'显示',
      righttableData:[],
      rightchecks:[],
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
      footerblock:'line',
      footerdata:'1',
      footerdisplay:'显示',
      footertableData:[],
      footerchecks:[],

      //大屏
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
          targettableData:[],
        },
        left:{
          color:'#fff',
          fontSize:'16',
          leftbg:'url('+require('assets/img/left.png')+') no-repeat',
          leftdata:1,
          lefttype:'line',
          leftdisplay:'显示',
          lefttableData:[],
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
          righttableData:[],
        },
        footer:{
          color:'#fff',
          fontSize:'16',
          footerheight:150,
          footerbg:'url('+require('assets/img/left.png')+') no-repeat',
          footerdata:1,
          footertype:'line',
          footerdisplay:'显示',
          footertableData:[],
        }
     },
   }
  },
  computed:{
    lefttableDatafunc:function(){
      //this.leftdata=this.lefttableData.length
      return this.lefttableData
    },
    righttableDatafunc:function(){
      //this.rightdata=this.righttableData.length
      return this.righttableData
    },
    footertableDatafunc:function(){
      //this.footerdata=this.footertableData.length
      return this.footertableData
    },
    targettableDatafunc:function(){
      //this.targetdata=this.targettableData.length
      return this.targettableData
    },
  },
  methods:{
    //指标新增
    targetadd(){
      var targetdata=this.targetdata
      var arr=this.targettableData
      for(var i=0;i<targetdata;i++){
        var json={
          sort:Math.random().toString(36).substr(2),
          name:'指标标题'+i,
          color:'#fff',
          fontSize:12,
          name1:'数值标题'+i,
          color1:'#fff',
          fontSize1:12,
        }
        arr.push(json)
      }
      this.targettableData=arr
    },
    targethandleSelectionChangeTag(val){
      this.targetchecks=val
    },
    targetremove(){
      for(var i=0;i<this.targetchecks.length;i++){
        for(var j=0;j<this.targettableData.length;j++){
          if(this.targetchecks[i]['sort']===this.targettableData[j]['sort']){
            this.targettableData.splice(j,1)
            break;
          }
        }
      }
    },
    //左侧新增
    leftadd(){
      var leftdata=this.leftdata
      var arr=this.lefttableData
      for(var i=0;i<leftdata;i++){
        var json={
          name:'左侧标题'+i,
          sort:Math.random().toString(36).substr(2),
          echartstype:'line',
          color:'#fff',
          fontSize:12,
        }
        arr.push(json)
      }
      this.lefttableData=arr
    },
    lefthandleSelectionChangeTag(val){
      this.leftchecks=val
    },
    leftremove(){
      for(var i=0;i<this.leftchecks.length;i++){
        for(var j=0;j<this.lefttableData.length;j++){
          if(this.leftchecks[i]['sort']===this.lefttableData[j]['sort']){
            this.lefttableData.splice(j,1)
            break;
          }
        }
      }
    },
    //右侧 新增
    rightadd(){
      var rightdata=this.rightdata
      var arr=this.righttableData
      for(var i=0;i<rightdata;i++){
        var json={
          name:'右侧标题'+i,
          sort:Math.random().toString(36).substr(2),
          echartstype:'line',
          color:'#fff',
           fontSize:12,
        }
        arr.push(json)
      }
      this.righttableData=arr
    },
    righthandleSelectionChangeTag(val){
      this.rightchecks=val
    },
    rightremove(){
      for(var i=0;i<this.rightchecks.length;i++){
        for(var j=0;j<this.righttableData.length;j++){
          if(this.rightchecks[i]['sort']===this.righttableData[j]['sort']){
            this.righttableData.splice(j,1)
            break;
          }
        }
      }
    },
    //底部 新增
    footeradd(){
      var footerdata=this.footerdata
      var arr=this.footertableData
      for(var i=0;i<footerdata;i++){
        var json={
          name:'底部标题'+i,
          sort:Math.random().toString(36).substr(2),
          echartstype:'line',
          color:'#fff',
           fontSize:12,
        }
        arr.push(json)
      }
      this.footertableData=arr
    },
    footerhandleSelectionChangeTag(val){
      this.footerchecks=val
    },
    footerremove(){
      for(var i=0;i<this.footerchecks.length;i++){
        for(var j=0;j<this.footertableData.length;j++){
          if(this.footerchecks[i]['sort']===this.footertableData[j]['sort']){
            this.footertableData.splice(j,1)
            break;
          }
        }
      }
    },
    //保存
    save(){
      this.screendata.header.color=this.headerfontrcolor
      this.screendata.header.fontSize=this.headerfontsizeval

      this.screendata.target.targetdata=this.targetdata
      this.screendata.target.targetdisplay=this.targetdisplay

      
      this.screendata.left.leftdata=this.leftdata
      this.screendata.left.leftdisplay=this.leftdisplay

      
      this.screendata.right.rightdata=this.rightdata
      this.screendata.right.rightdisplay=this.rightdisplay

      
      this.screendata.footer.footerdisplay=this.footerdisplay
      this.screendata.footer.footerdata=this.footerdata


      this.$.removeCookie('screendata')
      this.$.cookie('screendata', JSON.stringify(this.screendata));
      this.$.cookie('targettableData', JSON.stringify(this.targettableData));
      this.$.cookie('lefttableData', JSON.stringify(this.lefttableData));
      this.$.cookie('righttableData', JSON.stringify(this.righttableData));
      this.$.cookie('footertableData', JSON.stringify(this.footertableData));
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
    if(this.$.cookie('targettableData')===undefined){
      var targettableData=[{
        'sort':1,
        'name':'指标标题',
        'color':'#fff',
        'fontSize':12,
        'name1':'数值标题',
        'color1':'#fff',
        'fontSize1':12,
      }]
      this.$.cookie('targettableData',JSON.stringify(targettableData))
    }
    if(this.$.cookie('lefttableData')===undefined){
      var lefttableData=[{
        'name':'左侧标题',
        'sort':1,
        'echartstype':'line',
        'color':'#fff',
        'fontSize':12,
      }]
      this.$.cookie('lefttableData',JSON.stringify(lefttableData))
    }
    if(this.$.cookie('righttableData')===undefined){
      var righttableData=[{
        'name':'左侧标题',
        'sort':1,
        'echartstype':'line',
        'color':'#fff',
        'fontSize':12,
      }]
      this.$.cookie('righttableData',JSON.stringify(righttableData))
    }
    if(this.$.cookie('footertableData')===undefined){
      var footertableData=[{
        'name':'底部标题',
        'sort':1,
        'echartstype':'line',
        'color':'#fff',
        'fontSize':12,
      }]
      this.$.cookie('footertableData',JSON.stringify(footertableData))
    }
    
    this.targettableData=JSON.parse(this.$.cookie('targettableData'))

    this.lefttableData=JSON.parse(this.$.cookie('lefttableData'))

    this.righttableData=JSON.parse(this.$.cookie('righttableData'))

    this.footertableData=JSON.parse(this.$.cookie('footertableData'))

    console.log(this.lefttableData)
    this.headerfontrcolor=this.screendata.header.color
    this.headerfontsizeval=this.screendata.header.fontSize

    this.targetdata=this.targettableData.length
    this.targetdisplay=this.screendata.target.targetdisplay

    this.leftdata=this.lefttableData.length
    this.leftdisplay=this.screendata.left.leftdisplay

    this.rightdata=this.righttableData.length
    this.rightdisplay=this.screendata.right.rightdisplay

    this.footerdata=this.footertableData.length
    this.footerdisplay=this.screendata.footer.footerdisplay


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

