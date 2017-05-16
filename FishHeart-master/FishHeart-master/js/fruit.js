var fruitObj = function(){
	this.alive = []; //bool
	this.x = [];
	this.y = [];
	this.aneNO = [];
	this.l = [];
	this.spd = []; //the speed of born and float
	this.fruitType = [];
	this.orange = new Image();
	this.blue = new Image();
}
fruitObj.prototype.num = 30;
fruitObj.prototype.init = function(){
	for (var i = 0; i < this.num; i++) {
		this.alive[i] =	false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.aneNO[i] = 0;
		this.spd[i] = Math.random() * 0.017 + 0.003; //[0.003, 0.02)
		// this.born(i);
		this.fruitType[i] = '';
	}
	this.orange.src = './src/fruit.png';
	this.blue.src = './src/blue.png'
}

fruitObj.prototype.draw = function(){
	for (var i = 0; i < this.num; i++) {
		//draw 
		//find an ane, grow, fly up
		if (this.alive[i]) {
			if (this.fruitType[i] == 'blue') {
				var pic = this.blue;
			}else{
				var pic = this.orange;
			}
			if (this.l[i] <= 14) { //grow
				var NO = this.aneNO[i];
				this.x[i] = ane.headx[NO];
				this.y[i] = ane.heady[NO];
				this.l[i] += this.spd[i] * deltaTime;
			}else{
				this.y[i] -= this.spd[i] * 7 * deltaTime;
			}
			ctx2.drawImage(pic, this.x[i] - this.l[i] * 0.5, this.y[i] - this.l[i] * 0.5, this.l[i], this.l[i]);//cause the start position of function drawImage is (0,0), and image have witdh and height, so we have to delete a half height and witdh of orange
			if (this.y[i] < 10) {
				this.alive[i] = false;
			}
		}	
	}
}

fruitObj.prototype.born = function(i){
	this.aneNO[i] = Math.floor(Math.random() * ane.num);
	this.l[i] = 0;
	this.alive[i] = true;
	var ran = Math.random();
	if (ran < 0.3) {
		this.fruitType[i] = 'blue';
	}else{
		this.fruitType[i] = 'orange';
	}
	
}
fruitObj.prototype.dead = function(i){
	this.alive[i] = false;
}

function fruitMonitor() {
	var num = 0;
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) {
			num ++;
		}
	}
	if (num < 15) {
		sendFruit();
		return;
	}
}
function sendFruit() {
	for (var i = 0; i < fruit.num; i++) {
		if (!fruit.alive[i]) {
			fruit.born(i);
			return;
		}
	}
}