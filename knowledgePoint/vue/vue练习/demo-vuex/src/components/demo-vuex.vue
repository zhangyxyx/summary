<template>
	<div>
		{{name}}
		<button @click="fun">点击改变msg</button>
		</br>
		msg:{{msg}}
	</div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default{
	data(){
		return {
			name:'demo-vuex'
		}
	},
	computed:{
	...mapGetters(['msg'])
	},
	methods:{
	...mapActions(['fun'])
	}
}
</script>















