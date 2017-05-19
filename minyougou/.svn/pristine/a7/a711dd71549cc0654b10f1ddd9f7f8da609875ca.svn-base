<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>全部商品分类</title>
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/attribute.css" />
	</head>
	<style>
		.border{
			border:1px solid #e7e7e7;
			border-bottom: 0;
		}
		.m-t-10{
			margin-top: 10px;
		}
		.m-b-10{
			margin-bottom:calc(10rem / 192)
		}
		.text-ov-hi{
			width: 1.4rem;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
		.side{
			width: calc(322rem / 192)
		}
		.side img{
			box-shadow:0 10px 10px -5px rgba(0,0,0,0.2);
		}
		.big-pic{			
		}
		.big-pic img{
			position: absolute;
			width: calc(866rem / 192);
			left: 0;
			right: 0;
			margin: auto;
			box-shadow:0 10px 30px -5px rgba(0,0,0,0.5);
		}
		.show{
			animation: show 2s;
			-webkit-transition: show 2s;
		}
		@keyframes show{
			from{opacity: 0;}
			to{opacity: 1;}
		}
		@-webkit-keyframes show{
			from{opacity: 0;}
			to{opacity: 1;}
		}
		.hide{
			transition: all 2s;
			-webkit-transition: all 2s;
			opacity: 0;
		}
		.icon-big{
			transform: scale(1.2,1.2);
		}
		.nine-left{
			display: inline-block;
			width: calc(632rem/ 192);
			border: 1px solid #e7e7e7;
			padding: calc(20rem/192);
			border-right: 0;
			vertical-align: top;
		}
		.nine-right{
			display: inline-block;
			width: calc(918rem/ 192);
			border: 1px solid #e7e7e7;
			border-left: 0;
			text-align: justify;
		}
		.nine-class-commodity{
			display: inline-block;
			width: 32%;
			vertical-align: top;
			border: 1px solid gray;

		}
		.m-b-20-auto{
			margin-bottom: calc(20rem/192);
		}
		.justify{
			width: 100%;
			height: 0;
			display: inline-block;
			overflow: hidden;
		}
		.com-info{
			line-height: calc(99rem/192);
			text-align: center;
		}
		.w-1550{
			width: calc(1550rem/192);
			margin: 0 auto;
		}
	</style>
	<body>
		<?php include "./header_choice.html" ?>
		<div id="main" ng-app="all_categories" ng-controller="ctrl_all_categories" style="padding-bottom: 100px;">
			<div class="w100">
				<p class="f-s-40 l-h-200 text-center gray">全部商品分类</p>
			</div>
			<div class="p-lr-185">
				<p class="f-s-32 gray">今日推荐</p>
			</div>
			<div class="p-t-50 p-lr-170 f-s-0">
				<div class="col-5-1 today_recomment" ng-repeat="x in commodity | filter:{'type':'today'}">
					<img src="{{x.img_url}}"  class="border" />
					<div class="bg-999 text-center white l-h-100">
						<div class="ver-mid" >
							<p class="f-s-16 text-ov-hi name">{{x.name}}</p>
							<p class="f-s-16">¥<span class="price">{{x.price}}</span></p>
						</div>
					</div>
				</div>
			</div>
			<div class="p-t-50 f-s-0 po-re w-1550">
				<div class="side pull-left">
					<img class="m-b-10" data-index="0" src="img/all_categories/322-120/2.jpg" />
					<img class="m-b-10" data-index="1" src="img/all_categories/322-120/1.jpg" />
					<img data-index="2" src="img/all_categories/322-120/3.jpg" />
				</div>
				<div class="big-pic">
					<img src="img/all_categories/866-380/1 (2).png" class="show"/>
					<img src="img/all_categories/866-380/1 (1).png" class="hide"/>
					<img src="img/all_categories/866-380/1 (3).png" class="hide"/>
					<img src="img/all_categories/866-380/01.jpg" class="hide"/>
					<img src="img/all_categories/866-380/02.jpg" class="hide"/>
					<img src="img/all_categories/866-380/03.jpg" class="hide"/>					
				</div>
				<div class="side pull-right">
					<img class="m-b-10" data-index="3" src="img/all_categories/322-120/01.jpg" />
					<img class="m-b-10" data-index="4" src="img/all_categories/322-120/02.jpg" />
					<img data-index="5" src="img/all_categories/322-120/03.jpg" />
				</div>
				<div class="clearfix"></div>
			</div>
			<div class="p-t-50 w-1550" ng-repeat = "x in nine_class">
				<div class="p-t-50">
					<p class="f-s-32 gray pull-left">{{x.name}}</p>
					<a href="all_categories_child.php"><p class="icon iconfont icon-angle-double-right pull-right f-s-32 gray icon-big index"></p></a>
					<div class="clearfix"></div>
				</div>
				<div class="p-t-50 f-s-0">
					<div class="nine-left">
						<img src="{{x.img_url}}" />
					</div>
					<div class="nine-right  f-s-0"  style="overflow: hidden;">
						<span class="nine-class-commodity m-b-20-auto">
							<img src="{{com.commodity[0].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[0].name}}</p>
									<p>¥{{com.commodity[0].price}}</p>
				                </div>
			               </div>
						</span>
						<span class="nine-class-commodity">
							<img src="{{com.commodity[1].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[1].name}}</p>
									<p>¥{{com.commodity[1].price}}</p>
				                </div>
			               </div>
						</span>
						<span class="nine-class-commodity">
							<img src="{{com.commodity[2].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[2].name}}</p>
									<p>¥{{com.commodity[2].price}}</p>
				                </div>
			               </div>
						</span>
						<span class="nine-class-commodity">
							<img src="{{com.commodity[3].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[3].name}}</p>
									<p>¥{{com.commodity[3].price}}</p>
				                </div>
			               </div>
						</span>
						<span class="nine-class-commodity">
							<img src="{{com.commodity[4].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[4].name}}</p>
									<p>¥{{com.commodity[4].price}}</p>
				                </div>
			               </div>
						</span>
						<span class="nine-class-commodity">
							<img src="{{com.commodity[5].img_url}}" />
							<div class="bg-999 com-info">
								<div class="ver-mid">
									<p>{{com.commodity[5].name}}</p>
									<p>¥{{com.commodity[5].price}}</p>
				                </div>
			               </div>
						</span>

																		
						<div class="justify"></div>
					</div>
				</div>
			</div>

		</div>
		
		<?php include "./footer.html" ?>
	</body>
	<script type="text/javascript" src="js/jquery.min.js" ></script>
	<script type="text/javascript" src="js/angular.js" ></script>

	<script>


		var all_cate = angular.module("all_categories",[])
		all_cate.controller("ctrl_all_categories",function($scope,$http){
			$http({
				method:'get',
				url:'./data/commodity.txt'
			}).then(function successCallback(response){
				$scope.commodity = response.data.commodity
				$scope.nine_class = response.data.nine_class
				$scope.com = response.data.nine_class[0]


			},function errorCallback(response){
				console.log(response.data)
			})

		})

        window.onload=function()
        {
            var getLi=document.getElementsByClassName("index");
            for(i=0;i<getLi.length;i++)
            {
                getLi[i].index=i;             
                getLi[i].onclick= function ()
                {
                    localStorage.setItem("index",this.index)
                }
            }
        }
	</script>
	<script>

		//大图显示
		$(".side img").mouseover(function(){
			var index = $(this).attr("data-index");
			var pic = ".big-pic" + " " + "img:eq(" + index + ")";
			$(".big-pic img").removeClass("show").addClass("hide") 
			$(pic).removeClass("hide").addClass("show")

		})


		
	</script>
</html>