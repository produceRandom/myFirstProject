
		
		window.onload = function(){
			//初始化
			//newGame();
			//随机生成两个子
			newGame();

		}
		function newGame(){
			if (localStorage.getItem("heightScope") != null) {
				var heightScope = localStorage.getItem("heightScope")
				$("label").text(heightScope)
			}
			init();
			generateOneNumber();
			generateOneNumber();
			
		}
		function init(){
			//16个格子循环出来并赋予坐标类名
			for (var i=0;i <15;i++){
					var clone = $(".grid-cell:last").clone();
					$(".grid-cell:last").after(clone);
			}
			var index = 0
			for (var x=0;x<4;x++) {
				for (var y=0;y<4;y++) {
					$(".grid-cell:eq(" + index + ")").addClass("grid-cell-flag" + "-" + x + "-" + y)
					index++
				}
			}
			for (var i=0;i <4;i++){
				for (var j=0;j<4;j++) {
					$(".grid-cell-flag" + "-" + i + "-" + j).css("left",getPosLeft(i,j)+"vmin");
					$(".grid-cell-flag" + "-" + i + "-" + j).css("top",getPosTop(i,j)+"vmin");
				}
	
			}
			
			for(var i=0; i<4;i++){
				board[i] = []
				alreadyAdd[i] = []
				for (var j=0; j<4; j++) {
					board[i][j] = 0;
					alreadyAdd[i][j] = false
				}
			}
			updateBoardView();
			score = 0;
	    	updateScore(score)
		}
		function updateBoardView(){
			$(".number-cell").remove();
			for(var i=0; i<4; i++){
				for (var j=0; j<4; j++) {
					$(".grid-container").append("<div class='number-cell' id='number-cell-flag-"+ i + "-" + j + "' ></div>")
					var theNumberCell = $("#number-cell-flag-"+ i + "-" + j)
					if ( board[i][j] == 0) {
						theNumberCell.css("width","0px")
						theNumberCell.css("height","0px")
						theNumberCell.css("left",(getPosLeft(i,j)+10)+"vmin");
						theNumberCell.css("top",(getPosTop(i,j)+10)+"vmin");

					} else{
						theNumberCell.css("width","20vmin")
						theNumberCell.css("height","20vmin")
						theNumberCell.css("left",getPosLeft(i,j)+"vmin");
						theNumberCell.css("top",getPosTop(i,j)+"vmin");
						theNumberCell.css("background",getNumberBackGroundColor(board[i][j]))
						theNumberCell.css("color",getNumberColor(board[i][j]))
						theNumberCell.text(board[i][j])
					}
					alreadyAdd[i][j] = false
				}
			}
			

		}

		
		function generateOneNumber(){
			if (nospace(board)) {
				return false;
			}else{
				//随机一个位置
				var ranx = parseInt(Math.floor(Math.random()*4))
				var rany = parseInt(Math.floor(Math.random()*4))
				
				var times = 0
				while(times < 50){
					if (board[ranx][rany] == 0) {
						break;
					} else{
						var ranx = parseInt(Math.floor(Math.random()*4))
						var rany = parseInt(Math.floor(Math.random()*4))
						times++
					}
				}
				if (times == 50) {
					for (var i=0 ; i<4;i++) {
						for (var j=0;j<4;j++) {
							if (board[i][j] == 0) {
								ranx = i;
								rany = j;
							}
						}
					}
				}
				
				//随机一个数字
				var ranNumber = Math.random()<0.5?2:4
				//在随机位置显示数字
				board[ranx][rany] = ranNumber
				showNumber(ranx,rany,ranNumber)
				return true
			}
			
		}
		function canMoveLeft(board){
			for(var i=0; i<4; i++){
				for (var j=1; j<4; j++) {
					if (board[i][j] != 0) {
						if (board[i][j-1] == 0 || board[i][j-1] == board[i][j]) {
							return true
						} 
					} 	
				}
			}
			return false;
		}	
		function canMoveRight(board){
			for(var i=0; i<4; i++){
				for (var j=2; j>=0; j--) {
					if (board[i][j] !=0) {
						if (board[i][j+1] == 0 || board[i][j+1] == board[i][j]) {
							return true
						} 
					} 	
				}
			}
			return false;
		}	
		function canMoveUp(board){
			for(var j=0; j<4; j++){
				for (var i=1; i<4; i++) {
					if (board[i][j] != 0) {
						if (board[i-1][j] == 0 || board[i-1][j] == board[i][j]) {
							return true
						} 
					} 	
				}
			}
			return false;
		}
		function canMoveDown(board){
			for(var j=0; j<4; j++){
				for (var i=2; i>=0; i--) {
					if (board[i][j] != 0) {
						if (board[i+1][j] == 0 || board[i+1][j] == board[i][j]) {
							return true
						} 
					} 	
				}
			}
			return false;
		}
		//判读水平移动过程中有无障碍物
		function noBlock(row,col1,col2,board){
			for (var i = col1+1;i<col2;i++) {
				if (board[row][i] != 0) {
					return false
				}
			}
			return true;
		}
		//判读垂直移动过程中有无障碍物
		function noBlock_ver(col,row1,row2,board){
			for (var i = row1+1;i<row2;i++) {
				if (board[i][col] != 0) {
					return false
				}
			}
			return true;
		}

