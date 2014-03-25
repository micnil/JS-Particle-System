

function Particle(pos,velocity,acceleration){
      this.position = pos || new Vector(0, 0);
      this.velocity = velocity || new Vector(0, 0);
      this.acceleration = acceleration || new Vector(0, 0);
      this.color = '#003300';
}

Particle.prototype = {

      drawParticle: function() { 
                  context.strokeStyle = this.color;      
                  context.beginPath();
                  context.globalAlpha = 1.0;
                  context.moveTo(this.x, this.y);
                  
                  this.moveParticle();

                  context.lineTo(this.x, this.y);
                  context.stroke();

                  console.log("x: %s, y: %s", this.x,this.y);

            },
      moveParticle: function() {
            this.x = this.x+Math.random()*10-5;
            this.y = this.y+Math.random()*10-5;
      }
}