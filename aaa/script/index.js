//导航栏项目点击事件
$(".header-left-nav-list").click(function(){
	$(this).addClass("header-left-nav-list-current").siblings().removeClass("header-left-nav-list-current")
})

//个人中心图标点击事件
$(".header-right-personIcon").click(function(){
	if ($(".header-right-personIcon-menu").hasClass("hidden")) {
		$(".header-right-personIcon-menu").removeClass("hidden")
	} else{
		$(".header-right-personIcon-menu").addClass("hidden")
	}
	
})


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
setIframeHeight("index-iframe")
