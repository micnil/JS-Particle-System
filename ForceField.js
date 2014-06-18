function ForceField(pos,w,effect){
	this.position = pos || new Vector(0, 0);
	this.weight = w || 10.0;
	this.effect = effect || 1.0;
	this.color = '#660000';
	//this.color = "rgb("+127+effect*127+", "+200+", "+0+")";
}
ForceField.prototype = {

	applyForce : function(particle) { 
		var distance=this.position.distanceFrom(particle.position);
		var repellDirection=particle.position.subtract(this.position);

		if(this.weight/distance>0.001)
			particle.acceleration = particle.acceleration.add(repellDirection.multiply(30*this.weight/(Math.sqrt(distance)*distance))).multiply(this.effect);

		if(distance<=this.weight)
			particle.velocity = particle.velocity.reflect(repellDirection);	
	},

	moveTo : function(dragOff, mouseCoords) {

		var newPosition = mouseCoords.subtract(dragOff);
		var difference = newPosition.subtract(this.position);

		//adding an easing to the movement.
		//difference = newPosition - oldposition;
		// selection is moved to : oldposition + difference * 0.65 (ease amount)
		this.position = this.position.add(difference.multiply(0.65));
	},

	isHit : function(position) {
		return position.distanceFrom(this.position) <= this.weight;
	},

	draw : function(context){

		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.weight, 0, Math.PI * 2);
		context.closePath();
		context.fill();

	}
}