
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
		return new Vector(this.x - vector.x ,this.y - vector.y);
	},
	multiply: function(scalar){
		return new Vector(this.x * scalar, this.y * scalar);
	},
	rotate: function(angle) {

		var R=[Math.cos(angle * Math.PI / 180), -Math.sin(angle * Math.PI / 180),
				Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180)];

		var newPosX=this.x*R[0] + this.y*R[1];
		var newPosY=this.x*R[2] + this.y*R[3];	

		return new Vector(newPosX,newPosY)
	},
	normalize: function() { 
		this.x = this.x / Math.sqrt(this.x*this.x + this.y*this.y);
		this.y = this.y / Math.sqrt(this.x*this.x + this.y*this.y);
	},
	distanceFrom: function(vector) { 
		
		return Math.sqrt((vector.x - this.x)*(vector.x - this.x) + (vector.y - this.y)*(vector.y - this.y));
	},
	reflect: function(vector) { 
		
		var incoming = this.invertDirection();
		var project = incoming.projectOn(vector);
		var reflection = project.subtract(incoming).multiply(2.0).add(incoming);
		return reflection;
	},
	invertDirection: function() { 
		
		return new Vector(-this.x,-this.y);
	},
	projectOn: function(vector) { 
		
		var p = (this.x*vector.x + this.y*vector.y) / (vector.x*vector.x + vector.y*vector.y);
		return new Vector(p*vector.x,p*vector.y);
	},
}