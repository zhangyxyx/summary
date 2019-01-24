<template>
<div class="mylabel">
	<span style="display:block;width:80px;text-align:center;height:40px;border-bottom:1px solid blue;">全部标签</span>
	<div class="mylabel-header">
		<span v-for="(option,index) in options" v-on:click="change(option.change,index)" :class="option.current==true?'current':''">{{option.text}}</span>
	</div>
	<div class="row">
		<div class="col-md-3" v-for="list in lists">
			<div class="myevery">
			<img :src="list.photo" style="height:30px;">
			<span style="width:100%;display:block;">{{list.title}}</span>
			<div style="margin:10px 0px;">
				<span>{{list.follow}}关注</span>
				<span>{{list.article}}文章</span>
			</div>
			<span style="width:60px;height:31px;display:block;border:1px solid #37c700;line-height:30px;margin:0 auto;color:#37c700">关注</span>
			</div>
		</div>
	</div>
</div>
</template>
<script>
export default({
	data(){
		return {
			lists:this.$store.state.labelheat,
			options:[
				{change:'labelheat',text:'最热',current:true},
				{change:'labelnew',text:'最新',current:false},
			]
		}
	},
	
	methods: {
		change(mark,index){
			this.lists= this.$store.state[mark];
			for(let i=0,len=this.options.length;i<len;i++){
				this.options[i].current=false;
			}
			this.options[index].current=true;
	    },
	}
})
</script>
<style>
.mylabel .myevery{text-align:center;padding:10px 0px;border:1px solid #ccc;margin:10px 0px;}
.mylabel .myevery:hover{border:1px solid #37c700}
.mylabel-header{height:30px;margin-top:30px;}
.mylabel-header span{margin:20px 10px;cursor:pointer;}
.current{color:blue};
</style>
