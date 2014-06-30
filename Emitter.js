/** 
*	Emitter class, the particle emitter is rotable and moveable.
*/
function Emitter(pos ,d ,a ,m, r ){

	this.position = pos || new Vector(0, 0);
	this.direction = d || new Vector(0, 0);
	this.angle = a * Math.PI / 180 || 0;
	this.magnitude = m || 0;
	this.radius = r || 20;
	this.color = '#000077';
	this.lineOffset=1;

}
Emitter.prototype = {

	shoot: function() { 
		//wow
		//velocity = the selected direction * a randomized rotation within given angle * the magnitude (speed)
		var velocity = new Vector(this.direction.x,this.direction.y);
		velocity.rotate((Math.random()*2-1)*(this.angle/2));
		velocity = velocity.multiply(this.magnitude);
		return new Particle(this.position,velocity,0);	
	},

	moveTo: function(dragOff, mouseCoords) {
	
		//if rotation
		if(dragOff.getMagnitude()>10){

			if(mouseCoords.equals(this.position))
				return;

			var vec1 = new Vector(dragOff.x,dragOff.y);
			vec1.normalize();

			// vec2 = vector from center of object to the mouse coordinates
			var vec2 = mouseCoords.subtract(this.position);
			// normalized
			vec2.normalize();

			var moveAngle = vec1.getShortestAngleFrom(vec2);

			this.direction.rotate(moveAngle);
			dragOff.rotate(moveAngle);
			
			
		}else{

			var newPosition = mouseCoords.subtract(dragOff);
			var difference = newPosition.subtract(this.position);

			//adding an easing to the movement.
			//difference = newPosition - oldposition;
			// selection is moved to : oldposition + difference * 0.65 (ease amount)
			this.position = this.position.add(difference.multiply(0.65));
			return dragOff;
		}
	},

	isHit: function(position) {
		return position.distanceFrom(this.position) <= this.radius;
	},

	draw: function(context){

		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius-7, 0, Math.PI * 2);
		context.closePath();
		context.fill();

		context.beginPath();
		this.lineOffset=this.lineOffset+0.1;
		
		if (typeof context.setLineDash === 'undefined') { //Firefox
			context.mozDash = [2,1];
			context.mozDashOffset = this.lineOffset;

		}
		else { //Chrome
			context.setLineDash([2,3]);
			context.lineDashOffset = this.lineOffset;
		}

		var angleToShootingDirection = this.direction.getShortestAngleFrom(new Vector(1,0));
		context.arc(this.position.x,
			this.position.y, 
			this.radius, 
			-angleToShootingDirection + (this.angle+0.03), 
			(Math.PI * 2) - angleToShootingDirection - (this.angle+0.03));

		context.strokeStyle = this.color;
		context.stroke();
	}

	
}