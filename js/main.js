// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const ballCountDisplay = document.getElementById("ballCount");
let ballCount = 25; // Start with 25 balls
ballCountDisplay.textContent = ballCount; // Display initial ball count

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    if (this.exists) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  update() {
    if (this.exists) {
      if (this.x + this.size >= width) {
        this.velX = -Math.abs(this.velX);
      }

      if (this.x - this.size <= 0) {
        this.velX = Math.abs(this.velX);
      }

      if (this.y + this.size >= height) {
        this.velY = -Math.abs(this.velY);
      }

      if (this.y - this.size <= 0) {
        this.velY = Math.abs(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
    }
  }

  collisionDetect() {
    if (this.exists) {
      for (const ball of balls) {
        if (this !== ball && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // Hardcoded velX and velY values
    this.color = 'white';
    this.size = 10;

    // Keyboard movement
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x + this.size >= width) {
      this.x = width - this.size;
    }

    if (this.x - this.size <= 0) {
      this.x = this.size;
    }

    if (this.y + this.size >= height) {
      this.y = height - this.size;
    }

    if (this.y - this.size <= 0) {
      this.y = this.size;
    }
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--; // Decrease ball count when a ball is eaten
          ballCountDisplay.textContent = ballCount;
        }
      }
    }
  }
}

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

const evilCircle = new EvilCircle(random(0, width), random(0, height));

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) { // Only update balls that exist
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw(); // Draw the evil circle
  evilCircle.checkBounds(); // Check boundaries for the evil circle
  evilCircle.collisionDetect(); // Check for collisions with the evil circle

  requestAnimationFrame(loop); // Continue the animation loop
}


loop();