window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
								window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function main(){

	particleCanvas = document.getElementById('particleCanvas');
	fieldCanvas = document.getElementById('fieldCanvas');

	particleSystem = new ParticleSystem();

	particleSystem.init();

	var canvasManager = new CanvasManager(particleCanvas,fieldCanvas,particleSystem);
	canvasManager.startAnimationLoop();
	
}

window.onload = main;