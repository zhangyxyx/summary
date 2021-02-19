<template>
  <div class="app-container">
    <h1>布局</h1>
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="targetfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
          <el-form-item label="文字大小">
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
        <el-col :span="24" class="addblock">
          <el-form-item label="几个显示块">
             左侧第<el-input v-model="targetblockindex" placeholder="请输入1,2,3...."></el-input>个显示块，
             名称：<el-input v-model="targetblocktext" placeholder="请输入"></el-input>显示形式是 
               <el-button type="primary"  v-on:click="addtarget()">添加</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" class="addblock">
          <el-form-item label="">
              <el-table
                :data="targettableData"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="第几个显示块"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="显示类型"
                  width="180">
                </el-table-column>
                 <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="leftremove(scope.row)" type="text" size="small">删除</el-button>
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="leftfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
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
        <el-col :span="24" class="addblock">
          <el-form-item label="左侧几个显示块">
             左侧第<el-input v-model="leftblockindex" placeholder="请输入1,2,3...."></el-input>个显示块，
             名称：<el-input v-model="leftblocktext" placeholder="请输入"></el-input>显示形式是
             <el-select v-model="leftblock" placeholder="请选择">
              <el-option
                v-for="item in leftblockdata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
               <el-button type="primary"  v-on:click="addleft()">添加</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" class="addblock">
          <el-form-item label="">
              <el-table
                :data="lefttableData"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="第几个显示块"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="显示类型"
                  width="180">
                </el-table-column>
                 <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="leftremove(scope.row)" type="text" size="small">删除</el-button>
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="rightfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
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
        <el-col :span="24" class="addblock">
          <el-form-item label="左侧几个显示块">
             左侧第<el-input v-model="rightblockindex" placeholder="请输入1,2,3...."></el-input>个显示块，
             名称：<el-input v-model="rightblocktext" placeholder="请输入"></el-input>显示形式是
             <el-select v-model="rightblock" placeholder="请选择">
              <el-option
                v-for="item in rightblockdata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
               <el-button type="primary"  v-on:click="addright()">添加</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" class="addblock">
          <el-form-item label="">
              <el-table
                :data="righttableData"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="第几个显示块"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="显示类型"
                  width="180">
                </el-table-column>
                 <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="leftremove(scope.row)" type="text" size="small">删除</el-button>
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
        <el-col :span="6">
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
        <el-col :span="6">
          <el-form-item label="文字颜色">
              <el-color-picker v-model="footerfontrcolor"></el-color-picker>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
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
        <el-col :span="24" class="addblock">
          <el-form-item label="左侧几个显示块">
             左侧第<el-input v-model="footerblockindex" placeholder="请输入1,2,3...."></el-input>个显示块，
             名称：<el-input v-model="footerblocktext" placeholder="请输入"></el-input>显示形式是
             <el-select v-model="footerblock" placeholder="请选择">
              <el-option
                v-for="item in footerblockdata"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
              </el-select>  
               <el-button type="primary"  v-on:click="addfooter()">添加</el-button>
          </el-form-item>
        </el-col> 
        <el-col :span="24" class="addblock">
          <el-form-item label="">
              <el-table
                :data="footertableData"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="id"
                  label="第几个显示块"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="type"
                  label="显示类型"
                  width="180">
                </el-table-column>
                 <el-table-column
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="leftremove(scope.row)" type="text" size="small">删除</el-button>
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
  name: 'setlayout',

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
     targetblocktext:'',
     targettableData:[],
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
     leftblock:'',
     leftblockdata:[
       {name:'折线图',id:'line'},
       {name:'柱形图',id:'bar'},
       {name:'饼图',id:'pie'},
     ],
     leftblocktext:'',
     lefttableData:[],
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
     rightblock:'',
     rightblockdata:[
       {name:'折线图',id:'line'},
       {name:'柱形图',id:'bar'},
       {name:'饼图',id:'pie'},
     ],
     rightblocktext:'',
     righttableData:[],
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
      footerblock:'',
      footerblockdata:[
        {name:'折线图',id:'line'},
        {name:'柱形图',id:'bar'},
        {name:'饼图',id:'pie'},
      ],
      footerblocktext:'',
      footertableData:[],
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
          targetheight:60,
          targetmagin:10,
          targetbg:'url('+require('assets/img/path_bg.png')+') no-repeat',
          targetdata:[
              // {name:'左边标题1',type:'line',id:'one',leftlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[10, 20, 36, 10, 10, 20]
              // }},
              // {name:'左边标题2',type:'bar',id:'two',leftlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[5, 20, 36, 10, 10, 20]
              // }},
          ],
          targetdisplay:'显示',
        },
        left:{
          color:'#fff',
          fontSize:'16',
          leftbg:'url('+require('assets/img/left.png')+') no-repeat',
          leftdata:[
              // {name:'左边标题1',type:'line',id:'one',leftlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[10, 20, 36, 10, 10, 20]
              // }},
              // {name:'左边标题2',type:'bar',id:'two',leftlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[5, 20, 36, 10, 10, 20]
              // }},
          ],
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
          rightdata:[
              // {name:'右边标题1',type:'bar',id:'one',rightlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[10, 20, 36, 10, 10, 20]
              // }},
              // {name:'右边标题2',type:'line',id:'two',rightlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[5, 20, 36, 10, 10, 20]
              // }},
          ],
          rightdisplay:'显示',
        },
        footer:{
          color:'#fff',
          fontSize:'16',
          footerheight:150,
          footerbg:'url('+require('assets/img/left.png')+') no-repeat',
          footerdata:[
              // {name:'右边标题1',type:'bar',id:'one',footerlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[10, 20, 36, 10, 10, 20]
              // }},
              // {name:'右边标题2',type:'line',id:'two',footerlinedata:{
              //   xAxisdata:["1月","2月","3月","4月","5月","6月"],
              //   seriesdata:[5, 20, 36, 10, 10, 20]
              // }},
          ],
          footerdisplay:'显示',
        }
     },
   }
  },
  methods:{
    //左侧添加
    addleft(){
      var json={
        name:this.leftblocktext,
        type:this.leftblock,
        id:this.leftblockindex,
        leftlinedata:{
          xAxisdata:["1月","2月","3月","4月","5月","6月"],
          seriesdata:[10, 20, 36, 10, 10, 20]
        }
      }
      this.lefttableData.push(json)
    },
    //右侧添加
    addright(){
      var json={
        name:this.rightblocktext,
        type:this.rightblock,
        id:this.rightblockindex,
        rightlinedata:{
          xAxisdata:["1月","2月","3月","4月","5月","6月"],
          seriesdata:[10, 20, 36, 10, 10, 20]
        }
      }
      this.righttableData.push(json)
    },
    //右侧添加
    addfooter(){
      var json={
        name:this.footerblocktext,
        type:this.footerblock,
        id:this.footerblockindex,
        footerlinedata:{
          xAxisdata:["1月","2月","3月","4月","5月","6月"],
          seriesdata:[10, 20, 36, 10, 10, 20]
        }
      }
      this.footertableData.push(json)
    },
    //指标添加
    addtarget(){
      var json={
        name:this.targetblocktext,
        type:this.targetblock,
        id:this.targetblockindex,
        targetinedata:{
          xAxisdata:["1月","2月","3月","4月","5月","6月"],
          seriesdata:[10, 20, 36, 10, 10, 20]
        }
      }
      this.targettableData.push(json)
    },
    //保存
    save(){
      this.screendata.header.color=this.headerfontrcolor
      this.screendata.header.fontSize=this.headerfontsizeval

      this.screendata.target.color=this.targetfontrcolor
      this.screendata.target.fontSize=this.targetfontsizeval
      //this.screendata.target.targetdata=JSON.stringify(this.targettableData)
      this.screendata.target.targetdisplay=this.targetdisplay

      this.screendata.left.color=this.leftfontrcolor
      this.screendata.left.fontSize=this.leftfontsizeval
      //this.screendata.left.leftdata=this.lefttableData
      this.screendata.left.leftdisplay=this.leftdisplay

      this.screendata.right.color=this.rightfontrcolor
      this.screendata.right.fontSize=this.rightfontsizeval
      //this.screendata.right.rightdata=this.righttableData
      this.screendata.right.rightdisplay=this.rightdisplay

      this.screendata.footer.color=this.footerfontrcolor
      this.screendata.footer.fontSize=this.footerfontsizeval
      //this.screendata.footer.footerdata=this.footertableData
      this.screendata.footer.footerdisplay=this.footerdisplay

      this.$.removeCookie('screendata')
      this.$.cookie('screendata', JSON.stringify(this.screendata));
      console.log(1)
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
    this.targettableData=this.screendata.target.targetdata
    this.targetdisplay=this.screendata.target.targetdisplay

    this.leftfontrcolor=this.screendata.left.color
    this.leftfontsizeval=this.screendata.left.fontSize
    this.lefttableData=this.screendata.left.leftdata
    this.leftdisplay=this.screendata.left.leftdisplay

    this.rightfontrcolor=this.screendata.right.color
    this.rightfontsizeval=this.screendata.right.fontSize
    this.righttableData=this.screendata.right.rightdata
    this.rightdisplay=this.screendata.right.rightdisplay

    this.footerfontrcolor=this.screendata.footer.color
    this.footerfontsizeval=this.screendata.footer.fontSize
    this.footertableData=this.screendata.footer.footerdata
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

