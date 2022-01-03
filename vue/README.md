# vue
## 组件
> vue中常用的一些功能组件
1. tree 单选框
2. treecheck多选框
3. Addandmodify 可以对表格添加一行，并且在给某一行修改
4. Shuttlebox 穿梭框 选中左边多选框 点击添加到右侧表格中
5. 用element布局的话如果修改公共样式，可以在element-ui.css和element.css两个文件中修改
6. html可以单独引用vue和elementUI
7. check复选框
8. html中引入组件 组件传值 httpLoader
9. eventBus this.$vue.$on('函数名'，function(){}) this.$vue.$emit('函数名'，‘’)

## 功能
1. 表格多选   
reserve-selection   
row-key="wsNbr" 
```javascript
<el-table 
:data="devInfoData" 
:height="tableheight" 
border 
stripe 
row-key="wsNbr" //表格id
class="app-table" 
@selection-change="changeFun">
<el-table-column type="selection" width="55" reserve-selection></el-table-column>
    <el-table-column width="50" label="序号" align="center">
        <template scope="scope">
        <span>{{scope.$index+1}}</span>
        </template>
    </el-table-column>
    <el-table-column property="wsTitle" label="故障标题" align="center" ></el-table-column>
    <el-table-column property="wsNbr" label="工单号" align="center"></el-table-column>
    <el-table-column property="createTime" label="建单时间" align="center"></el-table-column>
    <el-table-column property="wsState" label="分析状态" align="center"></el-table-column>
    <el-table-column property="nodeName" label="分析报告" align="center" >
        <template slot-scope="scope">
        <p v-if="scope.row['wsState']==='finish'"  style="cursor:pointer;margin:0px 10px;overflow:hidden;text-overflow: ellipsis; white-space:nowrap;color:#2c9cfa"  @click="clickWorkExport">下载</p>
        <p v-else></p>
        </template>
    </el-table-column>
</el-table>
```

2. treecheck多选框
```javascript
//节点
NodeslistCheck:'',
Nodeslist:'',
Nodeslistid:'nodeCode',
Nodeslistlabel:'nodeName',
<TreeCheck :Tresslistdata="Nodeslist" :Tresslistid="Nodeslistid" :Tresslistlabel="Nodeslistlabel" @Tresslistidckeck="getcheckNodeslistid"/>
//获取节点
getNodes(){
    var url=recheck.urlCom+'/api/system/node/getNodeTree/'+this.createnetUserid
    axios(url, ({}), ("GET")).then((response)=>{
    var result=response.data
    var data=result.data[0]
    this.Nodeslist=data
    })
},
getcheckNodeslistid(data){
    var str=''
    for(var i=0;i<data.length;i++){
    str=str+data[i]+';'
    }
    this.NodeslistCheck=str
},
```


3. tree 单选框
```javascript
//所在组织
OrglistCheck:'',
Orglist:'',
Orglistid:'orgCode',
Orglistlabel:'orgName',
<Tree :Tresslistdata="Orglist" :Tresslistid="Orglistid" :Tresslistlabel="Orglistlabel" @Tresslistidckeck="getcheckOrglistid" style="width:100%"/>
//获取组织
getOrg(){
    var url=recheck.urlCom+'/api/system/config/getOrganizeTree'
    axios(url, ({}), ("GET")).then((response)=>{
    var result=response.data
    var data=result.data[0]
    this.Orglist=data
    this.OrglistCheck=data
    }) 
},
getcheckOrglistid(data){
    this.OrglistCheck=data
},
```

4. 引入vue文件

5. checkbox复选框
```javascript
<el-table-column
    :selectable="checkshow"
    type="selection"
    width="55">
</el-table-column>
```

## vue样式

1. 表格
```javascript
/*表格背景色*/
  .table .el-table th{
    background:#14415d
  }
  .table .el-table tr{
    background:#14415d
  }
  /*表格边框*/
  .table .el-table td{
    border: 1px solid #03f5f9;
  }
  .table .el-table th.is-leaf{
    border: 1px solid #03f5f9;
  }
  /*表格内容文字颜色*/
  .table .el-table{
    color:#03f5f9
  }
  /*表格表头文字颜色*/
  .table .el-table thead{
    color:#03f5f9
  }
  /*表格鼠标移入背景颜色变化*/
  .table  .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #3b5274 !important;
  }


  /*分页总数*/
  .table .el-pagination__total{
    color:#087a7b
  }
  /*分页每页显示*/
  .table .el-pagination__sizes{
    color:#087a7b
  }
  /*分页页码背景颜色*/
  .table .el-pager li{
    background:#addace
  }
  /*分页页码文字颜色*/
  .table .el-pagination{
    color:#087a7b
  }
  /*分页跳转文字颜色*/
  .table .el-pagination__jump{
    color:#087a7b
  }
  /*分页左右跳转*/
  .table .el-pagination .btn-prev{
    color:#087a7b
  }
  .table .el-pagination .btn-next{ 
    color:#087a7b
  }
  
  /*输入框样式*/
  .table .el-input__inner{
    background-color: #bb3030;
    border: 1px solid #982929;
    color: #0c185d;
  }
  /*下拉框下拉样式*/
  .el-select-dropdown{
    border: 1px solid #e4e7ed;
    background-color: #38a090;
  }
  /*下拉框下拉样式文字样式*/
   .el-select-dropdown__item{
    color:red
  }
```

