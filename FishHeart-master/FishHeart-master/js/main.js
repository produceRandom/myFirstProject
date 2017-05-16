var canvas1, canvas2;
var ctx1, ctx2;
var lastTime, nowTime, deltaTime;

var canWidth, canHeight;
var bgImg = new Image();

var ane;
var fruit;
var mom;

var mx, my;

var baby;
var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOra = [];
var momBodyBlue = [];

var data;

var wave;
var halo;

var dust;
var dustPic = [];

document.body.onload = game;
function game() {
	init();
	lastTime = Date.now();
	deltaTime = 0;
	gameloop();

}

function init() {
	//get canvas context
	canvas1 = document.getElementById('canvas1'); //fishes, dust, UI, circle
	ctx1 = canvas1.getContext('2d'); //this code just like we have got a pen to draw
	canvas2 = document.getElementById('canvas2'); //background, ane, fruites
	ctx2 = canvas2.getContext('2d');
 	
	canvas1.addEventListener('mousemove', onMouseMove, false);

	bgImg.src = './src/background.jpg';
	canWidth = canvas1.width;
	canHeight = canvas1.height;

	ane = new aneObj();
	ane.init();
	fruit = new fruitObj();
	fruit.init();
	mom = new momObj();
	mom.init();

	baby = new babyObj();
	baby.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;

	for (var i = 0; i < 8; i++) {
		babyTail[i] = new Image();
		babyTail[i].src = './src/babyTail' + i + '.png';
	}
	for (var i = 0; i < 2; i++) {
		babyEye[i] = new Image();
		babyEye[i].src = './src/babyEye' + i + '.png';
	}
	for (var i = 0; i < 20; i++) {
		babyBody[i] = new Image();
		babyBody[i].src = './src/babyFade' + i + '.png';
	}
	for (var i = 0; i < 8; i++) {
		momTail[i] = new Image();
		momTail[i].src = './src/bigTail' + i  + '.png';
	}
	for (var i = 0; i < 2; i++) {
		momEye[i] = new Image();
		momEye[i].src = './src/bigEye' + i + '.png';
	}
	data = new dataObj();
	for (var i = 0; i < 8; i++){
		momBodyOra[i] = new Image();
		momBodyBlue[i] = new Image();
		momBodyOra[i].src = './src/bigSwim' + i + '.png';
		momBodyBlue[i].src = './src/bigSwimBlue' + i + '.png';
	}
	ctx1.fillStyle = 'white';
	ctx1.font = '30px Verdana';
	ctx1.textAlign = 'center';

	wave = new waveObj();
	wave.init();

	halo = new haloObj();
	halo.init();

	for (var i = 0; i < 7; i++) {
		dustPic[i] = new Image();
		dustPic[i].src = "./src/dust" + i + ".png";
	};

	dust = new dustObj();
	dust.init();
}
function gameloop() {
	requestAnimationFrame(gameloop);

	now = Date.now();
	deltaTime = now - lastTime;
	lastTime = now;
	if (deltaTime > 40) {
		deltaTime = 40;		//为了让游览器缩小时候果实变得过大
	}

	drawBackground();
	ane.draw();
	fruitMonitor();
	fruit.draw();

	ctx1.clearRect(0, 0, canWidth, canHeight);
	mom.draw();
	baby.draw();
	momFruitsCollision();
	momBabyCollision();

	data.draw();
	wave.draw();
	halo.draw();
	dust.draw();
}
function onMouseMove(e) {
	if (!data.gameOver) {
		if (e.offSetX || e.layerX) { //if we can monitor mouse position
			// clientX:相对于客户区域的x坐标位置，不包括滚动条，就是正文区域。 
			// offsetx：设置或者是得到鼠标相对于目标事件的父元素的内边界在x坐标上的位置。 
			// screenX:相对于用户屏幕
			// layerX:FF特有
			mx = e.offSetX == undefined ? e.layerX : e.offSetX;
			my = e.offSetY == undefined ? e.layerY : e.offSetY;
		}
	}
	
}