window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var context;

function fibonacciPattern(){
      console.log("startar");
      var canvas = document.getElementById('canvas');
      var WIDTH = window.innerWidth;
      var HEIGHT = window.innerHeight;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      context = canvas.getContext('2d');
      
      // context.fillStyle = "rgba(0, 0, 0, 1.0)";
      // context.fillRect(0, 0, WIDTH, HEIGHT);

      var fiboParticle = new particle(WIDTH/2,HEIGHT/2);

      function animate(){
            requestAnimationFrame(animate);
            fiboParticle.drawParticle();
      }

      requestAnimationFrame(animate);

}



window.onload = fibonacciPattern;

      