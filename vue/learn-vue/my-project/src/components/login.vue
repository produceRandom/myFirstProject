<template>
	<div class="login">
		<span>用户名</span>
		<input v-model="username" @change="serUser" />
		<button @click="setUser">确认</button>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				username:""
			}
		},
		methods:{
			setUser(){
				
				this.$emit("transferUser",this.username)
			}
		}
	}
</script>

<style>
	.login{
		text-align: center;
		line-height: 2em;
	}
</style>