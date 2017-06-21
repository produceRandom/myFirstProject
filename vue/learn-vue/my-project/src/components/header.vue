<template>
	<div id="header">
		<div class="header-logo">
			
		</div>
		<div class="header-nav">
			<div  class="header-nav-list" v-for = "item in headerNavList" v-on:click="nav_list_selected(item)">
				<img v-bind:src="item.img_url" /> 
				<p class="header-nav-list-title">{{item.title}}</p>
			</div>
		</div>
		<div class="header-contact">
			<div class="header-contact-flex-container">
				<div class="header-contact-left">
					<img src="../../static/img/头像.png" />
					<p>管理员</p>
				</div>
				<div class="header-contact-right">
					<div class="header-contact-right-top">
						<p><img src="../../static/img/41QQ群.png" />加入QQ群</p>
					</div>
					<div class="header-contact-right-bottom">
						<p><img src="../../static/img/qq.png" />联系客服</p>
					</div>
				</div>
			</div>
			
		</div>
	</div>
</template>

<script>
	import axios from "axios"
	import headerData from  "../data/header_data.js"
	export default {
	  	name: 'header',
		data(){
			return {
				headerNavList:[]
			}
		},
		mounted:function(){
			this.headerList()

		},
		methods:{
			headerList:function(){
			    this.headerNavList = headerData.headerList;
			    this.headerNavList.forEach(function(item,index){
		    		item.img_url = item.img_src
		    	})
			},
			
			nav_list_selected:function(item){
				
			    this.headerNavList.forEach(function(item,index){
			    	item.img_url = item.img_src
				    })
				item.img_url = item.img_src_active
				
				this.headerNavList.reverse().reverse()
				
			}
//ajax获取			
//			headerList:function(){
//				var _this = this
//				axios.get('../data/header.json')
//				  .then(function (response) {
//				    _this.headerNavList = response.data.headerList
//				    _this.headerNavList.forEach(function(item,index){
//				    	item.img_url = item.img_src
//				    })
//				    
//				})
//			},
//			nav_list_selected:function(item){
//			    this.headerNavList.forEach(function(item,index){
//			    	item.img_url = item.img_src
//			    })
//				item.img_url = item.img_src_active
//				
//				
//				this.headerNavList.reverse().reverse()
//			}
		},
		watch:{
			
		},
		computed:{
	
		}
	}
</script>

<style>
	@import url("../style/css/reset.css");
	@import url("../style/css/header.css");
</style>