2. 标签页
```javascript
  /*标签页顶部 背景颜色*/
    .form .el-tabs--border-card>.el-tabs__header{
      background-color: #6399ca;
      border-bottom: 1px solid #e4e7ed;
    }
    /*标签页顶部 文字颜色*/
    .form .el-tabs--border-card>.el-tabs__header .el-tabs__item{
      color:#5fe2dc
    }
    /*标签页顶部选中*/
    .form .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
      color: #5683a9;
      background-color: #29b3b3;
      border-right-color: #e5e5e5;
      border-left-color: #e5e5e5;
    }
    /*标签页 内容*/
    .form .el-tabs--border-card{
      background: #cc0f0f;
      border: 1px solid #e5e5e5;
    }
```

3. 树形
```javascript
/* 树形结构 初始化背景颜色和文字颜色 */
.el-tree{
  background: #091e34 !important;
  border: 1px solid #091e34 !important;
  color:#fff;
}
/* 鼠标移动上去之后背景颜色 */
.el-select-dropdown__item.hover{
  background: #091e34 !important;
}
/* 鼠标移动上去之后背景颜色 */
.el-tree-node__content:hover{
  background-color: #2470c0;
}
/* 鼠标选中之后背景颜色 */
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background: #091e34 !important;
}
```

4. vue
```javascript
 computed: {
    nowAreaFunc () {
      console.log(3333333)
      return this.$store.state.nowArea
    }
  },
  watch:{
    nowAreaFunc:function(val1,val2){
      console.log(555555)
      console.log(val1)
      console.log(val2)
    }
  },
```

5. iframe中调用vue的函数
```javascript
var test= $("#test1").val();
      var ifrm=$("iframe[name='ifrm'][src*='fatherTest.jsp']",window.parent.document);
      if(ifrm.is("iframe")){//tab方式打开
          var cont=ifrm[0].contentWindow;
          var set=ifrm.contents().find("#settest3");
          if(set.is("a")){
              set.click();
          }
          if(cont&&$.isFunction(cont.settest1)){
              cont.settest1(test);
          }
          if(cont&&$.isFunction(cont.settest2)){
              cont.settest2();
          }
      }else{//新窗口打开
         var cont= window.opener;
          if(cont&&!cont.closed){
              var set=$("#settest3",cont.document);
              if(set.is("a")){
                  set.click();
              }
              if($.isFunction(cont.settest1)){
                  cont.settest1(test);
              }
              if($.isFunction(cont.settest2)){
                  cont.settest2();
              }
          }     
      }
```

5. 在html中引入vue组件
httpVueRouter
```javascript
引入<script type="text/javascript" src="assets/lib/vue/js/httpVueLoader.js"></script>
使用<ipv4net mode="123" v-on:iserrshow="parentclick"></ipv4net> 注意用小写的比较好
父组件： 
Vue.use(httpVueLoader) 
new Vue({ 
  el: '#app', 
  components: { 
  'ipv4net': httpVueLoader('/ipmanage/ipaddrmodule/views/jsp/Ipv4Assigned/Ipv4AssignedCG/Ipv4AssignedAddNet.vue') 
  }, 
  directives: {clickoutside}, 
  data: function () {}, 
},
methods:{
  parentclick(data){
    console.log(1)
  }
},
) 
子组件：Ipv4AssignedAddNet.vue 
<template> 
<div class="report app-container">
{{mode}}
  子组件
<el-button size="small" type="primary" @click="clickFunc">点击</el-button>
</div> 
</template> 
<script> 
module.exports = { 
  props:{
    node:String
  },
  data: function() { 
    return { 
      who: 'world' 
    } 
  }，
  Methods:{
    clickFunc(){
      this.$emit('iserrshow',"1")  
    }
  }
} 
</script>
```


