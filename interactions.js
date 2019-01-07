function handleInteractions(i, j) {
	for (var i = 0; i < particles.length; i++) {
	var accX = 0; var accY = 0;
		
		// particle interaction
		for (var j = 0; j < particles.length; j++) {
			if (i != j) {
				var x = particles[j].xPos - particles[i].xPos;
				var y = particles[j].yPos - particles[i].yPos;
				var dis = sqrt(x*x+y*y);
				if (dis < 1) dis = 1;
				
				var force = (dis-320)*particles[j].mass/dis;
				accX += force * x;
				accY += force * y;
			}
			
			// mouse interaction
			var x = mouseX - particles[i].xPos;
			var y = mouseY - particles[i].yPos;
			var dis = sqrt(x*x+y*y);
			
			// adds a dampening effect
			if (dis < 40) dis = 40;
			if (dis > 50) dis = 50;
			
			var force = (dis-50)/(5*dis);
			accX += force * x;
			accY += force * y;
		}
		particles[i].xVel = particles[i].xVel * viscosity + accX * particles[i].mass;
		particles[i].yVel = particles[i].yVel * viscosity + accY * particles[i].mass;
	}
}