
/** Vector math, used for position, velocity and acceleration
*	Could get quite ugly for efficiency reasons
*/
function Vector(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype = {

	add: function(vector) { 
		return new Vector(vector.x + this.x ,vector.y + this.y);
	},
	subtract: function(vector) { 
		return new Vector(vector.x - this.x ,vector.y - this.y);
	},
	multiply: function(scalar){
		return new Vector(this.x * scalar, this.y * scalar);
	},
	rotate: function(angle) {

		var R=[Math.cos(angle * Math.PI / 180), -Math.sin(angle * Math.PI / 180),
				Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180)];

		var newPosX=this.x*R[0] + this.y*R[1];
		var newPosY=this.x*R[2] + this.y*R[3];	

		// this.x=newPosX;
		// this.y=newPosY; 
		return new Vector(newPosX,newPosY)
	},
	normalize: function(vector) { 
		this.x = this.x / Math.sqrt(this.x*this.x + this.y*this.y);
		this.y = this.y / Math.sqrt(this.x*this.x + this.y*this.y);
	},
	distanceFrom: function(vector) { 
		
		return Math.sqrt((vector.x - this.x)*(vector.x - this.x) + (vector.y - this.y)*(vector.y - this.y));
	},
}