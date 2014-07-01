/* 
*	Forcefield class, can act as a particle puller (gravity, effect=-1) and as
*	a pusher (effect=1).
*/
function ForceField(pos,w,effect, r){
	this.position = pos || new Vector(0, 0);
	this.weight = w || 10.0;
	this.effect = effect || 1.0;
	this.radius = r || 20;
	
	//color depends on effect (puller or pusher)
	var color = 127 + (effect*127);
	this.color = "rgb("+color+",150, 0)";
}
ForceField.prototype = {

	applyForce : function(particle) { 
		var distance = this.position.distanceFrom(particle.position);

		//force direction depends on effect
		var forceDirection
		if(this.effect==1)
			forceDirection = particle.position.subtract(this.position);
		else
			forceDirection = this.position.subtract(particle.position);

		forceDirection.normalize();

        var force = this.weight / Math.pow((distance+this.weight/2+distance+this.weight/2),1.5);
        if(distance > this.radius-2)
        	particle.acceleration = particle.acceleration.add(forceDirection.multiply(3000*force));

		if(distance<=this.radius)
			particle.velocity = particle.velocity.reflect(forceDirection);	
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
		return position.distanceFrom(this.position) <= this.radius;
	},

	draw : function(context){

		var grd=context.createRadialGradient(this.position.x,this.position.y,0,this.position.x,this.position.y,this.radius);
		grd.addColorStop(0,"white");
		grd.addColorStop(1, this.color);

		context.fillStyle=grd;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();

	}
}