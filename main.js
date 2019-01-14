function setup() {

    // Initialises the toolbar.
    toolbar = new ShootingParticles();

}

function draw() {

    // Draws the plane.
    toolbar.draw();

}

/** A class that encompasses the toolbar, canvas including the draw-space. */

class ShootingParticles {

    /**
     * setup function that constructs the ShootingParticles class.
     * @constructor
     * @param {boolean} [initGravity=true] - The initial boolean value for the gravity feature.
     * @param {boolean} [initRandomise=false] - The initial boolean value for the randomise feature.
     * @param {number} [initViscosity=0] - The initial value for the viscosity.
     * @param {string} [initParticleColor='white'] - The initial particle colour.
     * @param {number} [initMaximumParticles=200] - The maximum amount of particles allowed in the space at one time.
     */
    constructor(initGravity = true,initRandomise = false,initViscosity = 0,initParticleColor = 'white',initMaximumParticles = 200) {

        // Sets the parameter to the corresponding variable in the class.
        this.gravity = initGravity;
        this.randomise = initRandomise;
        this.viscosity = initViscosity;
        this.particleColor = initParticleColor;
        this.maximumParticles = initMaximumParticles;
        this.particles = [];

        // Sets up the toolbar and positions it corresponding to the window size.
        this.createToolbar();
        this.positionToolbar();

        // Creates the canvas and embeds it into the container. Also disables the scrollbar.
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

    /**
     * The draw function for the ShootingParticles.
     */
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

            // Moves each particle, then draws it
            element.move();
            element.display();
        }
    }

    /**
     * Creates the toolbar which includes: the three sliders (colour, viscosity and size) and the two toggle buttons (gravity and randomise).
     */
    createToolbar() {

        // Create Colour slider
        this.colorSlider = createSlider(0, 255, 127);

        // Create Viscosity slider
        this.viscositySlider = createSlider(0.3, 1, 0.65, 0.05);

        // Create Size slider
        this.sizeSlider = createSlider(0.015, 0.03, 0.0225, 0.001);

        // Create the Toggle Gravity button. Also sets the changeGravity function to be called when the button is pressed.
        this.toggleGravity = createButton('Toggle Gravity');
        this.toggleGravity.mousePressed(this.changeGravity.bind(this));

        // Create the Toggle Random colours button. Also sets the changeRandomise function to be called when the button is pressed.
        this.toggleRandomise = createButton('Randomise');
        this.toggleRandomise.mousePressed(this.changeRandomise.bind(this));

        // Initialises the background colour for the buttons.
        this.toggleGravity.style('background', 'green');
        this.toggleRandomise.style('background', 'red');

        // Initialises the text colour for the buttons.
        this.toggleGravity.style('color', 'white');
        this.toggleRandomise.style('color', 'white');

        // Standardises the size of the buttons.
        this.toggleGravity.style('width', '100px');
        this.toggleRandomise.style('width', '100px');
    }

    /**
     * Positions the toolbar in respect to the current window size. Used when the toolbar is initially setup and when the window is re-sized.
     */
    positionToolbar() {

        // (re)positions all the sliders & buttons. (mainly used in the case of a window resize).
        this.colorSlider.position(windowWidth / 10, windowHeight - (windowHeight / 20));
        this.viscositySlider.position((windowWidth / 10) + 200, windowHeight - (windowHeight / 20));
        this.sizeSlider.position((windowWidth / 10) + 400, windowHeight - (windowHeight / 20));
        this.toggleGravity.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) - 24);
        this.toggleRandomise.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) + 1);
    }

    /**
     * Draws the toolbar text onto the screen.
     */
    createText() {

        // Draws the text in the toolbar.
        fill(255);
        text('Colour', (windowWidth/10)+37, (windowHeight-(windowHeight/20))-5);
        text('Viscosity', (windowWidth/10)+225, (windowHeight-(windowHeight/20))-5);
        text('Size', (windowWidth/10)+452, (windowHeight-(windowHeight/20))-5);
        text('Press the C key to clear the particles', (windowWidth/10)+600, (windowHeight-(windowHeight/20))+5);

        // Draws the toolbar horizontal divider line.
        stroke(126);
        line(0, windowHeight-(windowHeight/10), windowWidth, windowHeight-(windowHeight/10));
    }

    /**
     * The function that is called when the gravity button is toggled. Sets the gravity variable to true when false and vice versa. Also changes the gravity button colour when toggled.
     */
    changeGravity() {

        // Toggles the gravity button. When false the gravity variable is set to true and vice versa. The toggleGravity button background is set to green or red (respectively).
        if (this.gravity === false) {
            this.gravity = true;
            this.toggleGravity.style('background', 'green');
        } else {
            this.gravity = false;
            this.toggleGravity.style('background', 'red');
        }

    }

    /**
     * The function that is called when the randomise button is toggled. Sets the randomise variable to true when false and vice versa. Also changes the randomise button colour when toggled.
     */
    changeRandomise() {

        // Toggles the randomise button. When false the randomise variable is set to true and vice versa. The toggleRandomise button background is set to green or red (respectively).
        if (this.randomise === false) {
            this.randomise = true;
            this.toggleRandomise.style('background', 'green');
        } else {
            this.randomise = false;
            this.toggleRandomise.style('background', 'red');
        }
    }

    /**
     * This is called from the draw function to set each of the colour, size & viscosity variables depending on the value on the sliders. If randomise is set to true the value of the colour & size slider is incremented.
     */
    setVariables() {

        // If the value of randomise is true the values of the colour and size slider is incremented.
        if (this.randomise === true) {
            this.colorSlider.value((this.colorSlider.value() + 5) % 256);
            this.sizeSlider.value((this.sizeSlider.value() + 0.001) % 0.031);
        }

        // Sets the particle colour and viscosity to the slider value.
        this.particleColor = color(this.colorSlider.value(), 255, 255, 127);
        this.viscosity = this.viscositySlider.value();
    }

    /**
     * Creates a new particle. Called when the mouse is pressed or dragged. A new particle is created as long as the cursor is outside of the toolbar. Also deletes the oldest particle if the particle limit is reached.
     */
    createParticle() {

        // Checks to make sure Particles are only created if the user clicks outside the toolbar inside the canvas.
        if (mouseY < windowHeight-(windowHeight/10)) {
            this.particles.push(new Particle(mouseX, mouseY));
        }

        // Deletes the oldest particle if the amount of particles on screen is over the limit.
        if (this.particles.length > this.maximumParticles) {
            this.particles.shift();
        }
    }

}

