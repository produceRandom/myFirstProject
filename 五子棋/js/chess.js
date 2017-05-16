var chess = document.getElementById("chess")
var context = chess.getContext("2d")
context.strokeStyle = "#C667E4"
var logo = new Image()
logo.src = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493713024&di=ae282c36b64397be328c23ec09ff88dc&imgtype=jpg&er=1&src=http%3A%2F%2Fimg9.3lian.com%2Fc1%2Fvec2013%2F34%2F61.jpg"
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard()
}
function drawChessBoard(){
	for (var i=0 ; i<15; i++) {
		var x = i*30 + 15
		context.moveTo(x,15)
		context.lineTo(x,435)
		context.moveTo(15,x)
		context.lineTo(435,x)
		context.stroke()
	}
}


