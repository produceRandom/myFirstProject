<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>详情页</title>
		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/attribute.css" />
		<link rel="stylesheet" href="css/swiper.min.css" />
	</head>
	<style>
		#main{
			padding-top: 74px;
		}
		.po-re{
			position: relative;
		}
		.p-lr-185{
			padding-left:0.963rem;
			padding-right: 0.963rem;
		}

		.switch-pic{
			position: relative;
			height: 600px;
		}
		.switch-item{
			width: 500px;
			height: 500px;
			box-shadow:0 10px 20px -5px #999;
			margin-top: 25px;
		}
		.item0{
			transform: translate(-200px,20px) scale(0.8,0.8);
		}
		.item1{
			transform: translate(0,0) scale(1,1);
			z-index: 2;
		}
		.item2{
			transform: translate(200px,20px) scale(0.8,0.8);
			z-index: 1;
		}
		.item3{
			transform: translate(350px,20px) scale(0.6,0.6);
		}
		.next{
			position: absolute;
			right: 0;
			line-height: 550px;
			cursor: pointer;
		}
		.prve{
			position: absolute;
			line-height: 550px;
			cursor: pointer;
		}		
	</style>
	<body>
		<?php include "./header.html" ?>
		<div id="main">
			<div class="p-lr-185 po-re">
				<div class="l-h-100 f-s-14 gray">
					<span>所有分类</span>
					<span class="icon iconfont icon-right"></span>
					<span>居家园艺</span>
				</div>
				<div class="po-re" style="padding: 0 50px;">
					<div class="swiper-container">
						<div class="swiper-wrapper switch-pic">
							<div class="swiper-slide switch-item" style="background: url(img/details/5.jpg);"></div>
							<div class="swiper-slide switch-item" style="background: url(img/details/2.jpg);"></div>
							<div class="swiper-slide switch-item" style="background: url(img/details/3.jpg);"></div>
							<div class="swiper-slide switch-item" style="background: url(img/details/1.jpg);"></div>
							<!--<span class="prve icon iconfont icon-left" style="font-size: 40px;" onclick="prve()"></span>
							<span class="next icon iconfont icon-right" style="font-size: 40px;" onclick="next()"></span>-->
						</div>
					</div>
			        <!-- Add Navigation -->
			        <div class="swiper-button-prev swiper-button-black"></div>
			        <div class="swiper-button-next swiper-button-black"></div>
				</div>
			</div>
		</div><!--main结束-->
		<?php include "./footer.html" ?>
	</body>
	<script type="text/javascript" src="js/jquery.min.js" ></script>
	<script type="text/javascript" src="js/commodity.js" ></script>
	<script type="text/javascript" src="js/swiper.min.js" ></script>
	<script>
//		function next(){
//			outerloop:
//			for (i=0;i<4;i++) {
//					var item = "item" + i;	
//					for (j=0;j<4;j++) {
//						var switchItem = ".switch-item:eq(" + j +")"					
//						if ( $(switchItem).hasClass(item) ){
//							$(switchItem).removeClass(item);
//							var index = i + 1;
//							index = index % 4
//							item = "item" + index;
//							$(switchItem).addClass(item);	
//							break outerloop	
//						}   					
//					}				
//
//			}
//		}
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        centeredSlides: true,
        loop:true,
        slidesPerView: 'auto',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        effect: 'coverflow',
        coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
        }
 
    });
	</script>
</html>