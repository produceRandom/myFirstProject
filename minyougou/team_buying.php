<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>团购</title>
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/attribute.css" />
	</head>
	<style>

		.p-lr-185{
			padding-left:0.963rem;
			padding-right: 0.963rem;
		}
		.p-lr-170{
			padding-left:0.885rem;
			padding-right: 0.885rem;
		}
		.hot-team-bg{
			background: url(img/team_buying/热门团购背景.png) no-repeat;
			background-size: 100% 100%;
		}
		.boutique-team-bg{
			background: url(img/team_buying/精品团购的背景.jpg) no-repeat;
			background-size: 100% 100%;
		}
		.tomorrow-team-bg{
			background: url(img/team_buying/明日推荐的背景.jpg) no-repeat;
			background-size: 100% 100%
		}
		.team-title{
			font-size: 50px;
			height: 1rem;
			position: relative;
		}
		.team-title-font{
			position: absolute;bottom: 0;font-size: 48px;margin-left: -100px;
		}
		.yellow{
			color: #e6b04a;
		}
		.bg-yellow{
			background: #e6b04a;
		}
		.text-ov-hi{
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.m-tb-15{
			margin-top: 15px;
			margin-bottom: 15px;
		}
	</style>
	<body>
		<?php include "./header_choice.html" ?>
		<div id="main">
			<div class="w100">
				<div class="p-t-50 p-lr-185 m-b-80">
					<img src="img/team_buying/2.jpg"/>
				</div>
				<div class="p-lr-170 f-s-0">
					<div class="col-3-1">
						<img src="img/team_buying/画板 1.png"/>
					</div>
					<div class="col-3-1">
						<img src="img/team_buying/画板 2.png"/>
					</div>
					<div class="col-3-1">
						<img src="img/team_buying/画板 3.png"/>
					</div>
				</div>
			</div>
<!--热门团购-->
			<div class="w100 hot-team-bg">
				<div class="w100 text-center">
					<p class="team-title white"><span class="team-title-font">热门团购</span></p>
				</div>
				<div class="p-lr-170">
					<div class="f-s-0" style="padding-top: 0.658rem;padding-bottom:0.755rem">
						<!--团购商品-->
						<div class="col-5-1 text-center white m-tb-15 hot_team_buying">
							<img src="img/team_buying/产品/2.jpg"/>
							<p class="f-s-16 l-h-50 text-ov-hi name">Dickies男式针织套头衫</p>
							<p class="yellow le-s-5">￥<span class="f-s-32 price" style="letter-spacing: 3px;">459</span></p>
							<p class="l-h-60 le-s-5 bg-yellow">剩2人</p>
						</div> 
						<!--团购商品结束-->
					</div>
				</div>

			</div>
<!--热门团购结束-->
<!--精品团购-->
			<div class="w100 boutique-team-bg">
				<div class="w100 text-center">
					<p class="team-title white" style="height:0.833rem"><span class="team-title-font">热门团购</span></p>
				</div>
				<div class="p-lr-170">
					<div class="f-s-0" style="padding-top: 0.658rem;padding-bottom:0.755rem">
						<!--团购商品-->
						<div class="col-5-1 text-center white m-tb-15 boutique_team_buying">
							<img src="img/team_buying/产品/2.jpg"/>
							<p class="f-s-16 l-h-50 text-ov-hi name">Dickies男式针织套头衫</p>
							<p class="yellow le-s-5">￥<span class="f-s-32 price" style="letter-spacing: 3px;">459</span></p>
							<p class="l-h-60 le-s-5 bg-yellow">剩2人</p>
						</div> 
						<!--团购商品结束-->
					</div>
				</div>			
			</div>
<!--精品团购结束-->
<!--明日团购推荐-->
			<div class="w100 tomorrow-team-bg">
				<div class="w100 text-center">
					<p class="team-title white" style="height:0.833rem"><span class="team-title-font">热门团购</span></p>
				</div>
				<div class="p-lr-170">
					<div class="f-s-0" style="padding-top: 0.658rem;padding-bottom:0.755rem">
						<!--团购商品-->
						<div class="col-5-1 text-center white m-tb-15 tomorrow_team_buying">
							<img class="m-b-20" src="img/team_buying/产品/2.jpg"/>

							<p class="l-h-60 le-s-5 bg-yellow">　</p>
						</div> 
						<!--团购商品结束-->
					</div>
				</div>
				<div class="p-lr-170">
					<div class="f-s-0" style="padding-top: 0.658rem;padding-bottom: 1rem;">
						<div class="col-3-1">
							<img src="img/team_buying/产品/500x300/明溪宝石.jpg" />
						</div>
						<div class="col-3-1">
							<img src="img/team_buying/产品/500x300/海棠砚.jpg" />
						</div>
						<div class="col-3-1">
							<img src="img/team_buying/产品/500x300/龙池砚.jpg" />
						</div>
					</div>
				</div>				
			</div>	
<!--明日团购结束-->
		</div><!--main结束-->
		<?php include "./footer.html" ?>
	</body>
	<script type="text/javascript" src="js/jquery.min.js" ></script>
	<script type="text/javascript" src="js/commodity.js" ></script>
	<script>
//热门商品
	$(function(){
		addCommodity(".hot_team_buying",hot_team_buying)
		addCommodity(".boutique_team_buying",boutique_team_buying)
		addCommodity(".tomorrow_team_buying",tomorrow_team_buying)
	})
	</script>
</html>