<template>
  <div class="bgscreen" :style="{background:screendata.main.bg,backgroundSize:screendata.main.bgSize}">
    <el-container style="height:100%">
      <el-header class="bgscreenheader" :style="{height:screendata.header.headerheight-screendata.header.headermagin+'px',marginBottom:screendata.header.headermagin+'px'}">
        <Header/>
      </el-header>
      <el-header v-if="screendata.target.targetdisplay==='显示'" :style="{height:screendata.target.targetheight-screendata.target.targetmagin+'px',marginBottom:screendata.target.targetmagin+'px'}">
        <Target/>
      </el-header>
      <el-container class="main" :style="{height:mainHeight+'px'}">
        <el-aside width="300px" v-if="screendata.left.leftdisplay==='显示'"><Left/></el-aside>
        <el-main><Center/></el-main>
        <el-aside width="300px" v-if="screendata.right.rightdisplay==='显示'"><Right/></el-aside>
      </el-container>
      <el-footer v-if="screendata.footer.footerdisplay==='显示'" :style="{height:screendata.footer.footerheight+'px'}">
        <Footer/>
      </el-footer>
    </el-container>
  </div>
</template>
<script>

import Header from './components/header.vue'
import Left from './components/left.vue'
import Right from './components/right.vue'
import Footer from './components/footer.vue'
import Center from './components/center.vue'
import Target from './components/target.vue'

export default {
  name: 'bgscreenshow',
  components:{
    Header:Header,
    Left:Left,
    Right:Right,
    Footer:Footer,
    Center:Center,
    Target:Target
  },
  data() {
   return{
     mainHeight:500,
     screendata:{},
     screendata1:{
        main:{
          bg:'url('+require('assets/img/bg.png')+') no-repeat',
          bgSize:"100% 100%"
        },
        header:{
          color:'#fff',
          fontSize:'20',
          headerheight:60,
          headermagin:10,
          headerbg:'url('+require('assets/img/header.png')+') no-repeat'
        },
        left:{
          color:'#fff',
          fontSize:'15',
          leftbg:'url('+require('assets/img/left.png')+') no-repeat',
          leftdata:[
              {name:'左边标题1',type:'line',id:'one',leftlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[10, 20, 36, 10, 10, 20]
              }},
              {name:'左边标题2',type:'bar',id:'two',leftlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[5, 20, 36, 10, 10, 20]
              }},
          ]
        },
        center:{
          type:'map'
        },
        right:{
          color:'#fff',
          fontSize:'15',
          footermargin:"10px 0px",
          rightbg:'url('+require('assets/img/left.png')+') no-repeat',
          rightdata:[
              {name:'右边标题1',type:'bar',id:'one',rightlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[10, 20, 36, 10, 10, 20]
              }},
              {name:'右边标题2',type:'line',id:'two',rightlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[5, 20, 36, 10, 10, 20]
              }},
          ]
        },
        footer:{
          color:'#fff',
          fontSize:'15',
          footerheight:200,
          footerbg:'url('+require('assets/img/left.png')+') no-repeat',
          footerdata:[
              {name:'右边标题1',type:'bar',id:'one',footerlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[10, 20, 36, 10, 10, 20]
              }},
              {name:'右边标题2',type:'line',id:'two',footerlinedata:{
                xAxisdata:["1月","2月","3月","4月","5月","6月"],
                seriesdata:[5, 20, 36, 10, 10, 20]
              }},
          ]
        }
     }
   }
  },
  methods:{
  },
  mounted(){
    
    this.mainHeight=this.$(window).height()-this.screendata.footer.footerheight-this.screendata.header.headerheight-this.screendata.target.targetheight
    this.Bus.$emit('renderHeader',this.screendata.header)
    this.Bus.$emit('renderLeft',this.screendata.left)
    this.Bus.$emit('renderRight',this.screendata.right)
    this.Bus.$emit('renderCenter',this.screendata.center)
    this.Bus.$emit('renderFooter',this.screendata.footer)
    this.Bus.$emit('renderTarget',this.screendata.target)

  },
  beforeMount(){
    this.screendata=JSON.parse(this.$.cookie('screendata'));
    console.log(this.screendata)
  }

}
</script>
<style >
.bgscreen{
  height:100%;
  background-size:100% 100%;
}
.bgscreen .bgscreenheader{
  padding:0px
}
.main{
  padding:0px 20px
}
.el-footer{
  padding:20px
}
</style>

