var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
function CanvasManager(canvas, ps){

	this.canvas = canvas;
	this.canvas.width = WIDTH;
	this.canvas.height = HEIGHT;
	this.ctx = canvas.getContext('2d');

	this.particleSystem = ps || new ParticleSystem();
	
	/*  states  */

	// When we are dragging an object, set to true.
	this.dragging = false;
	// The selected object that will be dragged. returned by particleSystem.
	this.selection = null;
	//drag offset. so you can drag from anywhere in the object, not just center.
	this.dragOff = new Vector();

	/* events */

	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	//In future might not activate all listeners here, instead activate when needed
	//(first mousedown, then mousemove untill mouseup)
	canvas.addEventListener('mousedown', this.mouseDownListener.bind(this), false);
	canvas.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
	canvas.addEventListener('mouseup', this.mouseUpListener.bind(this), false)


}
CanvasManager.prototype = {

	mouseDownListener : function(e) {
		var mouseCoords = this.getMouseCoords(e);

		var mySel = this.particleSystem.getPressedObject(mouseCoords);

		if (mySel) {

			//saves the offset from center of object. Will produce a 
			//smoother drag.
			this.dragOff = mouseCoords.subtract(mySel.position);
			this.dragging = true;
			this.selection = mySel;

			return;
		}

		//failed to select, set the selection to null
		if (this.selection) {
			this.selection = null;
		}
	},

	mouseMoveListener : function(e) {
		if (this.dragging){

			var mouseCoords = this.getMouseCoords(e);
			var newPosition = mouseCoords.subtract(this.dragOff);

			//Change the position with ( mousecoordinates - the offset from center )
			//this.selection.moveTo(newPosition);

			//adding an easing to the movement.
			//difference = newPosition - oldposition;
			// selection is moved to : oldposition + difference * 0.65 (ease amount)
			var difference = newPosition.subtract(this.selection.position);
			this.selection.moveTo(this.selection.position.add(difference.multiply(0.65)))
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
