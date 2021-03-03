<template>
  <div class="app-container resource" style="position:relative;">
    <el-row class="clicksumit" style="width:200px;height:40px;position:absolute;right:0px;top:22px;z-index:2">
      <el-col :span="24">
        <el-button type="primary"  v-on:click="submitadd()">提交</el-button>
      </el-col> 
    </el-row>
    <el-row class="row-1" :style="{height:checkHeight+'px'}">
      <el-col :span="2" style="height:100%;">
        <el-tabs v-model="activeName1" type="border-card"  @tab-click="handleClick" style="height:100%">
          <el-checkbox v-model="nodeall">全选节点</el-checkbox>
          <el-tab-pane label="节点" name="setnode" >
              <el-tree
                :data="Nodeslist"
                show-checkbox
                node-key="nodeCode"
                ref="nodestree"
                :props="NodeslistProps">
              </el-tree> 
          </el-tab-pane>
      </el-tabs>
      </el-col>
      <el-col :span="22" style="height:100%">
        <el-tabs v-model="activeName" type="border-card"  @tab-click="handleClick" style="height:100%">
          <el-tab-pane label="按资源类型授权" name="resourcetype" >
              <el-row style="height:100%">
                <el-col v-for="item in resourcetypeData"  :span="resourcetypeEveryWidth" :key="item['resClassid']" style="height:100%">
                  <p style="padding:5px">{{item['resTypeName']}}</p>
                  <el-tree
                    :data="item"
                    show-checkbox
                    node-key="resTypeid"
                    ref="tree"
                    :props="resourcetypeDataProps"
                    :style="{maxHeight:(checkHeight-300)+'px'}"
                    >
                  </el-tree>
                </el-col>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按资源属性授权" name="resourceattr">
              <el-row>
                <el-col v-for="item in resourceattrData" :span="resourceattrEveryWidth" :key="item['resClassid']">
                  <p style="padding:5px">{{item['propName']}}</p>
                  <el-tree
                    :data="item"
                    show-checkbox
                    node-key="propCode"
                    ref="tree"
                    :style="{maxHeight:(checkHeight-300)+'px'}"
                    :props="resourceattrDataProps">
                  </el-tree>
                </el-col>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按厂商授权" name="resourcevendor">
             <el-row>
                <el-col v-for="item in resourcevendorData" :span="resourcevendorEveryWidth" :key="item['vendor']">
                  <p style="padding:5px">{{item['vendorName']}}</p>
                  <el-tree
                    :data="item"
                    show-checkbox
                    node-key="vendor"
                    ref="tree"
                    :style="{maxHeight:(checkHeight-300)+'px'}"
                    :props="resourcevendorDataProps">
                  </el-tree>
                </el-col>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按设备授权" name="resourcedev">
             <el-row style="height:100%">
               <el-form inline class="app-form app-form-shadow">
                  <el-row class="row-1">
                    <el-col :span="6">
                      <el-form-item label="设备属性">
                        <el-select v-model="devtype" value-key="value" placeholder="请选择">
                          <el-option
                            v-for="item in devtypedata"
                            :key="item.value"
                            :label="item.label"
                            :value="item">
                          </el-option>
                        </el-select> 
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="">
                        <el-button type="primary"  v-on:click="getresourcedev">查询</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table  
                    :data="resourcedevDatas"
                    stripe
                    border
                    header-cell-class-name="headercell"
                    cell-class-name="cellclazz"
                    class="app-tablec"
                    row-key="deviceId"
                    @selection-change="handleSelectionChangeDev"
                  >    
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column label="设备名称" prop="deviceName"  align="center" ></el-table-column>
                  <el-table-column label="设备类型" prop="deviceTypeName" align="center" ></el-table-column>
                  <el-table-column label="设备型号" prop="deviceModeName" align="center" ></el-table-column>
                  <el-table-column label="所属节点" prop="nodeName" align="center" ></el-table-column>
                  <el-table-column label="设备地址" prop="loopAddress" align="center" ></el-table-column>
                </el-table>
                <el-pagination @size-change="devhandleSizeChange" @current-change="devhandleCurrentChange"
                    :current-page="devcurrentPage" :page-sizes="[15,20,30,50]" :page-size="devpageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="devtotal"
                    class="el-row pagination-container-right" style="float:right">
                </el-pagination>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按电路授权" name="resourcecircuit">
             <el-row style="height:100%">
                <el-form inline class="app-form app-form-shadow">
                    <el-row class="row-1">
                      <el-col :span="6">
                        <el-form-item label="电路类型">
                          <el-select v-model="circuittype" value-key="value" placeholder="请选择" >
                            <el-option
                              v-for="item in circuittypedata"
                              :key="item.value"
                              :label="item.label"
                              :value="item">
                            </el-option>
                          </el-select> 
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="">
                          <el-button type="primary"  v-on:click="getresourcecircuit">查询</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                </el-form>
                <el-table  
                    :data="resourcecircuitData"
                    stripe
                    border
                    header-cell-class-name="headercell"
                    cell-class-name="cellclazz"
                    class="app-tablec"
                    row-key="circuitID"
                    @selection-change="handleSelectionChangeCircuit"
                  >    
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column label="电路名称" prop="circuitName"  align="center" ></el-table-column>
                  <el-table-column label="A端信息" prop="adeviceName" align="center" ></el-table-column>
                  <el-table-column label="B端信息" prop="bdeviceName" align="center" ></el-table-column>
                  <el-table-column label="电路属性" prop="cirPropName" align="center" ></el-table-column>
                  <el-table-column label="带宽" prop="bandWidth" align="center" ></el-table-column>
                </el-table>
                <el-pagination @size-change="circuithandleSizeChange" @current-change="circuithandleCurrentChange"
                    :current-page="circuitcurrentPage" :page-sizes="[15,20,30,50]" :page-size="circuitpageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="circuittotal"
                    class="el-row pagination-container-right" style="float:right">
                </el-pagination>
              </el-row>  
          </el-tab-pane>
          <el-tab-pane label="按TAG授权" name="resourcetag">
             <el-row style="height:100%">
                <el-form inline class="app-form app-form-shadow">
                    <el-row class="row-1">
                      <el-col :span="6">
                        <el-form-item label="标签">
                          <el-input v-model="resourcetagchoosetag" placeholder="请选择" ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="标签类型">
                          <el-input v-model="resourcetagchoosetype" placeholder="请选择" ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="所属用户">
                          <el-input v-model="resourcetagchooseuser" placeholder="请选择" ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="">
                          <el-button type="primary"  v-on:click="getresourcetag">查询</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                </el-form>
                <el-table  
                    :data="resourcetagData"
                    stripe
                    border
                    header-cell-class-name="headercell"
                    cell-class-name="cellclazz"
                    class="app-tablec"
                    row-key="tag"
                    @selection-change="handleSelectionChangeTag"
                  >    
                  <el-table-column type="selection" width="55" reserve-selection></el-table-column>
                  <el-table-column label="TAG" prop="tag"  align="center" ></el-table-column>
                  <el-table-column label="TAG类型" prop="tagTypeDesc" align="center" ></el-table-column>
                  <el-table-column label="TAG描述" prop="tagDesc" align="center" ></el-table-column>
                  <el-table-column label="所属用户" prop="userName" align="center" ></el-table-column>
                  <el-table-column label="有效时限" prop="validDate" align="center" ></el-table-column>
                  <el-table-column label="相关资源数" prop="resNum" align="center" ></el-table-column>
                </el-table>
                <el-pagination @size-change="taghandleSizeChange" @current-change="taghandleCurrentChange"
                    :current-page="tagcurrentPage" :page-sizes="[15,20,30,50]" :page-size="tagpageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="tagtotal"
                    class="el-row pagination-container-right" style="float:right">
                </el-pagination>
              </el-row>  
          </el-tab-pane>
        </el-tabs>
      </el-col> 
    </el-row>
    <el-row class="row-1" style="height:30px;padding:10px 0px">
      <el-col :span="24" style="height:100%;">
        <el-row style="width:100%">
            <el-col :span="12" style="padding-right:20px;text-align:right">
            <el-button type="primary"  v-on:click="clickadd()">添加》</el-button>
            </el-col>
            <el-col :span="12">
            <el-button type="primary"  v-on:click="clickremove()">《删除</el-button>
            </el-col>
        </el-row>  
      </el-col>
    </el-row>
    <el-row class="row-1" :style="{height:checktableHeight+'px'}">
      <el-col :span="24" style="height:100%">
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
        checkHeight:200,
        checktableHeight:200,
        createnetUserid:'admin',
        netUserid:'',
        scrollerHeight:300,
        activeName:'resourcetype',
        resourceJson:{
          'nodes':{},
          'resourcetype':{},
          'resourceattr':{},
          'resourcevendor':{},
          'resourcedev':{},
          'resourcecircuit':{},
          'resourcetag':{},
        },
        resourcet:{
          'resourcetype':'按资源类型授权',
          'resourceattr':'按资源属性授权',
          'resourcevendor':'按厂商授权',
          'resourcedev':'按设备授权',
          'resourcecircuit':'按电路授权',
          'resourcetag':'按TAG授权',
        },
        //节点
        nodeall:false,
        activeName1:'setnode',
        Nodeslist:[],
        NodeslistProps: {
          children: 'children',
          label: 'nodeName',
          disabled:function(data,note){
            return data.selectFlag==='0'
          }
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
          children: 'resTypeList',
          label: 'vendorName'
        },
        //按设备授权
        devtype:'',
        devtypename:'',
        devtypedata:[
          {value:'DEV_IP_R',label:'路由器'},
          {value:'DEV_IP_S',label:'交换机'},
          {value:'DEV_IP_D',label:'DSLAM'},
          {value:'SUB',label:'子网'},
          {value:'DEV_IP_A',label:'AP'},
          {value:'DEV_IP_F',label:'防火墙'},
          {value:'DEV_IP_G',label:'流量清洗设备'},
          {value:'DEV_IP_C',label:'PDSN'},
          {value:'DEV_IP_Z',label:'WLAN AC'},
        ],
        resourcedevData:[],
        resourcedevchecks:[],
        devcurrentPage:1,
        devtotal:0,
        devpageSize:10,
        //按电路授权
        circuittype:'',
        circuittypedata:[ 
          {value:'CIR_IP_COM',label:'普通IP电路'},
          {value:'CIR_IP_ATM',label:'IP Over ATM电路'},
        ],
        resourcecircuitData:[],
        resourcecircuitchecks:[],
        circuitcurrentPage:1,
        circuittotal:0,
        circuitpageSize:10,

        //按TAG授权
        resourcetagchoosetag:'',
        resourcetagchoosetype:'',
        resourcetagchooseuser:'',
        resourcetagData:[],
        resourcetagchecks:[],
        tagcurrentPage:1,
        tagtotal:0,
        tagpageSize:10,
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
    },
    //电路授权
    resourcedevDatas:function(){
      return this.resourcedevData.slice((this.circuitcurrentPage-1) * this.circuitpageSize, this.circuitcurrentPage*this.circuitpageSize)
    },
    //电路授权
    resourcecircuitDatas:function(){
      return this.resourcecircuitData.slice((this.circuitcurrentPage-1) * this.circuitpageSize, this.circuitcurrentPage*this.circuitpageSize)
    }
  },
  methods: {
    //获取用户已有权限
    getUserresource(){
      var that=this
      var netUserid=this.netUserid
      var url=recheck.urlCom+'/api/system/user/getAuthList/'+netUserid
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
      var arr=[]
      for(var i=0;i<data.length;i++){
        var json={
          "nodeCode":data[i]['nodeCode'],
          "resType":data[i]['resType'],
          "res":data[i]['resid'],
        }
        arr.push(json)
      }
      var params={
        "netUserid":netUserid,
        "authType":"CFG",
        "authList":arr
      }
      var url=recheck.urlCom+'/api/system/user/configAuth/'+this.createnetUserid
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
    //设置选中
    setCheck(){
      var nodesdata=this.$refs.nodestree
      var result=nodesdata.getCheckedNodes()
      var arr=[]
      for(var j=0;j<result.length;j++){
        var json={
          nodeCode: result[j]['nodeCode'],
          nodeName: result[j]['nodeName'],
          selectFlag: result[j]['selectFlag'],
        }
        arr.push(json)
      }
      this.resourceJson.nodes=arr
      var data0=this.$refs.tree
      for(var i=0;i<data0.length;i++){
        var result=data0[i].getCheckedNodes()
        var arr=[]
        for(var j=0;j<result.length;j++){
          if(result[j]['resTypeName']){
            var resTypeName=result[j]['resTypeName']
            var resTypeid=result[j]['resTypeid']
          }else if(result[j]['propName']){
            var resTypeName=result[j]['propName']
            var resTypeid=result[j]['propCode']
          }else if(result[j]['vendorName']){
            var resTypeName=result[j]['vendorName']
            var resTypeid=result[j]['vendor']
          }
          var json={
            resTypeName: resTypeName,
            resTypeid: resTypeid
          }
          arr.push(json)
        } 
        var resTypeid=''
        if(data0[i].data[0]['resTypeName']){
          var resTypeid=data0[i].data[0]['resTypeid']
        }else if(data0[i].data[0]['propName']){
          var resTypeid=data0[i].data[0]['propCode']
        }else if(data0[i].data[0]['vendorName']){
          var resTypeid=data0[i].data[0]['vendor']
        } 

        this.resourceJson[data0[i]['data'][0]['type']][resTypeid]={
          'arr':arr,
          'resClassName':data0[i].data[0]['resClassName'],
          'resClassid':data0[i].data[0]['resClassid']
        }      
      }

      //按照设备
      var data1=this.resourcedevchecks
      var arr1=[]
      for(var i=0;i<data1.length;i++){
        var json={
          resTypeName: data1[i]['deviceName'],
          resTypeid:data1[i]['deviceId'],
        }
        arr1.push(json)
      }
      var json1={
        'arr':arr1,
        'resClassid':this.devtype.value,
        'resClassName':this.devtype.label
      }
      this.resourceJson.resourcedev['dev']=json1
      //按照电路
      var data2=this.resourcecircuitchecks
      var arr2=[]
      for(var i=0;i<data2.length;i++){
        var json={
          resTypeName: data2[i]['circuitName'],
          resTypeid:data2[i]['circuitID'],
        }
        arr2.push(json)
      }
      var json2={
        'arr':arr2,
        'resClassid':this.circuittype.value,
        'resClassName':this.circuittype.label
      }
      this.resourceJson.resourcecircuit['circuit']=json2
      //按照TAG
      var data3=this.resourcetagchecks
      var arr3=[]
      for(var i=0;i<data3.length;i++){
        var json={
          resTypeName: data3[i]['tagDesc'],
          resTypeid:data3[i]['tag'],
        }
        arr3.push(json)
      }
      var json3={
        'arr':arr3,
        'resClassid':'TAG',
        'resClassName':'TAG'
      }
      this.resourceJson.resourcetag['tag']=json3

      // if(this.activeName==='resourcetype'||this.activeName==='resourceattr'||this.activeName==='resourcevendor'){
      //   for(var i=0;i<data.length;i++){
      //     var result=data[i].getCheckedNodes()
      //     var arr=[]
      //     for(var j=0;j<result.length;j++){
      //       if(result[j]['resTypeName']){
      //         var resTypeName=result[j]['resTypeName']
      //         var resTypeid=result[j]['resTypeid']
      //       }else if(result[j]['propName']){
      //         var resTypeName=result[j]['propName']
      //         var resTypeid=result[j]['propCode']
      //       }else if(result[j]['vendorName']){
      //         var resTypeName=result[j]['vendorName']
      //         var resTypeid=result[j]['vendor']
      //       }
      //       var json={
      //         resTypeName: resTypeName,
      //         resTypeid: resTypeid
      //       }
      //       arr.push(json)
      //     }
          
      //     var resTypeid=''
      //     if(data[i].data[0]['resTypeName']){
      //       var resTypeid=data[i].data[0]['resTypeid']
      //     }else if(data[i].data[0]['propName']){
      //       var resTypeid=data[i].data[0]['propCode']
      //     }else if(data[i].data[0]['vendorName']){
      //       var resTypeid=data[i].data[0]['vendor']
      //     } 

      //     this.resourceJson[data[i]['data'][0]['type']][resTypeid]={
      //       'arr':arr,
      //       'resClassName':data[i].data[0]['resClassName'],
      //       'resClassid':data[i].data[0]['resClassid']
      //     }      
      //   }
      // }else if(this.activeName==='resourcedev'){
      //   var data=this.resourcedevchecks
      //   var arr=[]
      //   for(var i=0;i<data.length;i++){
      //     var json={
      //       resTypeName: data[i]['deviceName'],
      //       resTypeid:data[i]['deviceId'],
      //     }
      //     arr.push(json)
      //   }
      //   var json={
      //     'arr':arr,
      //     'resClassid':this.devtype.value,
      //     'resClassName':this.devtype.label
      //   }
      //   this.resourceJson.resourcedev['dev']=json
      // }else if(this.activeName==='resourcecircuit'){
      //   var data=this.resourcecircuitchecks
      //   var arr=[]
      //   for(var i=0;i<data.length;i++){
      //     var json={
      //       resTypeName: data[i]['circuitName'],
      //       resTypeid:data[i]['circuitID'],
      //     }
      //     arr.push(json)
      //   }
      //   var json={
      //     'arr':arr,
      //     'resClassid':this.circuittype.value,
      //     'resClassName':this.circuittype.label
      //   }
      //   this.resourceJson.resourcecircuit['circuit']=json
      // }else if(this.activeName==='resourcetag'){
      //   var data=this.resourcetagchecks
      //   var arr=[]
      //   for(var i=0;i<data.length;i++){
      //     var json={
      //       resTypeName: data[i]['tagDesc'],
      //       resTypeid:data[i]['tag'],
      //     }
      //     arr.push(json)
      //   }
      //   var json={
      //     'arr':arr,
      //     'resClassid':'TAG',
      //     'resClassName':'TAG'
      //   }
      //   this.resourceJson.resourcetag['tag']=json
      // }
      console.log(this.resourceJson)
    },
    //添加到表格中
    setAddTable(){
      this.tableDatainit=[]
      var result=this.resourceJson
      console.log(result)
      console.log(1111111111111111)
      for(var m=0;m<result['nodes'].length;m++){
        if(result['nodes'][m]['selectFlag']==='1'){
          for(var key in result){
            if(key!=='nodes'){
              for(var kk in result[key]){
                for(var i=0;i<result[key][kk]['arr'].length;i++){
                  var item=result[key][kk]['arr'][i]
                  if(key==='resourcedev'){
                    var json={
                      "nodename": result['nodes'][m]['nodeName'],
                      "nodeCode": result['nodes'][m]['nodeCode'],
                      "resclassname": this.resourcet[key],
                      "restypename": result[key][kk]['resClassName'],
                      "res":item['resTypeName'],
                      "resid":item['resTypeid'],
                      "parent1":key,
                      "parent2":result[key][kk]['resClassid'],
                      "resvalue":"",
                      "resType":result[key][kk]['resClassid'],
                    }
                  }else if(key==='resourcecircuit'){
                    var json={
                      "nodename": result['nodes'][m]['nodeName'],
                      "nodeCode": result['nodes'][m]['nodeCode'],
                      "resclassname": this.resourcet[key],
                      "restypename": result[key][kk]['resClassName'],
                      "res":item['resTypeName'],
                      "resid":item['resTypeid'],
                      "parent1":key,
                      "parent2":result[key][kk]['resClassid'],
                      "resvalue":"",
                      "resType":result[key][kk]['resClassid'],
                    }
                  }else if(key==='resourcetag'){
                    var json={
                      "nodename": result['nodes'][m]['nodeName'],
                      "nodeCode": result['nodes'][m]['nodeCode'],
                      "resclassname": this.resourcet[key],
                      "restypename": result[key][kk]['resClassName'],
                      "res":item['resTypeName'],
                      "resid":item['resTypeid'],
                      "parent1":key,
                      "parent2":result[key][kk]['resClassid'],
                      "resvalue":"",
                      "resType":result[key][kk]['resClassid'],
                    }
                  }else if(key==='resourcetype'||key==='resourceattr'||key==='resourcevendor'){
                    var json={
                      "nodename": result['nodes'][m]['nodeName'],
                      "nodeCode": result['nodes'][m]['nodeCode'],
                      "resclassname": this.resourcet[key],
                      "restypename": result[key][kk]['resClassName'],
                      "res":item['resTypeName'],
                      "resid":item['resTypeid'],
                      "parent1":key,
                      "parent2":result[key][kk]['resClassid'],
                      "resvalue":"",
                      "resType":result[key][kk]['resClassid'],
                    }
                  }
                  console.log(json)
                  this.tableDatainit.push(json)
                }
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
      this.tableData.splice(arr2.length)
      for(var i=0;i<arr2.length;i++){
        var json=arr2[i]
        this.$set(this.tableData,i,json)
      }
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
    //切换tab
    handleClick(a,b){
    },
    //获取节点数据
    getNodesData(){
      var url=recheck.urlCom+'/api/system/node/getNodeTree/'+this.netUserid
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        var data=result.data[0]
        this.Nodeslist=[data]
      })
    },
    //按资源类型授权
    getresourcetype(){
      var that=this
      var url=recheck.urlCom+'/api/system/config/getResType'
      axios(url, ({}), ("GET")).then((result1)=>{
        var result=result1.data
        for(var i=0;i<result.data.length;i++){
          var json=result.data[i]
          json['resTypeName']=json['resClassName']
          json['resTypeid']=json['resClassid']
          json['type']='resourcetype'
          that.$set(that.resourcetypeData,i,[json])
        }
        that.resourcetypeEveryWidth=Math.floor(24/result.data.length)
      }) 
    },
    //按资源属性授权
    getresourceattr(){
      var that=this
      var url=recheck.urlCom+'/api/system/config/getResProp'
      axios(url, ({}), ("GET")).then((response)=>{
        var result=response.data
        for(var i=0;i<result.data.length;i++){
          var json=result.data[i]
          json['propCode']=json['resClassid']
          json['propName']=json['resClassName']
          json['type']='resourceattr'
          that.$set(that.resourceattrData,i,[json])
        }
        that.resourceattrEveryWidth=Math.floor(24/result.data.length)
      }) 
    },
    //按厂商授权
    getresourcevendor(){
      var that=this
      var url=recheck.urlCom+'/api/system/config/getVendor'
      axios(url, ({}), ("GET")).then((response)=>{
        var result1=response.data.data
        var versordata=[
          {
            "vendorName": "厂商",
            "vendor": "VENDOR",
            "resClassName":"厂商",
            "resClassid": "VENDOR",
            resTypeList:result1
          }
        ]
        for(var i=0;i<versordata.length;i++){
          var json=versordata[i]
          json['type']='resourcevendor'
          that.$set(that.resourcevendorData,i,[json])
        }
        that.resourcevendorEveryWidth=24
      }) 
    },
    //按设备授权
    getresourcedev(){
      var that=this
      var deviceTypeCode=this.devtype.value
      var netUserid=this.netUserid
      var nodesdata=this.$refs.nodestree.getCheckedNodes()
      var nodeCodes=''
      for(var i=0;i<nodesdata.length;i++){
        nodeCodes=nodeCodes+nodesdata[i]['nodeCode']+';'
      }
      nodeCodes=nodeCodes.substring(0,nodeCodes.length-1)
      if(deviceTypeCode===""){
        this.$message({
          message:'设备属性不能为空！',
          type: 'success'
        });
        return;
      }
      var url=recheck.urlCom+'/api1/api/resource/device/getDevicePageList'
      var params={ 
        "netUserid": 'zyucwh',//netUserid,             
        "nodeCode":'NOD999',//nodeCodes, 
        "deviceTypeCode": deviceTypeCode, 
        "page": { 
                "pageNum": 1, 
                "pageSize": 999 
        }, 
        "detailModelCode": "", 
        "deviceName": "", 
        "devicePropCode": "", 
        "deviceState": "", 
        "endOpenDate": "", 
        "loopAddress": "", 
        "startOpenDate": "", 
        "tag": "", 
        "vendor": "" 
      }
      axios.post(url, params).then((response)=>{
          var result=response.data.data
          if(response.data.tip==='成功'){
            for(var i=0;i<result.records.length;i++){
              var json=result.records[i]
              that.$set(that.resourcedevData,i,json)
            }
          }else{
            this.$message({
              message:response.data.tip,
              type: 'success'
            });
          }
      })
      
    },
    devhandleSizeChange(val){
      this.devpageSize=val
      this.getresourcedev()
    },
    devhandleCurrentChange(val){
      this.devcurrentPage=val
      this.getresourcedev()
    },
    //按电路授权
    getresourcecircuit(){
      var that=this
      var circuitTypeCode=this.circuittype.value
      var netUserid=this.netUserid
      var nodesdata=this.$refs.nodestree.getCheckedNodes()
      var nodeCodes=''
      for(var i=0;i<nodesdata.length;i++){
        nodeCodes=nodeCodes+nodesdata[i]['nodeCode']+';'
      }
      nodeCodes=nodeCodes.substring(0,nodeCodes.length-1)
      var url=recheck.urlCom+'/api1/api/resource/circuit/getCircuitPageList'
      var params={ 
              "netUserid":'zyucwh',//netUserid, 
              "nodeCode":'NOD999',// nodeCodes,
              "circuitTypeCode":circuitTypeCode, 
              "cirPropCode": "", 
              "circuitChineseName": "", 
              "circuitDesc": "", 
              "circuitName": "", 
              "deviceName": "", 
              "page": { 
                      "pageNum": this.circuitcurrentPage, 
                      "pageSize": this.circuitpageSize, 
              }, 
              "portDescrDetail": "", 
              "portIp": "", 
              "portName": "", 
              "tag": "", 
              "transCirCode": "", 
              "transTypeCode": "" 
      }
      axios.post(url, params).then((response)=>{
        var result=response.data.data
        if(response.data.tip==='成功'){
          for(var i=0;i<result.records.length;i++){
            var json=result.records[i]
            that.$set(that.resourcecircuitData,i,json)
          }
          that.circuittotal=result.total
        }else{
          this.$message({
            message:response.data.tip,
            type: 'success'
          });
        }
      }) 
    },
    circuithandleSizeChange(val){
      this.circuitpageSize=val
      this.getresourcecircuit()
    },
    circuithandleCurrentChange(val){
      this.circuitcurrentPage=val
      this.getresourcecircuit()
    },
    //按TAG授权
    getresourcetag(){
      var that=this
      var userName=this.resourcetagchooseuser
      var tagTypeDesc=this.resourcetagchoosetype
      var tag=this.resourcetagchoosetag
      var netUserid=this.netUserid
      var url=recheck.urlCom+'/api1/api/resource/tag/getTagPageList'
      var params={ 
        "netUserid":'zyucwh',//netUserid, 
        "page": { 
                "pageNum": 1, 
                "pageSize": 999 
        }, 
        "tag":tag, 
        "tagTypeDesc": tagTypeDesc, 
        "userName": userName 
      }
      axios.post(url,params).then((response)=>{
        var result=response.data.data
        if(response.data.tip==='成功'){
          for(var i=0;i<result.records.length;i++){
            var json=result.records[i]
            that.$set(that.resourcetagData,i,json)
          }
        }else{
          this.$message({
            message:response.data.tip,
            type: 'success'
          });
        }
      })      
    },
    taghandleSizeChange(val){
      this.tagpageSize=val
      this.getresourcetag()
    },
    taghandleCurrentChange(val){
      this.tagcurrentPage=val
      this.getresourcetag()
    },
    //按设备多选
    handleSelectionChangeDev(val){
      this.resourcedevchecks=val
    },
    //按电路多选
    handleSelectionChangeCircuit(val){
      this.resourcecircuitchecks=val
    },
    //按TAG多选
    handleSelectionChangeTag(val){
      this.resourcetagchecks=val
    },
    //表格多选
    handleSelectionChange(val){
      this.tablechecks = val;
    },
  },
  mounted() {
    this.checkHeight=(this.$(window).height()-200)/2
    this.checktableHeight=(this.$(window).height()-200)/2
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
.resource .el-tabs__content{
  height:calc(100% - 50px)
}
.resource .el-tab-pane{
  height:100%
}
.resource .el-tree{
  overflow:auto;

}
.resource .app-tablec{
  height:calc(100% - 70px);
  overflow:auto
}
</style>
