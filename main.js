window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function main(){

	console.log("startar");
	canvas = document.getElementById('canvas');

	particleSystem = new ParticleSystem();

	particleSystem.init();

	var canvasManager = new CanvasManager(canvas,particleSystem);
	canvasManager.startAnimationLoop();
	
}

window.onload = main;