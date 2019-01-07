function keyPressed() {
	// changes the colour if the C key was pressed
	if (keyCode === 67)	{
		c = color(random(100), random(200, 255), random(200, 255), 192);
	}
	
	// changes the viscosity if the V key was pressed
	if (keyCode === 86)	{
		if (viscosity >= 0.90) viscosity = random(0.30, 0.60);
		else if (viscosity < 0.60) viscosity = random(0.70, 0.80);
		else viscosity = random(0.90, 1.00);
	}
	
	if (keyCode === 82)	{
		particles = [];
	}
}

// creates a new particle
function mousePressed() {
	particles.push(new Particle(mouseX, mouseY, c));
}

// creates a new particle
function mouseDragged() {
	particles.push(new Particle(mouseX, mouseY, c));
}