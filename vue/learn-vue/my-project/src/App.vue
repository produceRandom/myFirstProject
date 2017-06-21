<template>
  <div id="app">
  	<header-vue></header-vue>
    <!--<img src="./assets/logo.png">
    
    <hello-a></hello-a>-->
    <router-link to="./hello" class="router-link">
    	
    	跳到hello页面
    	
    </router-link>

    <router-link to="./helloa" class="router-link">
    	
    	跳到helloA页面
    	
    </router-link>
    <router-view class="router-view" msgfromapp="this is helloA page , but the infomation is from app page"></router-view>
		<div class="login">
			<login @transferUser="getUser"></login>	
			<p>用户名为：{{user}}</p>
		</div>
		
  </div>
</template>

<script>
import HelloA from "./components/HelloA"
import HeaderVue from "./components/header"
import login from "./components/login"
export default {
  name: 'app',
  data(){
  	return{
  		isfalse:false,
  		user:""
  	}
  },
  components:{HelloA,HeaderVue,login},
  methods:{
  	changeRouterState:function(){
  		
  	},
  	getUser(username){
  		this.user = username
  	}
  }
}
</script>

<style>
	@import url("app.css");
	.router-link{
		text-decoration: none;
		display: block;
		text-align: center;
		color: black;
		line-height: 2.5em;
	}
	.router-link-active{
		color: red !important;
	}
	.router-view{
		display: block;
		text-align: center;
		line-height: 2em;
	}
	.login
	{text-align: center;}
</style>
