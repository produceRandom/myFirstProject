<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- 引入 Bootstrap -->

	<link rel="stylesheet" type="text/css" href="./css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap-theme.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap-theme.min.css">

	<script src="js/angular.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>

</head>
<style>
	h3{
		margin: 0;
	}
    #main{
        width: 1300px;
        margin: 0 auto;
        padding: 104px 0 130px 0;
        font-size: 0;
		display: flex;
    }
    @media only screen and (max-width:1200px) {
        #main{
            width:100%;
            overflow: hidden;
        }

    }

	.left-help{width: 200px;margin-right: 20px;display: inline-block;}
    .list{color: #777;border: 1px solid #ccc;border-top: 0;}
    .list-item{line-height: 40px;text-indent: 24px;cursor: pointer;}
    .list-item-active{color: #00DFB8}
    .up{position: absolute;visibility: hidden;}
    .down{position: static;visibility: visible;}
	.left-help h3{text-indent: 1em;}
	.left-help h3:after{font-family:"iconfont" !important;content: "\ee37";float: right;margin-right: 1em;font-size: 14px;cursor: pointer;display: inline}
	
	.right-text{
		width: 83%;
		display: inline-block;
		vertical-align: top;
		overflow-x: hidden;

	}	
	.right-text h3{text-indent: 1em;}
	.border-top{border-top: 1px solid #ddd;}

    .list span{
    	;cursor:hand;line-height: 30px;font-size: 13px
    }
	.green{
		color: #00DFB8;
	}
	.bor-1-c{
		border:1px solid #ccc;
	}
	.bor-t-no{
		border-top: 0px;
	}
	.des-content{
		border: 1px solid #ccc;
		overflow-y: scroll;
		height: 600px;
		padding-left: 2em;
		color:gray;
	}
</style>
<body style="overflow-y: scroll;">
    <?php include "./header.html"?>
    <div id="main">

        <div class="left-help">
			<h3 class="bor-1-c l-h-60" data-list="0">购物指南</h3>
			<div class="list up"  data-filename = "guide" data-index="0">
				<div class="list-item">购物流程</div>
				<div class="list-item">常见问题</div>
				<div class="list-item">会员介绍</div>
				<div class="list-item">联系客服</div>
			</div>
			<h3 class="bor-1-c l-h-60 bor-t-no" data-list="1">配送方式</h3>
			<div class="list up"  data-filename = "send" data-index="1">
				<div class="list-item">配送查询</div>
				<div class="list-item">上门自提</div>
				<div class="list-item">配送费用</div>
				<div class="list-item">海外配送</div>
			</div>
			<h3 class="bor-1-c l-h-60 bor-t-no" data-list="2">支付方式</h3>
			<div class="list up"  data-filename = "pay" data-index="2">
				<div class="list-item">在线支付</div>
				<div class="list-item">分期付款</div>
				<div class="list-item">邮局汇款</div>
				<div class="list-item">公司转账</div>
			</div>			
			<h3 class="bor-1-c l-h-60 bor-t-no" data-list="3" >售后服务</h3>
			<div class="list up" data-filename = "after_sale" data-index="3">
				<div class="list-item">售后政策</div>
				<div class="list-item">价格保护</div>
				<div class="list-item">反退换货</div>
				<div class="list-item">取消订单</div>
			</div>			
        </div>
		<div class="right-text">
			<h3 class="bor-1-c l-h-60"></h3>
			<div class="des-content"></div>
		</div>
       
		<!--<iframe id="iframe" frameborder="0" width="87%" src="account/1.html"></iframe>-->
    </div>


<?php include "./footer_down.html"?>
<!--  --><?php //include "./_footer_container_page_145.html"?>
</body>
<script src="js/jquery.min.js"></script>

<script>
	window.onload = function(){
		if (localStorage.getItem("foot-list-index") != null) {
			
			var index = localStorage.getItem("foot-list-index")
			var parentIndex = localStorage.getItem("parent_index")
			$(".list-item:eq(" + index + ")").click()
			$("[data-list='" + parentIndex + "']").click()
		} else{
			
		}
		
	}
	$("[data-list]").click(function(){
		var index = $(this).attr("data-list")
		if ($(".list:eq(" + index + ")").hasClass("down")) {
			$(".list:eq(" + index + ")").addClass("up").removeClass("down")
		} else{
			$(".list:eq(" + index + ")").addClass("down").removeClass("up")
		}
		
	})
	$(".list-item").click(function(){
		$(".list-item").removeClass("list-item-active")
		$(this).addClass("list-item-active")
		$(".right-text h3").text($(this).text())
		localStorage.setItem("foot-list-index",$(".list-item").index($(this)))
		localStorage.setItem("parent_index",$(this).parent().attr("data-index"))
		
		//获取文本内容
		var filename = $(this).parent().attr("data-filename")
		var url = "data/help/" + filename + "/" + $(this).index() + ".txt"
		var ajax = new XMLHttpRequest()
		ajax.onreadystatechange = function(){
			if (ajax.readyState == 4 && ajax.status == 200) {
				$(".des-content").html(ajax.responseText)
				
			} else{
				
			}
		}
		ajax.open("GET",url,true)
		ajax.send()
	})

</script>
</html>
