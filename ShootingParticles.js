
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
        this._gravity = initGravity;
        this._randomise = initRandomise;
        this._viscosity = initViscosity;
        this._particleColor = initParticleColor;
        this._maximumParticles = initMaximumParticles;
        this._particles = [];

        // Adds the event listener to lookout for mouse click, drag or a key-press.
        document.addEventListener('drag', () => this.createParticle());
        document.addEventListener('click', () => this.createParticle());
        document.addEventListener('keypress', () => this.keyPressed());

        // Sets up the toolbar and positions it corresponding to the window size.
        this.createToolbar();
        this.positionToolbar();

        // Creates the canvas and embeds it into the container. Also disables the scrollbar.
        this._canvas = createCanvas(windowWidth, windowHeight);
        this._canvas.style('display', 'block');
        this._canvas.parent('canvasContainer');

        // Initialises the text settings.
        textSize(20);
        noStroke();
        fill(255);

        // Disables outline on bubbles.
        noStroke();

        // Sets the color mode
        colorMode(HSB, 255);

        // Sets the frame rate.
        frameRate(60);
    }

    /**
     * Clears all particles if the C key was pressed
     */
    keyPressed() {
        // Clears the particles list containing all the instances of particles if the c key is pressed.
        if (key === 'c' || key === 'C')	{
            this._particles = [];
        }
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
        for (const element of this._particles.values()) {

            // If gravity is set to true the _particles new velocities would be calculated.
            if (toolbar._gravity) element.handleInteractions();

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
        this._colorSlider = createSlider(0, 255, 127);

        // Create Viscosity slider
        this._viscositySlider = createSlider(0.3, 1, 0.65, 0.05);

        // Create Size slider
        this._sizeSlider = createSlider(0.015, 0.03, 0.0225, 0.001);

        // Create the Toggle Gravity button. Also sets the changeGravity function to be called when the button is pressed.
        this._toggleGravity = createButton('Toggle Gravity');
        this._toggleGravity.mousePressed(this.changeGravity.bind(this));

        // Create the Toggle Random colours button. Also sets the changeRandomise function to be called when the button is pressed.
        this._toggleRandomise = createButton('Randomise');
        this._toggleRandomise.mousePressed(this.changeRandomise.bind(this));

        // Initialises the background colour for the buttons.
        this._toggleGravity.style('background', 'green');
        this._toggleRandomise.style('background', 'red');

        // Initialises the text colour for the buttons.
        this._toggleGravity.style('color', 'white');
        this._toggleRandomise.style('color', 'white');

        // Standardises the size of the buttons.
        this._toggleGravity.style('width', '100px');
        this._toggleRandomise.style('width', '100px');
    }

    /**
     * Positions the toolbar in respect to the current window size. Used when the toolbar is initially setup and when the window is re-sized.
     */
    positionToolbar() {

        // (re)positions all the sliders & buttons. (mainly used in the case of a window resize).
        this._colorSlider.position(windowWidth / 10, windowHeight - (windowHeight / 20));
        this._viscositySlider.position((windowWidth / 10) + 200, windowHeight - (windowHeight / 20));
        this._sizeSlider.position((windowWidth / 10) + 400, windowHeight - (windowHeight / 20));
        this._toggleGravity.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) - 24);
        this._toggleRandomise.position((windowWidth / 10) - 120, (windowHeight - (windowHeight / 20)) + 1);
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

        // Toggles the _gravity button. When false the _gravity variable is set to true and vice versa. The _toggleGravity button background is set to green or red (respectively).
        if (this._gravity === false) {
            this._gravity = true;
            this._toggleGravity.style('background', 'green');
        } else {
            this._gravity = false;
            this._toggleGravity.style('background', 'red');
        }

    }

    /**
     * The function that is called when the randomise button is toggled. Sets the randomise variable to true when false and vice versa. Also changes the randomise button colour when toggled.
     */
    changeRandomise() {

        // Toggles the _randomise button. When false the _randomise variable is set to true and vice versa. The _toggleRandomise button background is set to green or red (respectively).
        if (this._randomise === false) {
            this._randomise = true;
            this._toggleRandomise.style('background', 'green');
        } else {
            this._randomise = false;
            this._toggleRandomise.style('background', 'red');
        }
    }

    /**
     * This is called from the draw function to set each of the colour, size & viscosity variables depending on the value on the sliders. If randomise is set to true the value of the colour & size slider is incremented.
     */
    setVariables() {

        // If the value of randomise is true the values of the colour and size slider is incremented.
        if (this._randomise === true) {
            this._colorSlider.value((this._colorSlider.value() + 5) % 256);
            this._sizeSlider.value((this._sizeSlider.value() + 0.001) % 0.031);
        }

        // Sets the particle colour and viscosity to the slider value.
        this._particleColor = color(this._colorSlider.value(), 255, 255, 127);
        this._viscosity = this._viscositySlider.value();
    }

    /**
     * Creates a new particle. Called when the mouse is pressed or dragged. A new particle is created as long as the cursor is outside of the toolbar. Also deletes the oldest particle if the particle limit is reached.
     */
    createParticle() {

        // Checks to make sure Particles are only created if the user clicks outside the toolbar inside the canvas.
        if (mouseY < windowHeight-(windowHeight/10)) {
            this._particles.push(new Particle(mouseX, mouseY));
        }

        // Deletes the oldest particle if the amount of particles on screen is over the limit.
        if (this._particles.length > this._maximumParticles) {
            this._particles.shift();
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
        this._xPos = x;
        this._yPos = y;
        this._xVel = velX;
        this._yVel = velY;

        // Particle mass/size is the slider value plus or minus a constant (0.08). Sets the particle colour depending on the slider value.
        this._mass = random(toolbar._sizeSlider.value() - 0.008, toolbar._sizeSlider.value() + 0.008);
        this._color = toolbar._particleColor;
    }

    /**
     * Moves the particle depending on it's current position and velocities.
     */
    move() {

        // Moves the particle depending on the velocity in the x-axis or y-axis.
        this._xPos += this._xVel;
        this._yPos += this._yVel;
    }

    /**
     * Draws the particle onto the canvas.
     */
    display() {

        // Sets the colour for the particle.
        fill(this._color);
        // Draws the particle, the mass*1000 give the size.
        ellipse(this._xPos, this._yPos, this._mass*1000, this._mass*1000);
    }

    /**
     * Updates the particle velocity depending on the distance to the other particles and if it is in close proximity to the mouse.
     */
    handleInteractions() {


        // The force & distance between the particles.
        let x;
        let y;
        let dis;
        let force;

        // The new velocity of the particle.
        let accX = 0;
        let accY = 0;

        // particle interaction the particles attract/repel each other. Checks current particle with all other particles.
        for (const element of toolbar._particles.values()) {

            // If the current element is not the same as the current particle.
            if (this != element) {

                // Calculates distance of both particles in the x-axis and y-axis.
                x = element._xPos - this._xPos;
                y = element._yPos - this._yPos;

                // Calculates the hypotenuse between both the particles which is the distance between the two particles.
                dis = sqrt(x * x + y * y);

                // If the distance is less than a certain amount (.5) the distance is changed to .5. This is to reduce overlap between particles.
                if (dis < .5) dis = .5;

                // calculates the force between the particles with a constant (380).
                force = (dis - 380) * element._mass / dis;

                // Scales the force in the x-axis and y-axis to find the new velocity of the particle.
                accX += force * x;
                accY += force * y;
            }

            // Makes sure the particles are moved only when the cursor is inside the canvas.
            if (mouseY < windowHeight-(windowHeight/10)) {

                // Checks to see the distance of the mouse to the particle.
                x = mouseX - this._xPos;
                y = mouseY - this._yPos;
                dis = sqrt(x * x + y * y);

                // Adds a dampening effect to the distance.
                if (dis < 40) dis = 40;
                if (dis > 50) dis = 50;

                // Calculates the force between the mouse and the particle.
                force = (dis - 50) / (5 * dis);

                // Updates the value of the scaled force in the x-axis and y-axis to find the new velocity of the particle.
                accX += force * x;
                accY += force * y;

            }

        }

        // Updates the particle velocity depending on the 'current velocity' * 'viscosity' + 'scaled force' * 'mass'
        this._xVel = this._xVel * toolbar._viscosity + accX * this._mass;
        this._yVel = this._yVel * toolbar._viscosity + accY * this._mass;

    }

    /**
     * Sketch from https://www.openprocessing.org,
     *
     * Called: Jelly Sim,
     *
     * By: nebulaeandstars,
     *
     * Link: https://www.openprocessing.org/sketch/587065,
     *
     * Licence: https://www.openprocessing.org/home/tos
     */

}