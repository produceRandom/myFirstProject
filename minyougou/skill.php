<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- 引入 Bootstrap -->
	<title>秒杀</title>
	<link rel="stylesheet" type="text/css" href="./css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap-theme.css">
	<link rel="stylesheet" type="text/css" href="./css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="css/attribute.css" />
<!--	<link rel="stylesheet" type="text/css" href="./css/attribute.css">-->
	<script src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>

</head>
<style>
		.p-lr-170{
			padding-left:0.585rem;
			padding-right: 0.585rem;
		}
		/*img:hover{
			    -webkit-filter: brightness(120%)
		}*/
    .flex-container{
        display: -webkit-flex;
        display: flex;
        height: 100%;
        margin: 0 auto;
        width: 1550px;

    }
    .item{
        margin: 13px 0;
        width: 250px;
        height:50px;
        font-size: 20px;
        text-align: center;
        color: white;
        border-right: 1px solid white;
    }
    .item2{
        background: red;
        width: 210px;
        height:78px;
        line-height: 78px;
        font-size: 20px;
        text-align: center;
        color: white;
        position: relative;

    }
    .item2:before{
    	content: "";
    	width: 0;
    	height: 0;
    	border: 10px solid transparent;
    	border-top: 10px solid red;
    	position: absolute;
    	left: 0;
    	right: 0;
    	margin: auto;
    	bottom:-20px
    }
    .item3{
        margin: 13px 0;
        width: 210px;
        height:50px;
        font-size: 20px;
        text-align: center;
        color: white;
    }
    .b-l{
        border-left:1px solid white;
    }
    .b-r{
        border-right:1px solid white;
    }
    .l-h{
        line-height: 100%;
        vertical-align: middle;
        display: inline-block;
    }
    .col-line{
        height:50px;
        width: 1px;
        background: #ffffff;
        position: relative;
        display:inline-block;
        top:13px
    }
    .c-lh{
        height: 220px;
        margin: 0 auto;
        line-height: 220px;
    }
    .dta{
        font-size: 48px;
        color: red;
        display: inline-block;
    }
    .bot{
        display: inline-block;
        line-height: 220px;
        vertical-align: top
    }
    .sew{
        width: 60px;
        height: 60px;
        line-height:60px;
        background: #9f9f9f;
        display: inline-block;
        vertical-align: middle;
        text-align: center
    }
    .sew1{
        width: 40px;
        height: 60px;
        line-height:60px;
        /*background: #E7E7E7;*/
        display: inline-block;
        vertical-align: middle;
        text-align: center
    }
    label{
        font-size: 46px;
        color: white;
    }
    .iwo{
        width: 294px;
        height: 392px;
        border: 1px solid #9f9f9f;
        border-bottom: 0;
    }
    .commodity{
        height: 492px;
        width: 294px;
        background-color: #9f9f9f;
        color: white;
        position: relative
    }
    .p-t-c{
        padding: 0 24px;
        text-align: center;

    }
    .p-m-t{
        position: relative;
        height: 45px
        /*margin-top: 18px*/
    }
    .f-z{
        font-size: 14px;
        font-weight: 600;
    }
    .t-l{
        text-align: left;
        font-size: 24px;
    }
    .snap{
        width: 100px;
        height: 32px;
        color: white;
        background: red;
        /*border-radius: 1px;*/
        font-size: 20px;
        border: 0;
        position: absolute;
        top: 0;
        right: 0
    }
    .panic{
        position: absolute;
        top: 0;
        left: 0.32rem;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        background: red;
        text-align: center;
    }
    .name{
        font-size: 14px;
        font-weight: 600
    }
    table{
        height: 55px;
        text-align: center
    }
    td{
        display: inline-block;
        text-align: left;
        padding-top: 10px;
        vertical-align: top
    }
    .more_highQuality_commodity{
    	
    }
    .skill_commodity:hover .shadow{
    	box-shadow: 3px 5px 5px -2px rgba(153,153,153,0.8);
    	background: #ffffff;
    	color: #9f9f9f;   
    	border: 1px solid #9f9f9f;
    	border-top: 0; 	
    }
    .skill_commodity img:hover{
    	filter: contrast(80%);   	
    	-webkit-filter: contrast(80%); /* Chrome, Safari, Opera */
    	cursor: pointer;
    }
    .skill_commodity .shadow:hover{
    	background: #ffffff;
    	color: #9f9f9f;
    	box-shadow: 3px 5px 5px -2px rgba(153,153,153,0.8);
    	border: 1px solid #9f9f9f;
    	border-top: 0; 	
    }
    /*.detail_name{*/
        /*position: absolute;*/
    /*}*/
