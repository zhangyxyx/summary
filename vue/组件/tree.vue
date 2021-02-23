
<template>
  <div class="treera" style="width:100%">
    <el-input v-model="areaname" @click.stop.native="changetree" placeholder="请选择" v-clickoutside="cehandleClose"></el-input>
    <el-tree
        :data="nodedata"
        :node-key="this.Tresslistid"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @current-change="getCheckedNodes"
       
        :expand-on-click-node="expandclick"
        v-show="showhide">
    </el-tree>
  </div>
</template>
<script>
const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
  }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
 }
     // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'userlist',
  components: { Treeselect },
  props:['Tresslistdata','Tresslistid','Tresslistlabel'],
  data() {
    return {
      //节点位置
      data:'',
      nodedata: [],
      expandclick:false,
      showhide:false,
      alarmnweizhi:'',
      areanode:'NOD999',
      areaname:'全国',
      defaultProps: {
        children: 'children',
        label: this.Tresslistlabel
      },

    }
  },
  watch:{
    Tresslistdata:function(){
      console.log(111111111111)
      this.data=this.Tresslistdata
      console.log(this.data)
      this.getNodetree()
    }
  },
  directives: {clickoutside},
  methods: {
    getNodetree(){
      var that=this
      // var data={
      //   id: "NOD999",
      //   state: "closed",
      //   text: "全国",
      //   children: [
      //     {
      //       children:[],
      //       id: "NOD385",
      //       state: "closed",
      //       text: "集团",
      //     }
      //   ]
      // }
      
      var data=this.data
      console.log(data)
      this.nodedata = []
      this.nodedata.push(data)
      if(data.text==='全国'){
        that.areaname=data.children[0][this.Tresslistlabel]
        that.areanode=data.children[0][this.Tresslistid]
        
      }else{
        that.areaname=data[this.Tresslistlabel]
        that.areanode=data[this.Tresslistid]
      } 
    },
    getCheckedNodes(a,b,c){
      this.areanode=a[this.Tresslistid]
      this.areaname=a[this.Tresslistlabel]
      this.showhide=false
    },
    cehandleClose(){
      this.showhide=false
    },
    changetree(){
      this.showhide=true
    },
  },
  mounted(){
    this.getNodetree()
  },
}
</script>
<style scoped>
.el-select-dropdown__item.hover{
  background:#fff;
}
.el-tree{
  border:1px solid #ccc;
}
</style>
<style>
.app-container .treera .el-tree{
  z-index: 22;
  position: absolute;
  width: 100%;
  height: 300px;
  overflow: auto;
  left: 0px;
  border: 1px solid #ddd;
}
</style>

