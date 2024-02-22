let asteroids = [];
let maxAsteroids = 50;

let stars = [];
let maxStars = 100;
let hyperspaceJump = false;
let spaceFXRotate = 45;

let eventTimer = 1;
let eventRate = 60;
let eventNum = 7; //around half should be asteroid or other visual spawn.
let eventSelector = 0;

let lightColor = 0;
let redAlert = false;
let yellowAlert = false;
let greenAlert = false;

let lightFlash = false;
let lightTimer = 0;
let winFill = 0;

let ship = 0;
let shipSpawned = false;
let shipImg = 0;

function setup()
{
  createCanvas(800, 600);
  lightColor = color(255, 125, 125, 200);
  winFill = color(25, 25, 25);
  createAsteroid(random(1, width-25), random(1, height-25));
  createStarfield();
  eventSelector = int(random(1, eventNum));
  shipImg = loadImage('assets/paintShip.png');
}

function createAsteroid(posX, posY)
{
  asteroids.push(new Particle(130, 120, 50, random(width/60, width/8), 0, createVector(posX, posY), createVector(random(-1, 1), random(-1, 1)), createVector(0, 0), 2, 0));
}

function createStarfield()
{
  for (let s = 0; s < maxStars; s++)
  {
    stars.push(new Particle(225, 225, 225, random(1, 6), 10, createVector(random(width), random(height)), createVector(-0.1, 0.1), createVector(0.01,0.05), 1, 0));
  }
}

function draw()
{
  if(!hyperspaceJump)
  {background(0);}
  else
  {background(25, 0, 50);}

  for(let s = 0; s < stars.length; s++)
  {
    stars[s].display();

    if (hyperspaceJump)
    {
      stars[s].movement();
      stars[s].changeSpeed();
      stars[s].changeHeight(2);
      stars[s].changeColor(225, 225, 255);
 
      //spaceFXRotate += spaceFXRotate;
      if (stars[s].isDead())
      {
        stars.splice(s, 1);
      }
    }
  }

  if (stars.length <= 0)
  {
    createStarfield();
    resetEvent();
    hyperspaceJump = false;
    spaceFXRotate = 45;
  }
  if(!hyperspaceJump)
  {
    for(let a = 0; a < asteroids.length; a++)
    {
      asteroids[a].display();
      asteroids[a].movement();
      if(asteroids[a].isDead())
      {
        asteroids.splice(a, 1);
      }
    }
    if (shipSpawned)
    {
      ship.display();
      ship.movement();
      if (ship.isDead())
      {
        ship = 0;
        shipSpawned = false;
      }
    }
  }

  //draw "window"
  push();
  fill(winFill);
  stroke(255);
  beginShape(triangle);
    vertex(1, height / 2);
    vertex(1, height - 1);
    vertex(width / 4, height - 1);
  endShape(CLOSE);
  beginShape(triangle);
    vertex(width - 1, height / 2);
    vertex(width - 1, height- 1);
    vertex(3 * width / 4, height-1);
  endShape(CLOSE);
  beginShape(triangle);
  vertex(1, height / 2);
  vertex(1, 1);
  vertex(width / 4, 1);
endShape(CLOSE);
beginShape(triangle);
  vertex(width - 1, height / 2);
  vertex(width - 1, 1);
  vertex(3 * width / 4, 1);
endShape(CLOSE);
pop();

if (redAlert && lightFlash)
{
  //ambientLight(lightColor);
  winFill = lerpColor(winFill, color(255, 100, 100), 0.5);
}
else if (yellowAlert && lightFlash)
{
  winFill = lerpColor(winFill, color(255, 204, 0), 0.5);
}
else if (greenAlert && lightFlash)
{
  winFill = lerpColor(winFill, color(0, 255, 0), 0.5);
}
else
{
  winFill = lerpColor(winFill, color(25, 25, 25), 0.5);
}

if ((eventTimer % eventRate) == 0)
{
  textSize(20);
  eventHandling();
  if (redAlert)
  {
    fill(255, 255, 255);
    text("Click Mouse!", width/2, height/2);
  }
  if (yellowAlert)
  {
    fill(255, 255, 255);
    text("Press Y!", width/2, height/2);
  }
  if (greenAlert)
  {
    fill(255, 255, 255);
    text("Press G!", width/2, height/2);
  }
}
else
{
  eventTimer++;
}
}

