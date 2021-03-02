<template>
  <div class="app-container">
    <el-form inline class="app-form app-form-shadow" >
      <el-row class="row-1 checkItemselect">
        <el-col :span="6">
          <el-form-item label="限制类型">
              <el-select v-model="limittype" placeholder="请选择">
                <el-option
                  v-for="item in limittypedata"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> 
            </el-form-item>
        </el-col>  
      </el-row>
      <el-row class="row-1 checkItemselect">
        <el-col :span="2">
          <el-form-item label="" style="text-align:right">
           <el-radio v-model="iptype" label="" @change="radiotype('iptype')"></el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="起始IP">
            <el-input v-model="startip" placeholder="请输入内容" :disabled="startipdis"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="终止IP">
            <el-input v-model="endip" placeholder="请输入内容" :disabled="endipdis"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-1 checkItemselect">
        <el-col :span="2">
          <el-form-item label="" style="text-align:right">
           <el-radio v-model="addresstype" label="" @change="radiotype('addresstype')"></el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="子网地址">
            <el-input v-model="subnetaddress" placeholder="请输入内容" :disabled="subnetaddressdis"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="掩码位数">
            <el-row>
              <el-col :span="4">
                <el-select v-model="maskbitschoose" placeholder="请选择" :disabled="maskbitsdis" @change="selectchange">
                  <el-option
                    v-for="item in maskbitschoosedata"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="20">
                <el-input v-model="maskbits" placeholder="请输入内容" :disabled="maskbitsdis"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row class="row-1 checkItemselect">
        <el-col :span="24" style="text-align:right">
          <el-form-item label="">
                <el-button type="primary"  v-on:click="addIp()">增加</el-button>
                <el-button type="primary"  v-on:click="removeloaginaddress()">删除</el-button>
                <el-button type="primary"  v-on:click="addLoginaddress()">确定</el-button>
          </el-form-item>
        </el-col>
        
      </el-row>
    </el-form>
    <el-table  
      :data="tableData.slice((currentPage-1) * pageSize, currentPage*pageSize)"
      stripe
      border
      :height="tableheight" 
      header-cell-class-name="headercell"
      cell-class-name="cellclazz"
      class="app-table tb-edit"
      @selection-change="handleSelectionChange"


    >    
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="限制类型" prop="action" title="限制类型" align="center" >
        <template slot-scope="scope">
            <el-select v-show="scope.row.edit===1" v-model="scope.row.action" placeholder="请选择">
              <el-option 
                v-for="item in limittypedata"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> 
            <div v-show="scope.row.edit===0">
              <p v-if="scope.row.action==='Allow'">允许登录</p>
              <p v-if="scope.row.action==='Deny'">拒绝登录</p> 
            </div>
        </template>
      </el-table-column>
      <el-table-column label="起始IP" prop="startIp" title="起始IP" align="center" >
        <template scope="scope">
              <el-input v-show="scope.row.edit===1" v-model="scope.row.startIp" placeholder="请输入"></el-input>
              <span v-show="scope.row.edit===0">{{scope.row.startIp}}</span>
        </template>
      </el-table-column>
      <el-table-column label="终止IP" prop="endIp" title="终止IP" align="center" >
        <template scope="scope">
              <el-input v-show="scope.row.edit===1" v-model="scope.row.endIp" placeholder="请输入"></el-input>
              <span v-show="scope.row.edit===0">{{scope.row.endIp}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opt" label="操作"  align="center">
          <template slot-scope="scope">
              <el-button    type="primary" v-show="editsavebtn===0" @click="handleEdit(scope.$index, scope.row)"
              size="mini">修改</el-button>
              <el-button    type="primary" v-show="editsavebtn===1" @click="handleSave(scope.$index, scope.row)"
               size="mini">保存</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" 
        :current-page="currentPage" :page-sizes="[15,20,30,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"  :total="total"
        class="el-row pagination-container-right" style="float:right">
    </el-pagination>
  </div>
</template>
<script>
import axios from 'axios'
import recheck from '@/components/common/recheck.js'
export default {
  name: 'userloginaddr',
  components: {  },
  data() {
    return {
      createnetUserid:'admin',
      netUserid:'',
      //限制类型
      limittype:'Allow',
      limittypedata:[
        {value:'Allow',label:'允许登陆'},
        {value:'Deny',label:'拒绝登陆'},
      ],
      iptype:'',
      addresstype:'1',
      startip:'',
      endip:'',
      startipdis:false,
      endipdis:false,
      subnetaddress:'',


      //掩码位数
      maskbitschoose:'',
      maskbitschoosedata:[
        {value:'1',label:'1'},
        {value:'2',label:'2'},
        {value:'3',label:'3'},
        {value:'4',label:'4'},
        {value:'5',label:'5'},
        {value:'6',label:'6'},
        {value:'7',label:'7'},
        {value:'8',label:'8'},
        {value:'9',label:'9'},
        {value:'10',label:'10'},
        {value:'11',label:'11'},
        {value:'12',label:'12'},
        {value:'13',label:'13'},
        {value:'14',label:'14'},
        {value:'15',label:'15'},
        {value:'16',label:'16'},
        {value:'17',label:'17'},
        {value:'18',label:'18'},
        {value:'19',label:'19'},
        {value:'20',label:'20'},
        {value:'21',label:'21'},
        {value:'22',label:'22'},
        {value:'23',label:'23'},
        {value:'24',label:'24'},
        {value:'25',label:'25'},
        {value:'26',label:'26'},
        {value:'27',label:'27'},
        {value:'28',label:'28'},
        {value:'29',label:'29'},
        {value:'30',label:'30'},
        {value:'31',label:'31'},
        {value:'32',label:'32'},
      ],
      maskbits:'',
      subnetaddressdis:true,
      maskbitsdis:true,
      //表格
      addrAcl:[],
      clickcheck:[],
      tableData:[],
      pageSize:15,
      currentPage:1,
      tableheight:200,
      total:0,
      editsavebtn:0,
    }
  },
  methods:{
    radiotype(val){
      if(val==='iptype'){
        this.iptype=''
        this.addresstype='1'
        this.startipdis=false
        this.endipdis=false
        this.subnetaddressdis=true
        this.maskbitsdis=true   
      }else if(val==='addresstype'){
        this.iptype='1'
        this.addresstype=''
         this.startipdis=true
        this.endipdis=true
        this.subnetaddressdis=false
        this.maskbitsdis=false   
      }
    },
    handleSelectionChange(val){
      this.clickcheck=val
    },
    handleEdit(index, row) {
      this.editsavebtn=1
      row.edit = 1;
    },
    handleSave(index, row) {
      var reg=/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      if(reg.test(row.startIp)&&reg.test(row.endIp)){
        this.editsavebtn=0
        row.edit = 0;     
      }else{
        this.$message({
          message: '起始IP或者终止IP格式不对',
          type: 'success'
        });
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
    },
    handleCurrentChange(page) {
      this.currentPage = page
    },
    //掩码位数事件
    selectchange(){
      var strBitNumber=this.maskbitschoose
      var bstring="";
      var strAddr="";
      var intBitNumber=parseInt(strBitNumber,10);
      for (var i=0;i<intBitNumber;i++)	bstring+="1";
      for (var i=intBitNumber;i<32;i++)	bstring+="0";
      var seg1 = parseInt(bstring.substring(0,8),2);
      var seg2 = parseInt(bstring.substring(8,16),2);
      var seg3 = parseInt(bstring.substring(16,24),2);
      var seg4 = parseInt(bstring.substring(24,32),2);
      strAddr = strAddr+seg1+"."+seg2+"."+seg3+"."+seg4;
      this.maskbits=strAddr
    },
    //获取登陆地址列表
    getloginaddresslist(){
      var that=this
      var url=api
      axios(url, ({}), ("get")).then((response)=>{
          var result=response.data
          var data=result.data
          that.tableData.splice(data.length)
          for(var i=0;i<data.length;i++){
            console.log(data[i])
            data[i]['edit']=0
            that.$set(that.tableData,i,data[i])
          }
      })
    },
    //增加
    addIp(){
      var startip=''
      var endip=''
      if(this.iptype===''){
        startip=this.startip
        endip=this.endip
      }else if(this.addresstype===''){
        startip=this.subnetaddress
        endip=this.maskbits
      }
      var reg=/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/
      if(reg.test(startip)&&reg.test(endip)){
        var prio=this.tableData.length===0?0:this.tableData[this.tableData.length-1]['prio']
        var json={
          "prio":prio+1,
          "action":this.limittype,
          "startIp":startip,
          "endIp":endip,
          "edit":0
        }
        this.tableData.push(json)
        this.total=this.tableData.length
      }else{
        this.$message({
          message: '起始IP或者终止IP格式不对',
          type: 'success'
        });
      }

    },
    //删除
    removeloaginaddress(){
      var clickcheck=this.clickcheck
      for(var i=0;i<clickcheck.length;i++){
        for(var j=0;j<this.tableData.length;j++){
          if(clickcheck[i]['prio']===this.tableData[j]['prio']){
            this.tableData.splice(j,1)
          }
        }
      }
      console.log(this.tableData)
    },
    //保存
    addLoginaddress(){
 
      var params={
        netUserid:this.netUserid,
        addrAcl:this.tableData
      }
      var url=api
      axios.post(url, params).then((response)=>{
        var result=response.data
          if(result.tip==='成功'){
            this.$message({
              message: '地址提交成功！',
              type: 'success'
            });
          }
      })
    }
  },
  mounted(){
    this.netUserid=window.location.search.split('=')[1]
    this.getloginaddresslist()
  },
}
</script>
<style lang="scss" scoped>

</style>

