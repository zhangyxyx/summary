<template>
<div class="row">
	<div class="col-sm-2 home-left" style="overflow:auto">
		<div class="row myhome-left">
			<div class="col-sm-12 myhome-left-active"><span class="glyphicon glyphicon-home"></span>推荐</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-headphones"></span>Android</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-list-alt"></span>前端</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-globe"></span>IOS</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-scale"></span>后端</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-pencil"></span>设计</div>
			<div class="col-sm-12"><span class="glyphicon glyphicon-user"></span>产品</div>
		</div>
	</div>
	<div class="home-con col-sm-7" >
		<div style="overflow:auto"><jingxuan></jingxuan></div>
		<div style="margin-top:20px;;overflow:auto"><android></android></div>
		<div style="margin-top:20px;;overflow:auto"><webjs></webjs></div>
		<div style="margin-top:20px;;overflow:auto"><ios></ios></div>
		<div style="margin-top:20px;;overflow:auto"><hou></hou></div>
	</div>
	<div class="col-sm-3" style="border:1px solid #ccc;overflow:auto">
		<span style="height:40px;line-height:40px;display:block;">关注这些标签下的优质文章</span>
		<div class="row">
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>Github</div>
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>设计模式</div>
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>工具资源</div>
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>黑科技</div>
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>教程</div>
			<div class="col-sm-6" style="height:30px;line-height:30px;"><span class="glyphicon glyphicon-plus"></span>JavaScript</div>
		</div>
	</div>
</div>
</template>

<script>
import jx from "./homecomponent/jingxuan.vue";
import ad from "./homecomponent/android.vue"
import webjs from "./homecomponent/webjs.vue"
import ios from "./homecomponent/ios.vue"
import hou from "./homecomponent/hou.vue"
import $ from "jquery"

$(function(){
	alert(1);
})
export default({
	components:{
		'jingxuan':jx,
		"android":ad,
		"webjs":webjs,
		"ios":ios,
		"hou":hou
	}
})
</script>
<style>
.home-left .col-sm-12{height:40px;line-height:40px;font-size:19px;}
.home-left .col-sm-12 span{margin-right:20px;}
.myhome-left div{cursor:pointer;}
.myhome-left div:hover{background:#ede9e9}
.myhome-left div.myhome-left-active{background:#ede9e9}
</style>


