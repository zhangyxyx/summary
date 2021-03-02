<template>
  <div class="app-container resource" style="position:relative;">
    <el-row class="clicksumit" style="width:200px;height:40px;position:absolute;right:0px;top:22px;z-index:2">
      <el-col :span="24">
        <el-button type="primary"  v-on:click="submitadd()">提交</el-button>
      </el-col> 
    </el-row>
    <el-row class="row-1 checkItemselect">
      <el-col :span="2" style="padding-top:50px">
        <p style="padding:5px">节点</p>
        <el-tree
          :data="Nodeslist"
          show-checkbox
          node-key="nodeCode"
          ref="nodestree"
          :props="NodeslistProps">
        </el-tree>
    </el-col>
      <el-col :span="14" style="height:500px">
        <el-tabs v-model="activeName" type="card"  @tab-click="handleClick">
          <el-tab-pane label="按资源类型授权" name="resourcetype" >
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col v-for="item in resourcetypeData"  :span="resourcetypeEveryWidth" :key="item['resClassid']">
                      <p style="padding:5px">{{item['resTypeName']}}</p>
                      <el-tree
                        :data="item"
                        show-checkbox
                        node-key="resTypeid"
                        ref="tree"
                        :props="resourcetypeDataProps">
                      </el-tree>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按资源属性授权" name="resourceattr">
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col v-for="item in resourceattrData" :span="resourceattrEveryWidth" :key="item['resClassid']">
                      <p style="padding:5px">{{item['propName']}}</p>
                      <el-tree
                        :data="item"
                        show-checkbox
                        node-key="propCode"
                        ref="tree"
                        :props="resourceattrDataProps">
                      </el-tree>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按厂商授权" name="resourcevendor">
             <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col v-for="item in resourcevendorData" :span="resourcevendorEveryWidth" :key="item['vendor']">
                      <p style="padding:5px">{{item['vendorName']}}</p>
                      <el-tree
                        :data="item"
                        show-checkbox
                        node-key="vendor"
                        ref="tree"
                        :props="resourcevendorDataProps">
                      </el-tree>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>  
          </el-tab-pane>
        </el-tabs>
      </el-col> 
      <el-col :span="2" style="height:500px;display:flex;align-items:center;">
        <el-row style="text-align:center">
            <el-col :span="24" style="margin:10px 0px">
            <el-button type="primary"  v-on:click="clickadd()">添加》</el-button>
            </el-col>
            <el-col :span="24">
            <el-button type="primary"  v-on:click="clickremove()">《删除</el-button>
            </el-col>
        </el-row>  
      </el-col>
      <el-col :span="6" style="margin-top:50px">
        <el-table  
            :data="clicktabledata"
            stripe
            border
            :height="tableheight" 
            header-cell-class-name="headercell"
            cell-class-name="cellclazz"
            class="app-table"
            @selection-change="handleSelectionChange"
          >    
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="节点" prop="nodename"  align="center" ></el-table-column>
          <el-table-column label="权限大类" prop="resclassname" align="center" ></el-table-column>
          <el-table-column label="权限子类" prop="restypename" align="center" ></el-table-column>
          <el-table-column label="权限值" prop="res" align="center" ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import recheck from '@/components/common/recheck.js'