function asteroidSpawner()
{
  if(asteroids.length < maxAsteroids)
  {createAsteroid(random(width - 50), random(height - 50));}
}

function shipSpawner()
{
  ship = new Particle(125, 125, 125, 50, 0, createVector(random(width), random(height)), createVector(2*random(-1, 1), 2*random(-1, 1)), createVector(0, 0), 3, shipImg);
  shipSpawned = true;
  //console.log("Ship Should appear");
}

function eventHandling()
{
  switch (eventSelector)
  {
    case 1:
      if (!shipSpawned)
      {
      shipSpawner();
      }
      resetEvent();
      break;
    case 2:
      hyperspaceJump = true;
      break;
    case 3:
      asteroidSpawner();
      resetEvent();
      break;
    case 4:
      lightTimer++;
      greenAlert = true;
      //play Green Alert sound
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 5:
      lightTimer++;
      redAlert = true;
      //play red alert sound
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    case 6:
      lightTimer++;
      yellowAlert = true;
      //play yellow alert sound
      if (lightTimer >= 30)
      { 
        lightTimer = 0;
        lightFlash = !lightFlash;
      }
      break;
    default:
      resetEvent();
      break;
  }
}

function keyReleased()
{
  if ((key == 'y' || key == 'Y') && yellowAlert)
  {
    resetEvent();
  }
  else if ((key == 'g' || key == 'G') && greenAlert)
  {
    resetEvent();
  }
}

function mouseClicked()
{
  if ((eventTimer % eventRate) == 0 && redAlert)
  {
    resetEvent();
  }
}

function resetEvent()
{
  eventTimer = 1;
  eventSelector = int(random(eventNum));
  lightTimer = 0;
  redAlert = false;
  yellowAlert = false;
  greenAlert = false;
  lightFlash = false;
}

class Particle
{
  constructor(pRed, pGreen, pBlue, pSize, pAngle, pPos, pVelo, pAccel, pShape, pImage)
  {
    this.pWidth = pSize;
    this.pHeight = pSize;
    this.position = pPos;
    this.speed = pVelo;
    this.acceleration = pAccel;
    this.pRed = pRed;
    this.pGreen = pGreen;
    this.pBlue = pBlue;
    this.angle = pAngle;
    this.shape = pShape; //an int representing how to display it. 1 for rect, 2 for ellipse, 3 for an image.
    this.pImage = pImage;
    /*if (this.shape == 3)
    {
      console.log("A ship was created!");
    }*/
  }

  display()
  {
    noStroke();
    fill(this.pRed, this.pGreen, this.pBlue);
    if (this.shape == 1)
    {
      rect(this.position.x, this.position.y, this.pWidth, this.pHeight, this.angle);
    }
    else if (this.shape == 2)
    {
      ellipse(this.position.x, this.position.y, this.pWidth, this.pHeight);
    }
    else if (this.shape == 3)
    {
      push();
      angleMode(DEGREES);
      imageMode(CENTER);
      translate(this.position.x, this.position.y)
      rotate(this.speed.heading() + 90);
      console.log(this.speed.heading());
      image(this.pImage, 0, 0, this.pWidth, this.pHeight);
      pop();
    }
  }

  changeColor(newRed, newGreen, newBlue)
  {
    this.pRed = lerp(this.pRed, newRed, 0.5);
    this.pGreen = lerp(this.pGreen, newGreen, 0.5);
    this.pBlue = lerp(this.pBlue, newBlue, 0.5);
  }

  changeHeight(newSize)
  {
    this.pHeight = lerp(this.pHeight, this.pHeight + newSize, 0.5);
    //this.pWidth = lerp(this.pWidth, this.pWidth + newSize, 0.5);
  }

  changeSpeed()
  {
    this.speed.add(this.acceleration);
  }

  isDead()
  {
    if (this.position.x > width + 25 || this.position.x < -25 || this.position.y > height + 25|| this.position.y < -25 || this.size <= 0)
    {
      return true;
    }
    return false;
  }

  movement()
  {
    this.position.add(this.speed);
  }
}