/** A class that represents the Particle component. */

class Particle {

    /**
     * constructs the particle class.
     * @param {number} [x=0] - The initial x co-ordinate for the particle.
     * @param {number} [y=0] - The initial y co-ordinate for the particle.
     * @param {number} [velX=random(-.1,.1)] - The initial velocity with respect to the x-axis for the particle.
     * @param {number} [velY=random(-.1,.1)] - The initial velocity with respect to the y-axis for the particle.
     */
    constructor(x = 0, y = 0, velX = random(-.1,.1), velY = random(-.1,.1)) {

        // Sets the parameter to the corresponding variable in the class.
        this.xPos = x;
        this.yPos = y;
        this.xVel = velX;
        this.yVel = velY;

        // Particle mass/size is the slider value plus or minus a constant (0.08). Sets the particle colour depending on the slider value.
        this.mass = random(toolbar.sizeSlider.value() - 0.008, toolbar.sizeSlider.value() + 0.008);
        this.color = toolbar.particleColor;
    }

    /**
     * Moves the particle depending on it's current position and velocities.
     */
    move() {

        // Moves the particle depending on the velocity in the x-axis or y-axis.
        this.xPos += this.xVel;
        this.yPos += this.yVel;
    }

    /**
     * Draws the particle onto the canvas.
     */
    display() {

        // Sets the colour for the particle.
        fill(this.color);
        // Draws the particle, the mass*1000 give the size.
        ellipse(this.xPos, this.yPos, this.mass*1000, this.mass*1000);
    }

    /**
     * Updates the particle velocity depending on the distance to the other particles and if it is in close proximity to the mouse.
     */
    handleInteractions() {

        // The new velocity of the particle.
        var accX = 0; var accY = 0;

        // particle interaction the particles attract/repel each other. Checks current particle with all other particles.
        for (var element of toolbar.particles.values()) {

            // If the current element is not the same as the current particle.
            if (this != element) {

                // Calculates distance of both particles in the x-axis and y-axis.
                var x = element.xPos - this.xPos;
                var y = element.yPos - this.yPos;

                // Calculates the hypotenuse between both the particles which is the distance between the two particles.
                dis = sqrt(x * x + y * y);

                // If the distance is less than a certain amount (.5) the distance is changed to .5. This is to reduce overlap between particles.
                if (dis < .5) dis = .5;

                // calculates the force between the particles with a constant (380).
                var force = (dis - 380) * element.mass / dis;

                // Scales the force in the x-axis and y-axis to find the new velocity of the particle.
                accX += force * x;
                accY += force * y;
            }

            // Makes sure the particles are moved only when the cursor is inside the canvas.
            if (mouseY < windowHeight-(windowHeight/10)) {

                // Checks to see the distance of the mouse to the particle.
                var x = mouseX - this.xPos;
                var y = mouseY - this.yPos;
                var dis = sqrt(x * x + y * y);

                // Adds a dampening effect to the distance.
                if (dis < 40) dis = 40;
                if (dis > 50) dis = 50;

                // Calculates the force between the mouse and the particle..
                var force = (dis - 50) / (5 * dis);

                // Updates the value of the scaled force in the x-axis and y-axis to find the new velocity of the particle.
                accX += force * x;
                accY += force * y;

            }

        }

        // Updates the particle velocity depending on the 'current velocity' * 'viscosity' + 'scaled force' * 'mass'
        this.xVel = this.xVel * toolbar.viscosity + accX * this.mass;
        this.yVel = this.yVel * toolbar.viscosity + accY * this.mass;

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