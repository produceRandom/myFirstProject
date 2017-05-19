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

        .list{
            /*color:#000 !important;*/
            margin: 0 !important;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            width: 120px;
            line-height: 46px;
            border: 1px solid #9f9f9f;;
            font-size: 24px;
            font-weight: 500;
            color: #9f9f9f;
            cursor: pointer;
        }
        .active{
            background: #9f9f9f;
            color: white;
        }

	</style>
	<body>
		<?php include "./header_choice.html" ?>
<!--		<div id="main">-->
<!--			<div class="w100">-->
<!--				<p class="f-s-40 l-h-200 text-center gray">全部商品分类</p>-->
<!--			</div>-->
<!--		</div>-->
        <div class="container" style="width: 1550px;height: 260px">
             <div class="row " style="padding: 70px 0">
                <div class="col-md-12 col-xs-12" style="border: 6px solid #9f9f9f;height: 120px;display: inline-block;">
                    <div class="col-md-2 col-xs-2" style="height:100%;line-height: 110px;padding: 0;width: 250px">
                        <span style="font-size: 40px;font-weight: 700;color: #9f9f9f">全部商品分类</span>
                    </div>
                    <div class="col-md-10 col-xs-10">
                        <ul  style="display: inline-block;text-align: justify;color: #000;height: 110px;line-height: 110px">
                            <li class="list active" style="">户外运动</li>
                            <li class="list" style="">服饰鞋包</li>
                            <li class="list" style="">珠宝表饰</li>
                            <li class="list" style="">美妆个护</li>
                            <li class="list" style="">工艺收藏</li>
                            <li class="list" style="">玩具爱好</li>
                            <li class="list" style="">数码产品</li>
                            <li class="list" style="">家居园艺</li>
                            <li class="list" style="">汽车商城</li>
                            <li style="width: 100%;height:0;display: inline-block;overflow: hidden"></li>
                        </ul>
                    </div>
                </div>
             </div>
        </div>
        <div></div>
		<?php include "./footer.html" ?>
	</body>
<script src="js/jquery.min.js"></script>

<script>
	window.onload = function(){
		var index = localStorage.getItem("index");
		$(".list").removeClass("active");
		$(".list:eq("+ index + ")").addClass("active")
	}
	
    $(".list").click(function(){
        $(this).addClass("active").siblings().removeClass("active")
    })
</script>
</html>