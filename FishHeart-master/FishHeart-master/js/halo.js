var haloObj = function(){
	this.x = [];
	this.y = [];
	this.alive =[];
	this.r = [];
}
haloObj.prototype.num = 1;
haloObj.prototype.init = function(){
	for (var i = 0; i < this.num; i++) {
		this.x[i] = 0;
		this.y[i] = 0;
		this.alive[i] = false;
		this.r[i] = 0;
	}
}
haloObj.prototype.draw = function(){
	ctx1.save();
	ctx1.lineWidth = 2;
	ctx1.shadowBlur = 10;
	ctx1.shadowColor = 'rgba(203, 91, 0, 1)';
	for (var i = 0; i < this.num; i++) {
		if (this.alive[i]) {
			//draw
			this.r[i] += deltaTime * 0.01;
			if (this.r[i] > 100) {
				this.alive[i] = false;
				continue;
			}
			var alpha = 1 - this.r[i] / 100;
			ctx1.beginPath();
			ctx1.arc(this.x[i], this.y[i], this.r[i], 0, Math.PI * 2);
			ctx1.strokeStyle = 'rgba(203, 91, 0,' + alpha + ')';
			ctx1.stroke();
		}
	}
	ctx1.restore();
}
haloObj.prototype.born = function(x, y){
	for (var i = 0; i < this.num; i++) {
		if (!this.alive[i]) {
			this.x[i] = x;
			this.y[i] = y;
			this.r[i] = 10;
			this.alive[i] = true;
			return ;
		}
	}
	// 当前num个都在绘制中，添加下一个
	// 偷懒不大改，最好的做法应该是num初始为0，在需要时创建，在结束时删除
	this.x[this.num] = x;
	this.y[this.num] = y;
	this.r[this.num] = 10;
	this.alive[this.num++]=true;
}