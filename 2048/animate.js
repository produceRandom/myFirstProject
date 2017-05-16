		//生成随机数动画
		function showNumber(i,j,ranNumber){
			var numberCell = $("#number-cell-flag-"+ i + "-" + j)
			numberCell.css("background",getNumberBackGroundColor(ranNumber))
			numberCell.css("color",getNumberColor(ranNumber))
			numberCell.text(ranNumber)
			numberCell.animate({
				width:"20vmin",
				height:"20vmin",
				left:getPosLeft(i,j)+"vmin",
				top:getPosTop(i,j)+"vmin"
			},200)
		}	
		
		
		//移动动画
		function showMoveAnimation(fromx,fromy,tox,toy){
			var numberCell = $("#number-cell-flag-"+ fromx + "-" + fromy)
			numberCell.animate({
				left:getPosLeft(tox,toy)+"vmin",
				top:getPosTop(tox,toy)+"vmin"
			},200)
			
		}