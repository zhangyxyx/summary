<template>
	<div id="demo" >
	  		<span class="glyphicon glyphicon-menu-hamburger" v-on:click="show=!show"></span>
	  		<transition name="fade">
	  			<ul v-if="show" class="list-group">
					  <li class="list-group-item">Cras justo odio</li>
					  <li class="list-group-item">Dapibus ac facilisis in</li>
					  <li class="list-group-item">Morbi leo risus</li>
					  <li class="list-group-item">Porta ac consectetur ac</li>
					  <li class="list-group-item">Vestibulum at eros</li>
					</ul>
	  		</transition>
  </div>
</template>
<script>
export default {
	data(){
		return{
			show:false
		}
	}
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
#demo span{font-size:20px;}
</style>