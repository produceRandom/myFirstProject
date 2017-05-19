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
    .box-account{
        width: 1300px;
        margin: 0 auto;
        padding: 104px 0 130px 0
    }
    @media only screen and (max-width:1200px) {
        .box-account{
            width:100%;
            overflow: hidden;
        }
    }
    .box{
        width: 85%;
        height: 407px
    }
    .box-content{
        height:145px;
        width: 48.5%;
        background-color: #fbfbfb;
        border: 1px solid #ddd
    }
    .box-content-t{
        height:145px;
        margin-top: 30px;
        background-color: #fbfbfb;
        border: 1px solid #ddd

    }
    .p-l{
        padding-left: 20px;
        line-height: 32px;
        font-size: 17px

    }

    strong{
        font-size: 15px;
        line-height: 50px;
    }
    .content-edit{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ddd;
        padding: 0 15px;
        background-color: #f5f5f5
    }
    .edit{
        color: black;
        float: right;
        font-size: 13px
    }

    .list{color: #777;margin: 0;padding-left: 20px;height: 32px;width: 155px; font-size: 14px;border:1px solid  #ddd;border-top:0;}
    .border-top{border-top: 1px solid #ddd;}
    .list span{
    ;cursor:hand;line-height: 30px;font-size: 13px
    }
    .green{
        color: #00DFB8;
    }
</style>
<body style="overflow: hidden">
<?php include "./header.html"?>
<div class="flex-container box-account" style="">

    <div class="left-list"  style="width: 155px;margin-right: 20px;">
        <h1 class="" style="margin: 0 0 20px 0;padding-left: 20px;height: 32px;line-height: 32px;width: 155px;font-size: 17px;">个人中心</h1>
        <h1 class="list border-top green"><span>我的订单</span></h1>
        <h1 class="list" ><span >我的优惠券</span></h1>
        <h1 class="list" ><span >我的万鹤币</span></h1>
        <h1 class="list" ><span >账号信息</span></h1>
        <h1 class="list" ><span >账号安全</span></h1>
        <h1 class="list" ><span >我收藏的商品</span></h1>
        <h1 class="list" ><span >管理收货地址</span></h1>
        <h1 class="list" ><span >VIP级别</span></h1>
        <h1 class="list" ><span >售后服务</span></h1>

    </div>


    <iframe id="iframe" frameborder="0" width="87%"  src="account/1.html" scrolling="no"></iframe>
</div>


<?php //include "./footer_down.html"?>
<!--  --><?php //include "./_footer_container_page_145.html"?>
</body>
<script src="js/jquery.min.js"></script>
<script>

    function setIframeHeight(id){
        try{
            var iframe = document.getElementById(id);
            if(iframe.attachEvent){
                iframe.attachEvent("onload", function(){
                    iframe.height =  iframe.contentWindow.document.documentElement.scrollHeight;
                });
                return;
            }else{
                iframe.onload = function(){
                    iframe.height = iframe.contentDocument.body.scrollHeight;
                };
                return;
            }
        }catch(e){
            throw new Error('setIframeHeight Error');
        }
    }
    setIframeHeight("iframe")
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
    if (window.localStorage) {
        if (localStorage.getItem("index") != null) {
            var index = localStorage.getItem("index");
            var list = ".list:eq(" + (index - 1) + ")"
            $(list).addClass("green").siblings().removeClass("green")
            var url = "account/" + index + ".html"
            $("iframe").attr("src",url)
        } else{

        }
    } else{

    }


    $(".list").click(function(){
        $(this).addClass("green").siblings().removeClass("green")
        var index = $(this).index();
        var url = "account/" + index + ".html"
        $("iframe").attr("src",url)
        setIframeHeight("iframe")
        localStorage.setItem("index",index)
    })

</script>
</html>
