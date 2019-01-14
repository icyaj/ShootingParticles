function setup() {

    // Initialises the toolbar.
    toolbar = new ShootingParticles();

}

function draw() {

    // Draws the plane.
    toolbar.draw();

}

class ShootingParticles {

    // constructs the ShootingParticles class
    constructor(initGravity = true,initRandomise = false,initViscosity = 0,initParticleColor = 'white',initMaximumParticles = 200) {
        this.gravity = initGravity;
        this.randomise = initRandomise;
        this.viscosity = initViscosity;
        this.particleColor = initParticleColor;
        this.maximumParticles = initMaximumParticles;
        this.particles = [];

        this.createToolbar();
        this.positionToolbar();

        // Create canvas and embed it into the container. Also gets rid of the scrollbar.
        this.canvas = createCanvas(windowWidth, windowHeight);
        this.canvas.style('display', 'block');
        this.canvas.parent('canvasContainer');

        // Initialises the text settings.
        textSize(20);
        noStroke();
        fill(255);

        // Disables outline on bubbles.
        noStroke();

        // Sets the color mode
        colorMode(HSB, 255);

        // Set the frame rate.
        frameRate(60);

    }

    draw() {

        // Resets background.
        background(51);

        // Sets the colour & viscosity depending on the value of the sliders.
        this.setVariables();

        // creates the text & toolbar divider line.
        this.createText();

        // Updates each element (particle) in the particle array.
        for (var element of this.particles.values()) {

            // If gravity is set to true the particles new velocities would be calculated.
            if (toolbar.gravity) element.handleInteractions();

            // moves each particle, then draws it
            element.move();
            element.display();
        }
    }


    createToolbar() {

        // create Colour slider
        this.colorSlider = createSlider(0, 255, 127);

        // create Viscosity slider
        this.viscositySlider = createSlider(0.3, 1, 0.65, 0.05);

        // create Size slider
        this.sizeSlider = createSlider(0.015, 0.03, 0.0225, 0.001);

        // create the Toggle Gravity button.
        this.toggleGravity = createButton('Toggle Gravity');
        this.toggleGravity.mousePressed(this.changeGravity.bind(this));

        // create the Toggle Random colours button.
        this.toggleRandomise = createButton('Randomise');
        this.toggleRandomise.mousePressed(this.changeRandomise.bind(this));

        // Initialises the background colour for the buttons.
        this.toggleGravity.style('background', 'green');
        this.toggleRandomise.style('background', 'red');

        // Initialises the text colour for the buttons.
        this.toggleGravity.style('color', 'white');
        this.toggleRandomise.style('color', 'white');

        // standardises the size of the buttons.
        this.toggleGravity.style('width', '100px');
        this.toggleRandomise.style('width', '100px');
    }

