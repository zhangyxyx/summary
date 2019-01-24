<template>
  <div class="row">
    <div class="col-xs-10">
      <div class="row">
        <div class="col-xs-5 col-xs-offset-1" v-for="(page,index) in pages" style="margin-bottom:20px;height:200px;position:relative;cursor:pointer">
            <img :src="page.photo" style="height:100%;position:absolute;left:0px;">
            <div style="width:100%;height:200px;background:rgba(0,0,0,.5);position:absolute;left:0px;z-index:2"></div>
            <div style="position:absolute;bottom:0px;left:20px;z-index:3;color:#fff;width:100%">
              <p style="font-size:20px;">{{page.title}}</p>
              <div style="font-size:12px;">
                <p style="float:left">{{page.article}}</p>
                <p style="float:left;margin:0px 10px">|</p>
                <p style="floaT:left;">{{page.follow}}篇文章</p>
              </div>
             
            </div>
            
        </div>
      </div>
    </div>
    <div class="col-xs-2">
      <ul class="list-group">
          <li class="list-group-item"><img src="../assets/new-list.png" style="width:40px;height:40px;">下载APP</li>
          <li class="list-group-item"><img src="../assets/new-list.png" style="width:40px;height:40px;">下载APP</li>
          <li class="list-group-item"><img src="../assets/new-list.png" style="width:40px;height:40px;">下载APP</li>
          <li class="list-group-item"><img src="../assets/new-list.png" style="width:40px;height:40px;">下载APP</li>
          <li class="list-group-item"><img src="../assets/new-list.png" style="width:40px;height:40px;">下载APP</li>
      </ul>
       
    </div>
</div>
</template>
<script>
export default({
  computed:{
    pages() {
      return this.$store.state.newlist
    }
  }
})
</script>