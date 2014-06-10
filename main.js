window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
//var context;
//var canvas;
//var WIDTH = window.innerWidth;
//var HEIGHT = window.innerHeight;

function main(){

	console.log("startar");
	canvas = document.getElementById('canvas');

	particleSystem = new ParticleSystem();

	particleSystem.init();

	core = new Core(canvas,particleSystem);
	core.startAnimationLoop();
	
}

window.onload = main;