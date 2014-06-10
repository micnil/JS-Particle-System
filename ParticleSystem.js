function ParticleSystem(){
      this.particles = new Array();
      this.emitters = new Array();
      this.forceFields = new Array();
}

ParticleSystem.prototype = {

	update: function(dt) { 

		//shoot particles from emitters
		for(var i=0;i<this.emitters.length;i++)
			this.particles.push(this.emitters[i].shoot());

		// reset acceleration
		for(var i=0;i<this.particles.length;i++)
			this.particles[i].acceleration=new Vector(0,0);

		//update acceleration depending on distance to forcefields
		for(var i=0;i<this.forceFields.length;i++)
			for(var j=0;j<this.particles.length;j++){
				this.forceFields[i].applyForce(this.particles[j]);
			}
		//move the particles (update velocity & position)
		for(var i=0;i<this.particles.length;i++)
			this.particles[i].move(dt);
		
	},

	init: function() {
		this.emitters.push(new Emitter(new Vector(WIDTH/2, HEIGHT/2),new Vector(1, 1),20.0 ,60.0 ));
		//this.emitters.push(new Emitter(new Vector(WIDTH/3, HEIGHT/2),new Vector(1, -1),20.0 ,60.0 ));
		this.forceFields.push(new ForceField(new Vector(3*WIDTH/4, HEIGHT/2),15.0,-1.0));
		this.forceFields.push(new ForceField(new Vector(WIDTH/2, 3*HEIGHT/4),15.0));
	},

	draw: function(context) {

		context.fillStyle = "rgba(0, 0, 0, 0.2)";
		context.fillRect(0, 0, WIDTH, HEIGHT);

		for(var i=0;i<this.particles.length;i++){

		context.fillStyle = this.particles[i].color;
		context.fillRect(this.particles[i].position.x, this.particles[i].position.y, 2, 2);

		}

		for(var i=0;i<this.emitters.length;i++){
			context.fillStyle = this.emitters[i].color;
			context.beginPath();
			context.arc(this.emitters[i].position.x, this.emitters[i].position.y, 15, 0, Math.PI * 2);
			context.closePath();
			context.fill();
		}

		for(var i=0;i<this.forceFields.length;i++){
			context.fillStyle = this.forceFields[i].color;
			context.beginPath();
			context.arc(this.forceFields[i].position.x, this.forceFields[i].position.y, this.forceFields[i].weight, 0, Math.PI * 2);
			context.closePath();
			context.fill();
		}

	},

	getPressedObject: function(mouseCoords) {
		console.log("GetPressedObject()");
		console.log("forceFields.length = %s", this.forceFields.length);
		var selectedObject = 0;
		for (var i = 0; i < this.forceFields.length; i++) {

			if(this.forceFields[i].isHit(mouseCoords) ){
				console.log("forceField is Hit!");
				selectedObject = this.forceFields[i];
			}
		};
		console.log("emitters.length = %s", this.emitters.length);
		for (var i = 0; i < this.emitters.length; i++) {
			if(this.emitters[i].isHit(mouseCoords)){
				console.log("emitter is Hit!");
				selectedObject = this.emitters[i];
			}	
		};

		return selectedObject;
	}


}

function eulerStep(state, derivative, dt){
	return state.add(derivative.multiply(dt));

}
