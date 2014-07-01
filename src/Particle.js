
function Particle(pos,velocity,acceleration){
	Particle.numOfParticles++;
	this.id=Particle.numOfParticles;
	this.position = pos || new Vector(0, 0);
	this.velocity = velocity || new Vector(0, 0);
	this.acceleration = acceleration || new Vector(0, 0);
	this.color = '#00ff00';
}

Particle.numOfParticles = 0;

Particle.prototype = {

	draw: function(context) { 
		context.fillStyle = this.color;
		context.fillRect(this.position.x, this.position.y, 2, 2);
	},

	move: function(dt) {
		this.velocity = eulerStep(this.velocity,this.acceleration,dt);
		this.position = eulerStep(this.position,this.velocity,dt);

	},
	isOutOfBounds: function(){

		if(this.position.x < -50 || this.position.x>(WIDTH+50))
			return true;
		if(this.position.y < -50 || this.position.y>(HEIGHT+50))
			return true;

		return false;
	}
}

