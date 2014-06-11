
function Particle(pos,velocity,acceleration){
	this.position = pos || new Vector(0, 0);
	this.velocity = velocity || new Vector(0, 0);
	this.acceleration = acceleration || new Vector(0, 0);
	this.color = '#00ff00';
}

Particle.prototype = {

	draw: function(context) { 
		context.fillStyle = this.color;
		context.fillRect(this.position.x, this.position.y, 2, 2);
	},

	move: function(dt) {
		this.velocity = eulerStep(this.velocity,this.acceleration,dt);
		this.position = eulerStep(this.position,this.velocity,dt);
	}

}

