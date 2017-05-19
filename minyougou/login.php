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
    .flex-container {
        display: -webkit-flex;
        display: flex;
    }
    .item{
        flex: 1;
    }

    /*.login-container{*/
        /*position: fixed;*/
        /*width: 100vw;*/
        /*height: 100vh;*/
        /*z-index: 100;*/
        /*top:0;*/
        /*left: 0;*/
        /*display: none;*/
    /*}*/
    /*.login_mask{*/
        /*opacity: 0.7;*/
        /*width: 100vw;*/
        /*height: 100vh;*/
        /*z-index: 100;*/
        /*background: black;*/
    /*}*/
    /*.login_box{*/
        /*z-index: 101;*/
        /*position: relative;*/
    /*}*/
    li{
        list-style-type:none;
        margin-top: 15px;
    }
    /*input{*/
        /*width: 100%;*/
    /*}*/
</style>
<body >
<!--<div class="flex-container" style="">-->
<!--    <div class="item"></div>-->
<!--    <div class="" style="height: 350px;border: 1px solid">-->
<!--        <div class="" style="">-->
<!--            <h2><span>账号登录</span></h2>-->
<!--            <ul>-->
<!--                <li><input type="text" maxlength="40" placeholder="手机号/邮箱"></li>-->
<!--                <li><input type="password" maxlength="18" placeholder="密码"></li>-->
<!--            </ul>-->
<!--        </div>-->
<!--        <div class="" style="">-->
<!--            <h2><span>二维码登录</span></h2>-->
<!--        </div>-->
<!---->
<!--    </div>-->
<!--    <div class="item"></div>-->
<!--</div>-->
<?php include "./header.html"?>

</body>
<script src="js/jquery.min.js"></script>
<script>
    //html’s font follow scren size change
    var width=$(window).width()
    var size=width/10
    size = size +"px"
    $("html").css("font-size",size)
    $(window).resize(function() {
        var width=$(window).width()
        var size=width/10
        size = size +"px"
        $("html").css("font-size",size)
    });
</script>
<script>
//    $('.user_login').click(function(){
//        $('.login-container').show()
//    });
//    $('.box_close').click(function(){
//        $('.login-container').hide()
//    })
    $('login_box').chick(function () {
        $('')
    })
</script>
</html>
