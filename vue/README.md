# vue
## 组件
> vue中常用的一些功能组件
1. tree 单选框
2. treecheck多选框
3. Addandmodify 可以对表格添加一行，并且在给某一行修改
4. Shuttlebox 穿梭框 选中左边多选框 点击添加到右侧表格中

## 资料
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

3. tree 单选框
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


