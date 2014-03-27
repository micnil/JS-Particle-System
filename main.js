window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var context;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var dt = 0.02

function main(){

	console.log("startar");
	var canvas = document.getElementById('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	context = canvas.getContext('2d');

	particleSystem=new ParticleSystem();

	particleSystem.init()

	function loop(){
		particleSystem.update();
		particleSystem.draw();
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

window.onload = main;