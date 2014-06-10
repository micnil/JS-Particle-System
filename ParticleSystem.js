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

	draw: function() {

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

	mouseDownListener: function(evt) {
		var i;
		
		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
		var mouseCoords = new Vector(mouseX,mouseY);
		/*
		Below, we find if a shape was clicked. Since a "hit" on a square or a circle has to be measured differently, the
		hit test is done using the hitTest() function associated to the type of particle. This function is an instance method
		for both the SimpleDiskParticle and SimpleSqureParticle classes we have defined with the external JavaScript sources.		
		*/
		for (i=0; i < this.forceFields.length; i++) {
			if (this.forceFields[i].isHit(mouseCoords)) {	
				dragging = true;
				//the following variable will be reset if this loop repeats with another successful hit:
				dragIndex = i;
			}
		}
		
		if (dragging) {
			window.addEventListener("mousemove", mouseMoveListener, false);
			
			//place currently dragged shape on top
			this.forceFields.push(this.forceFields.splice(dragIndex,1)[0]);
			
			//shapeto drag is now last one in array
			dragHoldX = mouseX - shapes[numShapes-1].x;
			dragHoldY = mouseY - shapes[numShapes-1].y;
			
			//The "target" position is where the object should be if it were to move there instantaneously. But we will
			//set up the code so that this target position is approached gradually, producing a smooth motion.
			targetX = mouseX - dragHoldX;
			targetY = mouseY - dragHoldY;
			
			//start timer
			timer = setInterval(onTimerTick, 1000/30);
		}
		canvas.removeEventListener("mousedown", mouseDownListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
		
		//code below prevents the mouse down from having an effect on the main browser window:
		if (evt.preventDefault) {
			evt.preventDefault();
		} //standard
		else if (evt.returnValue) {
			evt.returnValue = false;
		} //older IE
		return false;
	},

	mouseUpListener: function(evt) {
		theCanvas.addEventListener("mousedown", mouseDownListener, false);
		window.removeEventListener("mouseup", mouseUpListener, false);
		if (dragging) {
			dragging = false;
			window.removeEventListener("mousemove", mouseMoveListener, false);
		}
	},

	mouseMoveListener: function(evt) {
		var posX;
		var posY;
		var shapeRad = shapes[numShapes-1].radius;
		var minX = shapeRad;
		var maxX = canvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = canvas.height - shapeRad;
		
		//getting mouse position correctly 
		var bRect = canvas.getBoundingClientRect();
		mouseX = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
		
		//clamp x and y positions to prevent object from dragging outside of canvas
		posX = mouseX - dragHoldX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragHoldY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		targetX = posX;
		targetY = posY;
	},

	moveFields: function(mousePos) {

		for (var i = this.forceFields.length; i < 0; i++) {
			if(this.forceFields[i].pos.distaceFrom(mousePos) <= this.forceFields[i].weight )
				this.forceFields[i].moveTo(mousePos);
		};

		for (var i = this.emitters.length; i < 0; i++) {
			if(this.emitters[i].pos.distaceFrom(mousePos) <= this.emitters[i].weight )
				this.emitters[i].moveTo(mousePos);
		};
	}


}

function eulerStep(state, derivative, dt){
	return state.add(derivative.multiply(dt));

}
