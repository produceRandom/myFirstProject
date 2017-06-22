function loadIframe(iframeID,iframeName,bool){
	var iframe = document.getElementById(iframeID);
	iframe.setAttribute("src",`view/${iframeName}.html`);
	$(`[data-page=${iframeName}]`).addClass("header-left-nav-list-current").siblings().removeClass("header-left-nav-list-current")
	
	if (!bool) {
		history.pushState({page:iframeName},"",location.href.split("=")[0] + "="+iframeName)
	} else{
		
	}
}
function changeContent(){
		
	var page = location.href.split("=")[1]
	if (page) {
		$(`[data-page=${page}]`).trigger("click","index-iframe",page,true)
	} else{
		history.replaceState({page:1}, "",location.href + "?page=home"); 
		changeContent()
		
	}
}

window.onload = function(){
	changeContent()
	$(window).on("popstate",function(){
		console.log(location.href)
		changeContent()
	})
}
  		window.onpopstate = function(event){
  			var obj = JSON.stringify(event.state)
  		}
//导航栏项目点击事件
$(".header-left-nav-list").click(function(){



	var iframeName = $(this).attr("data-page")
	if (iframeName) {
		loadIframe("index-iframe",iframeName)
	} 
	
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
