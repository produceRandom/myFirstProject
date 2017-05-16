function dustObj(){
	this.x = [];
	this.y = [];
	this.amp = [];
	this.NO = [];

	this.alpha = 0;
	this.num = 30;
}

dustObj.prototype = {
	constructor: 	dustObj,
	init: 			function (){
		for (var i = 0; i < this.num; i++) {
			this.x[i] = Math.random()*canWidth|0;
			this.y[i] = Math.random()*canHeight|0;
			this.amp[i] = 20 + Math.random()*15|0;
			this.NO[i] = Math.random()*7|0;
		};
		// this.alpha = 0;
	},
	draw: 			function (){
		this.alpha += deltaTime * 0.0008;
		var l = Math.sin(this.alpha);
		for (var i = 0; i < this.num; i++) {
			ctx1.drawImage(dustPic[this.NO[i]],this.x[i]+this.amp[i]*l,this.y[i]);
		};
	}
}