		//数据变量
		var board = [];
		var score = 0;

		var alreadyAdd = []
		
		var startx = 0;
		var starty = 0;
		var endx = 0;
		var endy = 0;
		//主函数
		function getPosTop(i,j){
			return 4 + i*24
		}
		function getPosLeft(i,j){
			return 4 + j*24
		}
		function updateScore(score){
			$("span").text(score)
		}
		

		//不同数值的颜色
		function getNumberBackGroundColor(number){
			switch(number){
				case 2:return "#eee4da";break;
				case 4:return "BurlyWood";break;
				case 8:return "Crimson";break;
				case 16:return "Darkorange";break;
				case 32:return "Gold";break;
				case 64:return "Aquamarine";break;
				case 128:return "#63f9f9";break;
				case 256:return "DarkViolet";break;
				case 512:return "GreenYellow";break;
				case 1024:return "Aqua";break;
				case 2048:return "Magenta";break;
				case 4096:return "#0000ff";break;
				case 8192:return "#9c0bfd";break;
			}
			return "black"
		}
		function getNumberColor(number){
			if (number <= 4) {
				return "#776e65"
			} else{
				return "white"
			}
		}
		function nospace(board){
			for (var i=0;i<4;i++) {
				for (var j=0;j<4;j++) {
					if (board[i][j] == 0) {
						return false
					} 
				}
			}
			return true;
		}
		//键盘响应事件  37-left  38-up  39-right 40-down
		$(document).keydown(function(event){
			switch (event.keyCode){
				case 37:if (moveLeft()) {
							setTimeout("generateOneNumber()",250);
							setTimeout("gameOver()",400);
							
						}
					break;
				case 38:if (moveUp()) {
							setTimeout("generateOneNumber()",250);
							setTimeout("gameOver()",400);
						}
					break;
				case 39:if (moveRight()) {
							setTimeout("generateOneNumber()",250);
							setTimeout("gameOver()",400);
						}
					break;
				case 40:if (moveDown()) {
							setTimeout("generateOneNumber()",250);
							setTimeout("gameOver()",400);
						}
					break;
				default:
					break;
			}
		})
		//触摸事件
		document.addEventListener("touchstart",function(event){
			startx = event.touches[0].pageX;
			starty = event.touches[0].pageY;

		})

		document.addEventListener("touchend",function(event){
			endx = event.changedTouches[0].pageX;
			endy = event.changedTouches[0].pageY;
			var deltax = endx - startx;
			var deltay = endy - starty;
			var documentWidth = window.screen.availWidth
			if ((Math.abs(deltax) < 0.1*documentWidth) && (Math.abs(deltay) < 0.1*documentWidth))  {
				return;
			} 
			if (Math.abs(deltax) > Math.abs(deltay)) {
				if (deltax > 0) {
					if (moveRight()) {
						setTimeout("generateOneNumber()",250);
						setTimeout("gameOver()",400);
					}
				} else{
					if (moveLeft()) {
						setTimeout("generateOneNumber()",250);
						setTimeout("gameOver()",400);
					}					
				}
			} else{
				if (deltay > 0) {
					if (moveDown()) {
						setTimeout("generateOneNumber()",250);
						setTimeout("gameOver()",400);
					}					
				} else{
					if (moveUp()) {
						setTimeout("generateOneNumber()",250);
						setTimeout("gameOver()",400);						
					}
				}
			}
		})
		
		function gameOver(){
		    if(nospace(board)&&nomove(board)){
		    	
		    	if (localStorage.getItem("heightScope") != null) {
		    		var heightScope = localStorage.getItem("heightScope")
		    		if (score > heightScope) {
		    			localStorage.setItem("heightScope",score)
		    		}
		    	} else{
		    		localStorage.setItem("heightScope",score)
		    		$("label").text(score)
		    	}
		    	alert("拜拜~~~，你挂了，你的分数是"+score+"分")

		    }
		}
		function nomove(board){
		    if( canMoveUp(board)||
		    	canMoveDown(board) ||
		    	canMoveLeft(board) ||
		    	canMoveRight(board) 
		    	 ){
		    	return false;
		    }

	    	
	    	return true;
		    
		}
		function moveLeft(){
			if (canMoveLeft(board)) {
				//左移
				for(var i=0; i<4; i++){
					for (var j=1; j<4; j++) {
						if (board[i][j] != 0) {
							for (var k=0;k<j;k++) {
								if (board[i][k] ==0 && noBlock(i,k,j,board)) {
									//移动
									
									showMoveAnimation(i,j,i,k)
									board[i][k] = board[i][j]
									board[i][j] = 0
									continue
								} else if(board[i][k] == board[i][j] && noBlock(i,k,j,board) && !alreadyAdd[i][k]){
									//移动
									showMoveAnimation(i,j,i,k)
									//叠加
									board[i][k] += board[i][j]
									board[i][j] = 0
									//加分
									score += board[i][k]
									updateScore(score)
									alreadyAdd[i][k] = true
									continue
								}
							}
						} 	
					}
				}			
				setTimeout('updateBoardView()',200)
				return true;
			} else{
				return false;
			}
		}
		function moveRight(){
			if (canMoveRight(board)) {
				//右移
				for(var i=0; i<4; i++){
					for (var j=2; j>=0; j--) {
						if (board[i][j] != 0) {
							for (var k=3;k>j;k--) {
								if (board[i][k] ==0 && noBlock(i,j,k,board)) {
									//移动
									
									showMoveAnimation(i,j,i,k)
									board[i][k] = board[i][j]
									board[i][j] = 0
									continue
								} else if(board[i][k] == board[i][j] && noBlock(i,j,k,board) && !alreadyAdd[i][k]){
									//移动
									showMoveAnimation(i,j,i,k)
									//叠加
									board[i][k] += board[i][j]
									board[i][j] = 0
									//加分
									score += board[i][k]
									updateScore(score)
									alreadyAdd[i][k] = true
									continue
								}
							}
						} 	
					}
				}			
				setTimeout('updateBoardView()',200)
				return true;
			} else{
				return false;
			}
		}
		function moveUp(){
			if (canMoveUp(board)) {
				//上移
				for(var j=0; j<4; j++){
					for (var i=1; i<4; i++) {
						if (board[i][j] != 0) {
							for (var k=0;k<i;k++) {
								if (board[k][j] ==0 && noBlock_ver(j,k,i,board)) {
									//移动
									
									showMoveAnimation(i,j,k,j)
									board[k][j] = board[i][j]
									board[i][j] = 0
									continue
								} else if(board[k][j] == board[i][j] && noBlock_ver(j,k,i,board) && !alreadyAdd[k][j]){
									//移动
									showMoveAnimation(i,j,k,j)
									//叠加
									board[k][j] += board[i][j]
									board[i][j] = 0
									//加分
									score += board[k][j]
									updateScore(score)	
									alreadyAdd[k][j] = true
									continue
								}
							}
						} 	
					}
				}			
				setTimeout('updateBoardView()',200)
				return true;
			} else{
				return false;
			}
		}
		function moveDown(){
			if (canMoveDown(board)) {
				//下移
				for(var j=0; j<4; j++){
					for (var i=2; i>=0; i--) {
						if (board[i][j] != 0) {
							for (var k=3; k>i;k--) {
								if (board[k][j] == 0 && noBlock_ver(j,i,k,board)) {
									//移动
									showMoveAnimation(i,j,k,j)
									board[k][j] = board[i][j]
									board[i][j] = 0
									continue
								}
								else if(board[k][j] == board[i][j] && noBlock_ver(j,i,k,board) && !alreadyAdd[k][j]){
									//移动
									showMoveAnimation(i,j,k,j)
									//叠加
									board[k][j] += board[i][j]
									board[i][j] = 0
									//加分
									score += board[k][j]
									updateScore(score)	
									alreadyAdd[k][j] = true
									continue
								}
							}
						} 	
					}
				}			
				setTimeout('updateBoardView()',200)
				return true;
			} else{
				return false;
			}
		}