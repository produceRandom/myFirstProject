var babyObj = function(){
	this.x;
	this.y;
	this.angle;
	this.babyBody = new Image();

	this.babyTailTimer = 0;
	this.babyTailCount = 0;
	this.babyEyeTimer = 0;
	this.babyEyeCount = 0;
	this.babyEyeInterval = 1000;
	this.babyBodyTimer = 0;
	this.babyBodyCount = 0;
}
babyObj.prototype.init = function(){
	this.x = canWidth * 0.5 - 50;
	this.y = canHeight * 0.5 + 50;
	this.babyBody.src = './src/babyFade0.png';
	this.angle = 0;
}
babyObj.prototype.draw = function(){

	this.x = lerpDistance(mom.x, this.x, 0.996);
	this.y = lerpDistance(mom.y, this.y, 0.996);

	var deltaY = mom.y - this.y;
	var deltaX = mom.x - this.x;
	var beta = Math.atan2(deltaY,deltaX) + Math.PI; //-PI ~ PI
	//lerp angle
	this.angle = lerpAngle(beta, this.angle, 0.6);

	this.babyTailTimer += deltaTime;
	if (this.babyTailTimer > 50) {
		this.babyTailCount = (this.babyTailCount + 1) % 8; //0 - 7
		this.babyTailTimer %= 50;
	}

	//baby eye
	this.babyEyeTimer += deltaTime;
	if (this.babyEyeTimer > this.babyEyeInterval) {
		this.babyEyeCount = (this.babyEyeCount + 1) % 2;
		this.babyEyeTimer %= this.babyEyeInterval;
		if (this.babyEyeCount != 1) {
			this.babyEyeInterval = Math.random() * 1500 + 2000; //[2s,3.5s)
		}else{
			this.babyEyeInterval = 200;
		}
	}
	//bady body
	this.babyBodyTimer += deltaTime;
	if (this.babyBodyTimer > 300) {
		this.babyBodyCount = this.babyBodyCount + 1;
		if (this.babyBodyCount > 19){
			this.babyBodyCount = 19;
			//game over;
			data.gameOver = true;
		}
		this.babyBodyTimer = 0; //或者this.badyBodyTimer %= 300;
	}
	//ctx1
	ctx1.save();
	ctx1.translate(this.x, this.y);
	ctx1.rotate(this.angle);

	var babyTailCount = this.babyTailCount;
	ctx1.drawImage(babyTail[babyTailCount], -babyTail[babyTailCount].width * 0.5 + 23, -babyTail[babyTailCount].height * 0.5); //先画的在下面
	var babyBodyCount = this.babyBodyCount;
	ctx1.drawImage(babyBody[babyBodyCount], -babyBody[babyBodyCount].width * 0.5, -babyBody[babyBodyCount].height * 0.5);
	var babyEyeCount = this.babyEyeCount;
	ctx1.drawImage(babyEye[babyEyeCount], -babyEye[babyEyeCount].width * 0.5, -babyEye[babyEyeCount].height * 0.5);
	ctx1.restore();
}