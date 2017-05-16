var aneObj = function(){
	//start point, control point, end point(sin)
	// this.x = [];
	// this.len = [];
	this.rootx = [];
	this.headx = [];
	this.heady = [];
	this.amp = []; //振幅
	this.alpha = 0;
}
aneObj.prototype.num = 50;
aneObj.prototype.init = function(){
	for (var i = 0; i < this.num; i++) {
		this.rootx[i] = i * 16 + Math.random() * 20; //horizontal position of ane
		this.headx[i] = this.rootx[i];
		this.heady[i] = canHeight - 250 + Math.random() * 50;
		this.amp[i] = Math.random() * 50 + 50; //控制摆动幅度
	}
}
aneObj.prototype.draw = function(){
	this.alpha += deltaTime * 0.0008; //控制摆动速度
	var l = Math.sin(this.alpha); //[-1,1]
	ctx2.save();
	ctx2.globalAlpha = 0.6;
	ctx2.lineWidth = 20;
	ctx2.lineCap = 'round';
	ctx2.strokeStyle = '#3b154e';
	for (var i = 0; i < this.num; i++){
		//beginPath, moveTo, lineTo, strokeStyle, stroke, lineWidth, lineCap, globalAlpha
		ctx2.beginPath();
		ctx2.moveTo(this.rootx[i], canHeight);
		this.headx[i] = this.rootx[i] + l * this.amp[i];
		ctx2.quadraticCurveTo(this.rootx[i], canHeight - 100, this.headx[i], this.heady[i]);
		// ctx2.lineWidth = 20; 		in order to improve the capacity of canvas
		// ctx2.lineCap = 'round';
		// ctx2.strokeStyle = '#3b154e';
		ctx2.stroke();
	}
	ctx2.restore();
}