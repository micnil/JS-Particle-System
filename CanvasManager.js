var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
function CanvasManager(particleCanvas,fieldCanvas, ps){

	this.particleCanvas = particleCanvas;
	this.particleCanvas.width = WIDTH;
	this.particleCanvas.height = HEIGHT;
	this.ctx = particleCanvas.getContext('2d');

	this.fieldCanvas = fieldCanvas;
	this.fieldCanvas.width = WIDTH;
	this.fieldCanvas.height = HEIGHT;
	this.ctxLayer = fieldCanvas.getContext('2d');

	this.particleSystem = ps || new ParticleSystem();

	this.pauseBtn = document.getElementById('pauseBtn');
	this.clearBtn = document.getElementById('clearBtn');
	this.createEmitterBtn = document.getElementById('createEmitterBtn');
	this.pauseEmittersBtn = document.getElementById('pauseEmitterBtn');
	this.createForceFieldBtn = document.getElementById('createFieldBtn');

	/*  states  */

	// When we are dragging an object, set to true.
	this.dragging = false;
	// The selected object that will be dragged. returned by particleSystem.
	this.selection = null;
	//drag offset. so you can drag from anywhere in the object, not just center.
	this.dragOff = new Vector();
	//if the freeze button is pressed, dont update states of particlesystem
	this.freeze = false;

	/* events */

	//fixes a problem where double clicking causes text to get selected on the canvas
	fieldCanvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	//In future might not activate all listeners here, instead activate when needed
	//(first mousedown, then mousemove untill mouseup)
	fieldCanvas.addEventListener('mousedown', this.mouseDownListener.bind(this), false);
	fieldCanvas.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
	fieldCanvas.addEventListener('mouseup', this.mouseUpListener.bind(this), false);
	pauseBtn.addEventListener('click',  this.freezeBtnAction.bind(this),false);
	clearBtn.addEventListener('click',  this.clearBtnAction.bind(this),false);
	createEmitterBtn.addEventListener('click',  this.createEmitterBtnAction.bind(this),false);
	this.pauseEmittersBtn.addEventListener('click',  this.pauseEmitterBtnAction.bind(this),false);
	this.createForceFieldBtn.addEventListener('click',  this.createForceFieldBtnAction.bind(this),false);


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
			
			this.selection.moveTo(this.dragOff, mouseCoords);
		}
	},

	mouseUpListener :  function(e) {
		this.dragging = false;
	},

	getMouseCoords : function(e) {
  		//getting mouse position correctly 
  		var bRect = this.particleCanvas.getBoundingClientRect();
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
				if(!myCanvasManager.freeze)
					myCanvasManager.particleSystem.update(dt);

				// Subtract one "timestep" from the accumulator
				accum -= dt;
			}

			myCanvasManager.particleSystem.draw(myCanvasManager.ctx,myCanvasManager.ctxLayer);
			fpsmeter.tick();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);

	},

	timestamp : function() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	},

	freezeBtnAction: function(){
		if(this.freeze){
			this.freeze=false;
			this.pauseBtn.innerHTML = "pause";
		}
		else{
			this.freeze=true;
			this.pauseBtn.innerHTML = "start";
		}
	},

	clearBtnAction: function(){
		particleSystem.clearParticleSystem();
	},

	createEmitterBtnAction: function(){

		var maxX = this.particleCanvas.width - 40;
		var maxY = this.particleCanvas.height - 40;
		rand1=Math.random();
		rand2=Math.random();
		var randX = rand1 * maxX + 20;
		var randY = rand2 * maxY + 20;
		var pos = new Vector(randX,randY);
		var direction = new Vector((rand1-0.5)*2,(rand2-0.5)*2);
		direction.normalize();

		var angle = document.getElementById('shootingAngle').value;

		if(isNaN(angle))
			angle=20;

		var magnitude = document.getElementById('magnitudeSize').value;
		var radius = 20;
		this.particleSystem.createEmitter(pos,direction,angle,magnitude,radius);
	},

	pauseEmitterBtnAction: function(){

		// a little bit ugly maybe
		// if button value is 1, then emitters are shooting and we want to turn them of.
		if(this.pauseEmittersBtn.value == "1"){
			console.log("hej");
			this.pauseEmittersBtn.value="0";
			this.pauseEmittersBtn.innerHTML = "start";
			particleSystem.stopShooting();
		}
		else{
			console.log("hej1!");
			this.pauseEmittersBtn.value="1";
			this.pauseEmittersBtn.innerHTML = "pause";
			particleSystem.startShooting();
		}
	},

	createForceFieldBtnAction: function(){

		var maxX = this.particleCanvas.width - 40;
		var maxY = this.particleCanvas.height - 40;
		rand1=Math.random();
		rand2=Math.random();
		var randX = rand1 * maxX + 20;
		var randY = rand2 * maxY + 20;
		var pos = new Vector(randX,randY);

		var weight = document.getElementById('weightSize').value;

		var type = document.getElementsByName('forceType');

		if (type[0].checked)
			this.particleSystem.createForceField(pos,weight,-1);
		else if(type[1].checked)
			this.particleSystem.createForceField(pos,weight,1);
	}

}
