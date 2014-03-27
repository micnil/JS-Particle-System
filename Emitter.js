function Emitter(pos ,d ,a ,m ){

	this.position = pos || new Vector(0, 0);
	this.direction = d || new Vector(0, 0);
	this.angle = a || 0;
	this.magnitude = m || 0;
	this.color = '#000033';

}
Emitter.prototype = {

	shoot: function() { 
		//wow
		//velocity = the selected direction * a randomized rotation within given angle * the magnitude (speed)
		var velocity = this.direction.rotate((Math.random()*2-1)*(this.angle/2)).multiply(this.magnitude);
		//console.log("Shot a particle with velocity: [ %s, %s ]", velocity.x,velocity.y);
		return new Particle(this.position,velocity,0);	
	}
}