function ForceField(pos,w){
	this.position = pos || new Vector(0, 0);
	this.weight = w || 1.0;
	this.color = '#330000';
}
ForceField.prototype = {

	repell: function(particle) { 
		var distance=this.position.distanceFrom(particle.position);
		var repellDirection=this.position.subtract(particle.position);

		if(this.weight/distance>0.001)
			particle.acceleration = particle.acceleration.add(repellDirection.multiply(this.weight/distance));

	}
}