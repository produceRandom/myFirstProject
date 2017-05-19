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
	/**{*/
		/*font-size: 20px;*/
	/*}*/

    .header{
        background: url(img/review/top.png) no-repeat;
        background-size: cover;
        height:4.083rem;
        line-height:4.083rem;
        text-align: center;
        min-width: 1000px;
    }
    .flex-container {
        /*display: -webkit-flex;*/
        /*display: flex;*/
        background: url(img/review/top.png) no-repeat;
        width: 100%;
        height: 570px;
        z-index: 1;
        margin-top: 74px;

    }
    .item1 {

        flex: 1;

     }
    label{
        color:#319F76;
        margin-left: 50px;
        margin-right: 25px;
    }
    .clearfix{
        height: 90px;
    }

</style>
<body >
<!--<div  class="col-md-12 header" style="padding: 0;">-->
    <?php include "./header.html"?>
<!--    <div class="col-md-12  col-lg-offset-1 " style="padding: 0;width: 8.3rem;height: 2.5rem;margin-top: 124px;background:rgba(119,119,119,0.4)">-->
<!---->
<!--        <div class="col-md-12 col-lg-offset-5 col-sm-offset-5 col-md-offset-5" style="width: 250px;height: 50px;background: black;position: absolute;bottom: 0.2rem">-->
<!--        </div>-->
<!--        <div class="col-md-12 flex-container" style="margin: 0;padding: 0;position: absolute;bottom: -0.5rem">-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;margin-right: 50px;background: black;"></div>-->
<!--            <div class="item1 " style="width: 180px;height: 50px;background: black;"></div>-->
<!--        </div>-->
<!--    </div>-->
<div class="flex-container" >
    <div style="width: 8.08rem;margin: 0 auto;height: 570px;padding: 50px 0">
        <div style="width: 100%;height:370px;background:rgba(119,119,119,0.4);text-align: center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="result" style="height: 290px">
                <tbody>
                    <tr>
                        <td width="25%" align="right">产品ＳＮ：</td>
                        <td width="75%" align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">产品名称：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">生产日期：</td>
                        <td align="left" colspan="3">
                            2012-05-14
                        </td>
                    </tr>
                    <tr>
                        <td align="right">装箱规格：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">产品编号：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">产 品 线：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">批 次 号：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>
                    <tr>
                        <td align="right">箱  码：</td>
                        <td align="left" colspan="3">000000000000000000000</td>
                    </tr>

                    <tr>
                        <td colspan="4" align="center"></td>
                    </tr>
                    </tbody>
            </table>
            <button style="width: 222px;height: 50px;background: black;color:#319F76;font-size: 25px;border: 0">返回查询</button>
        </div>
        <ul style="text-align: justify;margin: 0;padding: 50px 0">

        <li style="margin:0;padding:0;text-align: center;width:180px;line-height: 50px;background: black;color:#319F76;font-size: 25px;display: inline-block;">返回查询</li>
        <li style="margin:0;padding:0;text-align: center;width:180px;line-height: 50px;background: black;color:#319F76;font-size: 25px;display: inline-block;">返回查询</li>
        <li style="margin:0;padding:0;text-align: center;width:180px;line-height: 50px;background: black;color:#319F76;font-size: 25px;display: inline-block;">返回查询</li>
        <li style="margin:0;padding:0;text-align: center;width:180px;line-height: 50px;background: black;color:#319F76;font-size: 25px;display: inline-block;">返回查询</li>
        <li style="margin:0;padding:0;text-align: center;width:180px;line-height: 50px;background: black;color:#319F76;font-size: 25px;display: inline-block;">返回查询</li>
        <li style="display: inline-block;width: 100%;height: 0;overflow: hidden"></li>
    </ul>
    </div>
</div>
<!--<div class="flex-container">-->
<!--    <div style="width: 8.08rem;margin: 0 auto;">-->
<!--        <button style="width: 180px;height: 50px;background: black;color:#319F76;font-size: 25px;border: 0">返回查询</button>-->
<!---->
<!--    </div>-->
<!--</div>-->



<!--<div class="clearfix"></div>-->
<footer class="w100" style="">
    <div class="clearfix"></div>
    <div class="w100">
        <div class="f-s-16 l-h-100 text-center">
            <p>
                <label style="margin-left: 0;">正</label>正品保证，购享无忧
                <label>快</label>多仓直发，极速配送
                <label>好</label>正品行货，精致服务
                <label>省</label>天天低价，畅选无忧
            </p>
        </div>
    </div>
    <div class="text-center">
        <address style="font-size: 10px;transform:scale(0.6);">
            <p style="margin-bottom: 5px">京公网安备 11000002000088号|京ICP证070359号|互联网药品信息服务资格证编号(京)-经营性-2014-0008|新出发京零 字第大120007号</p>
            <p style="margin-bottom: 5px">互联网出版许可证编号新出网证(京)字150号|出版物经营许可证|网络文化经营许可证京网文[2014]2148-348号|违法和不良信息举报电话：4006561155</p>
            <p style="margin-bottom: 5px">Copyright © 2004 - 2016  闽优购www.minyougou.com 版权所有|消费者维权热线：40060677xx经营证照</p>
        </address>
    </div>
</footer>

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
</html>
