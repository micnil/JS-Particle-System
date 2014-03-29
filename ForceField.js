function ForceField(pos,w,effect){
	this.position = pos || new Vector(0, 0);
	this.weight = w || 10.0;
	this.effect = effect || 1.0;
	this.color = '#660000';
	//this.color = "rgb("+127+effect*127+", "+200+", "+0+")";
}
ForceField.prototype = {

	applyForce: function(particle) { 
		var distance=this.position.distanceFrom(particle.position);
		var repellDirection=this.position.subtract(particle.position);

		if(this.weight/distance>0.001)
			particle.acceleration = particle.acceleration.add(repellDirection.multiply(this.weight/distance)).multiply(this.effect);

		if(distance<=this.weight)
			particle.velocity = particle.velocity.reflect(repellDirection);	
	}
}