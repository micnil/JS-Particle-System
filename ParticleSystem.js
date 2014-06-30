/** 
*	Particlesystem class, keeps track of all the emitters, forcefields and 
*	particles. is seperable from the anvasManager.
*/
function ParticleSystem(){
	this.particles = new Array();
	this.emitters = new Array();
	this.forceFields = new Array();
	this.shoot=true;
}

ParticleSystem.prototype = {

	update: function(dt) { 

		//shoot particles from emitters
		if(this.shoot == true)
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
		this.emitters.push(new Emitter(new Vector(WIDTH/3, HEIGHT/2),new Vector(1, 1),20.0 ,60.0 ));
		this.forceFields.push(new ForceField(new Vector(2*WIDTH/3, HEIGHT/2),15.0,-1.0));
	},

	draw: function(context, contextLayer) {

		//this will fade away old position when objects move.
		context.fillStyle = "rgba(0, 0, 0, 0.2)";
		context.fillRect(0, 0, WIDTH, HEIGHT);
		contextLayer.clearRect(0, 0, WIDTH, HEIGHT);

		for(var i=0;i<this.particles.length;i++){
			this.particles[i].draw(context);
		}

		for(var i=0;i<this.emitters.length;i++){
			this.emitters[i].draw(contextLayer);
		}

		for(var i=0;i<this.forceFields.length;i++){
			this.forceFields[i].draw(contextLayer);
		}

	},

	getPressedObject: function(mouseCoords) {

		var selectedObject = 0;
		
		for (var i = 0; i < this.forceFields.length; i++) {

			if(this.forceFields[i].isHit(mouseCoords) ){
				selectedObject = this.forceFields[i];
			}
		};

		for (var i = 0; i < this.emitters.length; i++) {
			if(this.emitters[i].isHit(mouseCoords)){
				selectedObject = this.emitters[i];
			}	
		};

		return selectedObject;
	},

	clearParticleSystem: function(){
		while(this.particles.length > 0) {
			this.particles.pop();
		}
		while(this.emitters.length > 0) {
			this.emitters.pop();
		}
		while(this.forceFields.length > 0) {
			this.forceFields.pop();
		}
	},

	createEmitter: function(pos, direction, angle, magnitude, radius){
		this.emitters.push(new Emitter(pos, direction, angle, magnitude, radius));
	},

	createForceField: function(pos, weight, effect){
		this.forceFields.push(new ForceField(pos,weight,effect))

		for (var i = 0; i < this.forceFields.length; i++) {
			console.log("forcefield effect %s: %s",i,this.forceFields[i].effect);
		}
	},

	stopShooting: function(){
		this.shoot=false;
	},
	startShooting: function(){
		this.shoot=true;
	}


}

function eulerStep(state, derivative, dt){
	return state.add(derivative.multiply(dt));

}
