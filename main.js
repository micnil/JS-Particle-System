window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var context;
var canvas;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

function main(){

	console.log("startar");
	canvas = document.getElementById('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	context = canvas.getContext('2d');

	particleSystem = new ParticleSystem();

	particleSystem.init();
	theCanvas.addEventListener("mousedown", particleSystem.mouseDownListener, false);

	var lastCall = timestamp();
	var accum = 0;
	var dt = 1 / 60;
	fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark', left: '5px' });

	function loop(){
		fpsmeter.tickStart();
		var delta = (timestamp() - lastCall)/1000;
		lastCall = timestamp();
		accum += delta;

		while (accum >= dt) {

	        // Update the game's internal state (i.e. physics, logic, etc)
	        particleSystem.update(dt);

	        // Subtract one "timestep" from the accumulator
	        accum -= dt;
    	}

		particleSystem.draw();
		fpsmeter.tick();
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

function timestamp() {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

window.onload = main;