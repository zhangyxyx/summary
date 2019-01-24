<template>
  <div>
  	{{msg}}
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default{
	data(){
	return {}
	},
	computed:{
		...mapGetters(['msg'])
	}
} 
</script>
















