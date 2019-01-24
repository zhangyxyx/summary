<template>
<div class="col-sm-12" style="background:#fff;border:1px solid #ccc">
		<span>前端</span>
		<span>更多</span>
		<ul style="padding:0px;">
			<li v-for="(list,index) in lists" class="list-group-item" style="height:72px;">
				<div class="left" style="width:60px;height:60px;float:left">
				   <img :src="list.img" style="height:90%;"/>
				</div>
				<div class="right" style="float:left;">
					<div><h5>{{list.title}}</h5></div>
					<div class="row">
						<div class="col-sm-3"><span class="glyphicon glyphicon-heart"></span>{{list.like}}</div>
						<div class="col-sm-6">{{list.user}}</div>
						<div class="col-sm-3">{{list.time}}</div>
					</div>
				</div>
			</li>
		</ul>
</div>
</template>
<script>
export default({
	computed:{
		lists() {
			return this.$store.state.home
		}
	}
})
</script>