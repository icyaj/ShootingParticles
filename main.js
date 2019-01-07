var particles = [];
var viscosity;
var c;

function setup() {
    createCanvas(displayWidth, displayHeight);
	frameRate(60);
	noStroke();
	
	c = color(62, 255, 255, 192);
	viscosity = 0.95;
}

function draw() {
	background(32);
	
	// makes the particles attract/repel each other
	handleInteractions();
	
	// moves each particle, then draws it
	for (var i = 0; i < particles.length; i++) {
		particles[i].move();
		particles[i].display();
	}
}