</style>
<body >
    <?php include "./header_choice.html"?>
    <div class="" style="width: 100%;height: 78px;background: #333333;">
        <div class="flex-container">
            <div class="item b-l">
                <div style="text-align: center;display: inline-block">
                    <span class="icon iconfont icon-left" style="font-size: 40px;float: left;margin-left: -80px"></span>
                    <span>今日00:00</span>
                    <p>已开抢</p>
                </div>
            </div>
            <div class="item2">
            	<div class="l-h" style="">
	                <span>今日10:00</span>
	                <p>抢购中</p>
                </div>
            </div>
            <div class="col-line"></div>

            <div class="item3 b-r">
                <span>今日12:00</span>
                <p>抢购中</p>
            </div>
            <div class="item3 b-r">
                <span>今日14:00</span>
                <p>抢购中</p>
            </div>
            <div class="item3 b-r">
                <span>今日16:00</span>
                <p>抢购中</p>
            </div>
            <div class="item3">
                <span>今日18:00</span>
                <p>抢购中</p>
            </div>
            <div class="item b-l b-r">
                <div style="text-align: center;display: inline-block">
                    <span class=" icon iconfont icon-right" style="font-size: 40px;float: right;margin-right: -80px"></span>
                    <span>今日20:00</span>
                    <p>已开抢</p>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-container" style="min-width: 1200px">
        <div class="c-lh">
            <div class="dta">距离本场结束：</div>
            <div class="bot">
                <div class="sew" style="margin-right: 40px">
                    <label>0</label>
                </div>
                <div class="sew">
                    <label>2</label>
                </div>
                <div class="sew1">
                    <label style="color: #9f9f9f">:</label>
                </div>
                <div class="sew" style="margin-right: 40px">
                    <label>5</label>
                </div>
                <div class="sew">
                    <label>9</label>
                </div>
                <div class="sew1">
                    <label style="color: #9f9f9f">:</label>
                </div>
                <div class="sew" style="margin-right: 40px">
                    <label>5</label>
                </div>
                <div class="sew">
                    <label>9</label>
                </div>
            </div>
        </div>
    </div>
<!--商品-->
			<div class="w100">
				<div class="p-lr-170">
					<div class="f-s-0">
						<!--秒杀商品-->

						<div class="col-4-1 text-center white  skill_commodity po-re" style="padding:0 0.32rem;">
							<img src="img/team_buying/产品/2.jpg" style="border: 1px solid #9f9f9f;border-bottom: 0;"/>
							<div class="shadow p-t-c bg-999">
                                <table  width="250">
                                    <td class="name">d</td>
                                </table>
			                    <div class="p-m-t" >
			                        <p class="t-l price">¥ 38.0</p>
			                        <button class="snap">立即抢购</button>
			                    </div>
			               </div>
				            <span class="panic">
				                <span class="f-z" >已抢</span>
				                <p class="f-z">10/100</p>
				            </span>			               
						</div> 
					</div>
				</div>			
			</div>
    <!--<div class="flex-container" >
        <div class="commodity" style="margin-right:0.64rem;">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z name">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l price">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-container" style="margin-top: 0.64rem">
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-container" style="margin-top: 0.64rem">
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>-->
    <div class="flex-container">
        <div style="margin: 0 auto;padding: 82px 0">
            <div style="width: 538px;height: 68px;border: 1px solid #9f9f9f;text-align: center;position: relative" >
                <span class="dta" style="font-weight: 600">更多优质商品</span>
                <div style="position: absolute;height: 2px;width: 2.66rem;background: #9f9f9f;right: -2.66rem;top:0;bottom: 0;margin: auto "></div>
                <div style="position: absolute;height: 2px;width: 2.66rem;background: #9f9f9f;left: -2.66rem;top:0;bottom: 0;margin: auto "></div>
            </div>
        </div>
    </div>
    
    
	<div class="w100">
		<div class="p-lr-170">
			<div class="f-s-0">
				<!--更多优质商品-->

                <div class="col-4-1 text-center white  more_highQuality_commodity po-re" style="padding:0 0.32rem;">
                    <img src="img/team_buying/产品/2.jpg" style="border: 1px solid #9f9f9f;border-bottom: 0;"/>
                    <div class="p-t-c bg-999">
                        <table  width="250">
                            <td class="name">d</td>
                        </table>
                        <div class="p-m-t" >
                            <p class="t-l price">¥ 38.0</p>
                            <button>立即抢购</button>
                        </div>
                        <span class="panic">
				                <span class="f-z" >已抢</span>
				                <p class="f-z">10/100</p>
				            </span>
                    </div>
                </div>
                <!--更多优质商品结束-->
			</div>
		</div>			
	</div>
    <!--<div class="flex-container" >
        <div class="commodity" style="margin-right:0.64rem;">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-container" style="margin-top: 0.64rem">
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex-container" style="margin-top: 0.64rem">
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t">
                        <p class="t-l">¥ 38.0</p>
                        <button>立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" style="margin-right:0.64rem">
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="commodity" >
            <span class="panic">
                <span class="f-z" >已抢</span>
                <p class="f-z">10/100</p>
            </span>
            <div class="iwo">
                <img width="100%" src="./img/skill/1.jpg">
                <div class="p-t-c" >
                    <span class="f-z">厦门特产 &nbsp鼓浪屿猪肉丁</span>
                    <div class="p-m-t" >
                        <p class="t-l">¥ 38.0</p>
                        <button >立即抢购</button>
                    </div>
                </div>
            </div>
        </div>
    </div>-->



    <?php include "./footer.html"?>
</body>
<script type="text/javascript" src="js/commodity.js" ></script>
<script>
	var addMB = function(className){
		for (i = 0; i < $(className).length; i++) {
			if ( i % 4 == 3 && i != $(className).length) {
				var item = className + ":eq(" + i + ")"
				$(item).css("margin-bottom","0.64rem")
			}
		}
	}	
	
	$(function(){
		addCommodity(".skill_commodity",skill_commodity)
		addCommodity(".more_highQuality_commodity",more_highQuality_commodity)
		//除最后一行外，底部的margin
		addMB(".skill_commodity")
		addMB(".more_highQuality_commodity")
		

	})
//    $(".name").mouseover(function(){
//        var text = $(this).text()
//        $(this).parent().children(".detail_name").text(text)
//
//    })
</script>

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
