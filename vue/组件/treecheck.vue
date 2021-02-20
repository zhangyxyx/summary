<template>
  <div style="width:100%;height:100%;">
     <el-select class="treecheck" v-model="mineStatus" placeholder="请选择" multiple  @change="selectChange">
        <el-option  :value="mineStatusValue" style="height:100% !important">
          <el-tree :data="data" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps" @check-change="handleCheckChange"></el-tree>
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mineStatus: "",
      mineStatusValue: [],
      data: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1"
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    //select框值改变时候触发的事件
    selectChange(e){
        var arrNew = [];
          var dataLength = this.mineStatusValue.length;
          var eleng = e.length;
          for(let i = 0; i< dataLength ;i++){
            for(let j = 0; j < eleng; j++){
              if(e[j] === this.mineStatusValue[i].label){
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
        res.forEach(item => {
          arrLabel.push(item.label);
          arr.push(item);
        });
        this.mineStatusValue = arr;
        this.mineStatus = arrLabel;
        console.log('arr:'+JSON.stringify(arr))
        console.log('arrLabel:'+arrLabel)
      }
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