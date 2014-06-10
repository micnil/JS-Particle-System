var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
function CanvasManager(canvas, ps){

	this.canvas = canvas;
	this.canvas.width = WIDTH;
	this.canvas.height = HEIGHT;
	this.ctx = canvas.getContext('2d');

	this.particleSystem = ps || new ParticleSystem();

	// **** Keep track of state! ****

	this.dragging = false; // Keep track of when we are dragging
	// the current selected object. In the future we could turn this into an array for multiple selection
	this.selection = null;
	// See mousedown and mousemove events for explanation
	this.dragOff = new Vector();

	// **** Keep track of events! ****

	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	canvas.addEventListener('mousedown', this.mouseDownListener.bind(this), false);
	canvas.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
	canvas.addEventListener('mouseup', this.mouseUpListener.bind(this), false)


}
CanvasManager.prototype = {

	mouseDownListener : function(e) {
		//console.log(this);
		var mouseCoords = this.getMouseCoords(e);

		var mySel = this.particleSystem.getPressedObject(mouseCoords);
		console.log(mySel);
		if (mySel) {
			// Keep track of where in the object we clicked
			// so we can move it smoothly (see mousemove)
			this.dragOff = mouseCoords.subtract(mySel.position);
			this.dragging = true;
			this.selection = mySel;

			return;
		}
		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (this.selection) {
			this.selection = null;
		}
	},

	mouseMoveListener : function(e) {
		if (this.dragging){
			console.log("selection: %s",this.selection);
			var mouseCoords = this.getMouseCoords(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			this.selection.position = mouseCoords.subtract(this.dragOff);
			console.log("this.dragOff.x: %s",this.dragOff.x);
			console.log("this.selection.position.x: %s",this.selection.position.x);
			//this.selection.position = mouseCoords;
			console.log("selection.position: %s",this.selection.position);
		}
	},

	mouseUpListener :  function(e) {
		this.dragging = false;
	},

	getMouseCoords : function(e) {
  		//getting mouse position correctly 
  		var bRect = this.canvas.getBoundingClientRect();
  		mouseX = (e.clientX - bRect.left)*(WIDTH/bRect.width);
  		mouseY = (e.clientY - bRect.top)*(HEIGHT/bRect.height);
  		var mouseCoords = new Vector(mouseX,mouseY);
  		return mouseCoords;
  	},

  	startAnimationLoop : function() {

  		var lastCall = this.timestamp();
  		var accum = 0;
  		var dt = 1 / 60;
  		fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });
  		myCanvasManager = this;

  		function loop(){
  			fpsmeter.tickStart();
  			var delta = (myCanvasManager.timestamp() - lastCall)/1000;
  			lastCall = myCanvasManager.timestamp();
  			accum += delta;

  			while (accum >= dt) {

				// Update the game's internal state (i.e. physics, logic, etc)
				myCanvasManager.particleSystem.update(dt);

				// Subtract one "timestep" from the accumulator
				accum -= dt;
	    	}

			myCanvasManager.particleSystem.draw(myCanvasManager.ctx);
			fpsmeter.tick();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);

	},

	timestamp : function() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	}

}