import axios from 'axios'
export default {
  name: 'resourceauthor',
  data() {
    return{
        createnetUserid:'admin',
        netUserid:'',
        scrollerHeight:300,
        activeName:'resourcetype',
        resourceJson:{
          'nodes':{},
          'resourcetype':{},
          'resourceattr':{},
          'resourcevendor':{},
        },
        resourcet:{
          'resourcetype':'按资源类型授权',
          'resourceattr':'按资源属性授权',
          'resourcevendor':'按厂商授权',
        },
        //节点
        Nodeslist:[],
        NodeslistProps: {
          children: 'children',
          label: 'nodeName'
        },
        //按资源类型授权
        resourcetypeData:[],
        resourcetypeEveryWidth:0,
        resourcetypeDataProps: {
          children: 'resTypeList',
          label: 'resTypeName'
        },
        //按资源属性授权
        resourceattrData:[],
        resourceattrEveryWidth:0,
        resourceattrDataProps: {
          children: 'resPropList',
          label: 'propName'
        },
        //按厂商授权
        resourcevendorData:[],
        resourcevendorEveryWidth:0,
        resourcevendorDataProps: {
          children: 'resPropList',
          label: 'vendorName'
        },
        //表格
        tablechecks:[],
        tableData: [],
        tableDatainit:[],
        tableheight:400,
        pageSize:9999999,
        currentPage:1,
        total:1,
    }
  },
  computed:{
    clicktabledata:function(){
      return this.tableData//.slice((this.currentPage-1) * this.pageSize, this.currentPage*this.pageSize)
    }
  },
  methods: {
    //获取用户已有权限
    getUserresource(){
      var that=this
      var netUserid=this.netUserid
      var url=api
      axios(url,({}), ("get")).then((result1)=>{
        var result=result1.data
        if(result.tip==='成功'){
          var data=result.data
          var arr=data
          that.tableData.splice(arr.length)
          for(var i=0;i<arr.length;i++){
            var json=arr[i]
            that.$set(that.tableData,i,json)
          }
        }
      })
    },
    //点击全部增加
    submitadd(){
      var that=this
      var netUserid=this.netUserid
      var data=this.tableData
      console.log(data)
      var arr=[]
      for(var i=0;i<data.length;i++){
        var json={
          "nodeCode":data[i]['nodeCode'],
          "resType":data[i]['resType'],
          "res":data[i]['res'],
        }
        arr.push(json)
      }
      var params={
        "netUserid":netUserid,
        "authType":"CFG",
        "authList":arr
      }
      var url=api
      axios.post(url,params).then((result1)=>{
        var result=result1.data
        if(result.tip==='成功'){
          this.$message({
            message: '节点资源授权成功！',
            type: 'success'
          });
        }else{
          this.$message({
            message: result.tip,
            type: 'success'
          });
        }
      })
    },

    //点击添加
    clickadd(){
      this.setCheck()
      this.setAddTable()
    },
    //点击删除
    clickremove(){
      var tablearr=this.tablechecks
      var checkarr=this.resourceJson
      var tabledata=this.tableData

      for(var i=0;i<tablearr.length;i++){
        var nodeCode=tablearr[i]['nodeCode']
        var resType=tablearr[i]['resType']
        var res=tablearr[i]['res']
        for(var j=0;j<tabledata.length;j++){
          if(tabledata[j]['nodeCode']===nodeCode&&tabledata[j]['resType']===resType&&tabledata[j]['res']===res){
            tabledata.splice(j,1)
            j--
          }
        }
      }
    },
    //表格多选
    handleSelectionChange(val){
      this.tablechecks = val;
    },
    //切换tab
    handleClick(a,b){
    },
    //设置选中
    setCheck(){
      var nodesdata=this.$refs.nodestree
      var result=nodesdata.getCheckedNodes()
      var arr=[]
      for(var j=0;j<result.length;j++){
        var json={
          nodeCode: result[j]['nodeCode'],
          nodeName: result[j]['nodeName'],
        }
        arr.push(json)
      }
      this.resourceJson.nodes=arr
      var data=this.$refs.tree
      if(this.activeName==='resourcetype'){
        for(var i=0;i<data.length;i++){
          var result=data[i].getCheckedNodes()
          var arr=[]
          for(var j=0;j<result.length;j++){
            arr.push(result[j]['resTypeid'])
          }
          this.resourceJson.resourcetype[data[i].data[0]['resTypeid']]={
            'arr':arr,
            'resClassName':data[i].data[0]['resClassName'],
            'resClassid':data[i].data[0]['resClassid']
          }      
        }
      }
      if(this.activeName==='resourceattr'){
        for(var i=0;i<data.length;i++){
          var result=data[i].getCheckedNodes()
          var arr=[]
          for(var j=0;j<result.length;j++){
            arr.push(result[j]['propCode'])
          }    
          this.resourceJson.resourcetype[data[i].data[0]['propCode']]={
            'arr':arr,
            'resClassName':data[i].data[0]['resClassName'],
            'resClassid':data[i].data[0]['resClassid']
          }  
        }
      }
      if(this.activeName==='resourcevendor'){
        for(var i=0;i<data.length;i++){
          var result=data[i].getCheckedNodes()
          var arr=[]
          for(var j=0;j<result.length;j++){
            arr.push(result[j]['vendor'])
          }
          this.resourceJson.resourcetype[data[i].data[0]['vendor']]={
            'arr':arr,
            'vendor':data[i].data[0]['vendor'],
            'vendorName':data[i].data[0]['vendorName']
          } 
        }
      }
    },
    //添加到表格中
    setAddTable(){
      this.tableDatainit=[]
      var result=this.resourceJson
      for(var m=0;m<result['nodes'].length;m++){
        for(var key in result){
          if(key!=='nodes'){
            for(var kk in result[key]){
              for(var i=0;i<result[key][kk]['arr'].length;i++){
                var item=result[key][kk]['arr'][i]
                if(result[key][kk]['resClassid']===undefined){
                  var json={
                    "nodename": result['nodes'][m]['nodeName'],
                    "nodeCode": result['nodes'][m]['nodeCode'],
                    "resclassname": this.resourcet[key],
                    "restypename": result[key][kk]['vendorName'],
                    "res":item,
                    "parent1":key,
                    "parent2":result[key][kk]['vendorName'],
                    "resvalue":"",
                    "resType":'VENDOR'//result[key][kk]['vendor'],
                  }
                }else{
                  var json={
                    "nodename": result['nodes'][m]['nodeName'],
                    "nodeCode": result['nodes'][m]['nodeCode'],
                    "resclassname": this.resourcet[key],
                    "restypename": result[key][kk]['resClassName'],
                    "res":item,
                    "parent1":key,
                    "parent2":result[key][kk]['resClassid'],
                    "resvalue":"",
                    "resType":result[key][kk]['resClassid'],
                  }
                }

                this.tableDatainit.push(json)
              }
            }
          }
        }
      }
      var arr=this.tableDatainit
      var arr1=this.tableData
      var arr2=[]
      arr2=arr1.concat(arr)
      for(var i=0;i<arr2.length;i++){
        for(var j=i+1;j<arr2.length;j++){
          if(arr2[i]['nodeCode']===arr2[j]['nodeCode']&&arr2[i]['res']===arr2[j]['res']&&arr2[i]['resType']===arr2[j]['resType']){
            arr2.splice(j,1)
          }
        }
      }
      console.log(arr2)
      this.tableData.splice(arr2.length)
      for(var i=0;i<arr2.length;i++){
        var json=arr2[i]
        this.$set(this.tableData,i,json)
      }
    },
    //获取节点数据
    getNodesData(){
      var url=api
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        var data=result.data[0]
        this.Nodeslist=[data]
      })
    },
    //按资源类型授权
    getresourcetype(){
      var that=this
      var url=api
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        for(var i=0;i<result.data.length;i++){
          var json=result.data[i]
          json['resTypeName']=json['resClassName']
          json['resTypeid']=json['resClassid']
          that.$set(that.resourcetypeData,i,[json])
        }
        that.resourcetypeEveryWidth=Math.floor(24/result.data.length)
      }) 
    },
    //按资源属性授权
    getresourceattr(){
      var that=this
      var url=api
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        for(var i=0;i<result.data.length;i++){
          var json=result.data[i]
          json['propCode']=json['resClassid']
          json['propName']=json['resClassName']
          that.$set(that.resourceattrData,i,[json])
        }
        that.resourceattrEveryWidth=Math.floor(24/result.data.length)
      }) 
    },
    //按厂商授权
    getresourcevendor(){
      var that=this
      var url=api
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        for(var i=0;i<result.data.length;i++){
          var json=result.data[i]
          json['vendorName']=json['vendorName']
          json['vendor']=json['vendor']
          that.$set(that.resourcevendorData,i,[json])
        }
        that.resourcevendorEveryWidth=Math.floor(24/result.data.length)
      }) 
    },
  },
  mounted() {
    this.netUserid=window.location.search.split('=')[1]
    this.getNodesData()
    this.getresourcetype()
    this.getresourceattr()
    this.getresourcevendor()
    this.getUserresource()
  },

}
</script>
<style>
.resource .el-tree{
  height:300px;
  overflow:auto
}
.resource .el-tree::-webkit-scrollbar {            
  width: 8px;             
  height: 8px;
  border:1px solid #fff ;
  border-radius: 10px;            
}         
.resource .el-tree::-webkit-scrollbar-track {             
  background-color: #fff;                        
  border-radius: 10px;      
  
}         
.resource .el-tree::-webkit-scrollbar-thumb {             
  background-color: #aed3f3;             
  border-radius: 10px;     
  
}         
.resource .el-tree::-webkit-scrollbar-thumb:hover {             
  background-color: #aed3f3;             
  border-radius: 10px;         
}
</style>
