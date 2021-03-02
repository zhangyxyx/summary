<template>
  <div style="width:100%;height:100%;">
     <el-select class="treecheck" v-model="mineStatus" placeholder="请选择" multiple  collapse-tags @change="selectChange">
        <el-option  :value="mineStatusValue" style="height:100% !important">
          <el-tree :data="data" show-checkbox :node-key="Tresslistid" ref="tree" highlight-current :props="defaultProps" @check-change="handleCheckChange"></el-tree>
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props:['Tresslistdata','Tresslistid','Tresslistlabel','Tresslistidckeckinit'],
  data() {
    return {
      mineStatus: "",
      mineStatusValue: [],
      data: [],
      defaultProps: {
        children: "children",
        label:this.Tresslistlabel
      }
    };
  },
  watch:{
    Tresslistdata:function(){
      this.data=[this.Tresslistdata]
    },
    Tresslistidckeckinit:{
      handler:function(){
        var arr=this.Tresslistidckeckinit['name'].split(';')
        this.mineStatus=arr
        var codes=this.Tresslistidckeckinit['code'].split(';')
        var arr2=[]
        for(var i=0;i<codes.length;i++){
          var node=this.$refs.tree.getNode(codes[i])
          arr2.push(node.data)
          this.mineStatusValue.push(node.data)
        }
        this.mineStatusValue.splice(arr2.length)
        for(var i=0;i<arr2.length;i++){
          this.$set(this.mineStatusValue,i,arr2[i])
        }
        this.$refs.tree.setCheckedNodes(this.mineStatusValue)
      },
      deep:true
    },
  },
  methods: {
    selectChange(e){
        var arrNew = [];
          var dataLength = this.mineStatusValue.length;
          var eleng = e.length;
          for(let i = 0; i< dataLength ;i++){
            for(let j = 0; j < eleng; j++){
              if(e[j] === this.mineStatusValue[i][this.Tresslistlabel]){
                arrNew.push(this.mineStatusValue[i])
              }
            }
          }
          this.$refs.tree.setCheckedNodes(arrNew);//设置勾选的值
    },
    handleCheckChange() {
        let res = this.$refs.tree.getCheckedNodes(true, true); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
        let arrLabel = [];
        let arr = [];
        let arrid=[];
        res.forEach(item => {
          arrLabel.push(item[this.Tresslistlabel]);
          arrid.push(item[this.Tresslistid]);
          arr.push(item);
        });
        this.mineStatusValue = arr;
        this.mineStatus = arrLabel;
        this.$emit('Tresslistidckeck',arrid)
    },
  },
  mounted(){
  }
}
</script>
<style scoped>
.el-select-dropdown__item.hover{
  background:#fff;
}
.el-tree{
  border:1px solid #fff;
}
.el-select{
  width:100%
}
.el-select-dropdown{
  height:400px !important
}
.el-scrollbar{
  height:400px;
}
.el-select-dropdown__list{
  height:100%
}
.el-select-dropdown__item{
  height:100%
}
</style>