    positionToolbar() {

        // (re)positions all the sliders & buttons. (mainly used in case of a window resize).
        this.colorSlider.position(windowWidth / 10, windowHeight - (windowHeight / 20));
        this.viscositySlider.position((windowWidth / 10) + 200, windowHeight - (windowHeight / 20));
        this.sizeSlider.position((windowWidth / 10) + 400, windowHeight - (windowHeight / 20));
        this.toggleGravity.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) - 24);
        this.toggleRandomise.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) + 1);
    }

    createText() {

        // creates the text
        fill(255);
        text('Colour', (windowWidth/10)+37, (windowHeight-(windowHeight/20))-5);
        text('Viscosity', (windowWidth/10)+225, (windowHeight-(windowHeight/20))-5);
        text('Size', (windowWidth/10)+452, (windowHeight-(windowHeight/20))-5);
        text('Press the C key to clear the particles', (windowWidth/10)+600, (windowHeight-(windowHeight/20))+5);

        // ShootingParticles divider
        stroke(126);
        line(0, windowHeight-(windowHeight/10), windowWidth, windowHeight-(windowHeight/10));
    }

    changeGravity() {

        // Toggles the gravity button.
        if (this.gravity === false) {
            this.gravity = true;
            this.toggleGravity.style('background', 'green');
        } else {
            this.gravity = false;
            this.toggleGravity.style('background', 'red');
        }

    }

    changeRandomise() {

        // Toggles the randomise button.
        if (this.randomise === false) {
            this.randomise = true;
            this.toggleRandomise.style('background', 'green');
        } else {
            this.randomise = false;
            this.toggleRandomise.style('background', 'red');
        }
    }

    setVariables() {
        if (this.randomise === true) {
            this.colorSlider.value((this.colorSlider.value() + 5) % 256);
            this.sizeSlider.value((this.sizeSlider.value() + 0.001) % 0.031);
        }
        this.particleColor = color(this.colorSlider.value(), 255, 255, 127);
        this.viscosity = this.viscositySlider.value();
    }

    // creates the particles.
    createParticle() {
        // Checks to make sure Particles are only created if the user clicks inside the canvas.
        if (mouseY < windowHeight-(windowHeight/10)) {
            this.particles.push(new Particle(mouseX, mouseY));
        }

        // Deletes the first particle if the amount of particles on screen is over the limit.
        if (this.particles.length > this.maximumParticles) {
            this.particles.shift();
        }
    }

}

class Particle {

    // constructs the particle class
    constructor(x = 0, y = 0, velX = random(-.1,.1), velY = random(-.1,.1)) {
        this.xPos = x;
        this.yPos = y;
        this.xVel = velX;
        this.yVel = velY;

        // Particle mass/size is plus or minus 0.08 the slider value.
        this.mass = random(toolbar.sizeSlider.value() - 0.008, toolbar.sizeSlider.value() + 0.008);
        this.color = toolbar.particleColor;
    }

    // moves the particle.
    move() {
        this.xPos += this.xVel;
        this.yPos += this.yVel;
    }

    // displays the particle.
    display() {
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.mass*1000, this.mass*1000);
    }

    // updates the new velocity of the particle.
    handleInteractions() {
        var accX = 0; var accY = 0;

        // particle interaction the particles attract/repel each other
        for (var element of toolbar.particles.values()) {
            if (this != element) {
                //dis = this.calculateDistance(this.xPos,this.yPos,element.xPos,element.yPos);
                var x = element.xPos - this.xPos;
                var y = element.yPos - this.yPos;
                dis = sqrt(x * x + y * y);
                if (dis < .5) dis = .5;

                var force = (dis - 380) * element.mass / dis;
                accX += force * x;
                accY += force * y;
            }

            // Makes sure the particles are moved only when the cursor is inside the canvas.
            if (mouseY < windowHeight-(windowHeight/10)) {

                // mouse interaction
                var x = mouseX - this.xPos;
                var y = mouseY - this.yPos;
                var dis = sqrt(x * x + y * y);

                // adds a dampening effect
                if (dis < 40) dis = 40;
                if (dis > 50) dis = 50;

                var force = (dis - 50) / (5 * dis);
                accX += force * x;
                accY += force * y;

            }

        }

        this.xVel = this.xVel * toolbar.viscosity + accX * this.mass;
        this.yVel = this.yVel * toolbar.viscosity + accY * this.mass;

    }

    calculateDistance(iX,iY,jX,jY){
        console.log(iX,iY,jX,jY);
        var x = jX - iX;
        var y = jY - iY;
        return sqrt(x * x + y * y);
    }

}

// Resize canvas when window is resized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    toolbar.positionToolbar();
}

function keyPressed() {
    // clears all particles if the C key was pressed
    if (keyCode === 67)	{
        toolbar.particles = [];
    }
}

// creates a new particle when mouse is pressed
function mousePressed() {
    toolbar.createParticle();
}

// creates a new particle when mouse is dragged
function mouseDragged() {
    toolbar.createParticle();
}