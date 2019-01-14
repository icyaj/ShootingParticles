function setup() {

    // Initialises the toolbar.
    toolbar = new ShootingParticles();

}

function draw() {

    // Draws the plane.
    toolbar.draw();

}

// Resize _canvas when window is re-sized
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    toolbar.positionToolbar();
}


// creates a new particle when mouse is dragged
function mouseDragged() {
    toolbar.createParticle();
}
