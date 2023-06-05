let fps = 60;
let cr = 1;
let r = 20;

let particles = [];
let n = 10;
let v = 200;
let m = 1;          // yoctograms

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(fps);
    //particles.push(new Particle(100, 500, 100, 0, 20, 1))
    //particles.push(new Particle(800, 500, -100, 0, 20, 1))

}

function draw() {
    background(220);

    for (let i = 0; i < particles.length; i++){
        for(let j = i + 1; j < particles.length; j++)
            if(particles[i].checkCollision(particles[j]))
                particles[i].collide(particles[j]);

        particles[i].update();
    }

    let systemEnergy = 0;
    for (let i = 0; i < particles.length; i++)
        systemEnergy += (particles[i].m * particles[i].v.magSq()) / 2;

    textAlign(CENTER);
    textSize(32);
    text(round(systemEnergy).toString()+ " yJ", width - 100, 50);
}

class Particle {
    constructor(x, y, vx, vy, radius, m) {
        this.p = createVector(x, y);
        this.v = createVector(vx, vy);

        this.m = m;
        this.radius = radius;
    }

    update() {
        circle(this.p.x, this.p.y, this.radius * 2);
        this.p.add(this.v.copy().mult(1 / fps));

        if (this.p.x + this.radius > width || this.p.x - this.radius < 0) {
            this.v.x *= -1 * cr;
            this.p.x = constrain(this.p.x, this.radius, width - this.radius);
        }

        if (this.p.y + this.radius > height || this.p.y - this.radius < 0) {
            this.v.y *= -1 * cr;
            this.p.y = constrain(this.p.y, this.radius, height - this.radius);
        }
    }
    checkCollision(particle) {
        if(this.p.dist(particle.p) >=  this.radius + particle.radius)
            return false;

        let dp = this.p.copy().sub(particle.p);
        let dv = this.v.copy().sub(particle.v);
        let db = dv.dot(dp);
        return db < 0;

    }

    collide(particle) {
        let scalar;
        let dv = this.v.copy().sub(particle.v);
        let dp = this.p.copy().sub(particle.p);

        scalar = ((2 * particle.m) / (this.m + particle.m)) * (dv.dot(dp) / dp.magSq());
        this.v.sub(dp.copy().mult(scalar));

        scalar = ((2 * this.m) / (this.m + particle.m)) * (dv.dot(dp) / dp.magSq());
        dp.mult(-1);
        particle.v.sub(dp.copy().mult(scalar));

    }
}

function mouseClicked() {
    let vx = random(-v, v);
    for(let i = 0; i < particles.length; i++)
        if(particles[i].checkCollision(new Particle(mouseX, mouseY, vx, 0, r, m)))
            return;

    particles.push(new Particle(mouseX, mouseY, vx, random([-1, 1]) * sqrt(v ** 2 - vx ** 2), r, m));
}

function keyPressed() {
    if (keyCode === 67)
        particles = [];
}