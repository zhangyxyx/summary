<template>
	<div class="panel panel-default">
		<div class="panel-heading">
			<h1 class="text-center">已有时长</h1>
		</div>
		
		<div class="panel-body">
			<h1 class="text-center">{{time}}小时</h1>
		</div>
		<div class="logo">
			<img src="../assets/img.png">
		</div>
	</div>
</template>

<script>
export default{
	computed:{
		time(){
			return this.$store.state.totalTime
		}
	}
}
</script>

<style>
.logo{text-align:center;}
.logo img{width:100px;height:100px;margin:0 auto;border:1px solid #ccc;border-radius:50%;}
</style>