function rr(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function generateRandomColor() {
  const h = Math.round(Math.random() * 255);
  const s = rr(80, 95);
  const l = 65;
  return `${h}, ${s}%, ${l}%`;
}

class Player {
  constructor() {
    this.x = null;
    this.y = null;
    this.hasMoved = false;
    this.score = 0;
    this.color = generateRandomColor(); // hsl
    this.trail = []; // [{ x, y, age }]
    this.lifespan = 30;
    this.radius = 12;
  }
  update() {
    this.trail.forEach((trailItem, i) => {
      let newTrailItemX = trailItem.x + ((Math.random() * 0.01 - 0.005) * (trailItem.age / this.lifespan));
      let newTrailItemY = trailItem.y + ((Math.random() * 0.01 - 0.005) * (trailItem.age / this.lifespan));
      if (
        trailItem.x === this.x &&
        trailItem.y === this.y
      ) {
        newTrailItemX = this.x;
        newTrailItemY = this.y;
      }
      this.trail[i] = { x: newTrailItemX, y: newTrailItemY, age: trailItem.age + 1 };
      if (trailItem.age >= this.lifespan) this.trail.splice(i, 1);
    })
    this.trail.push({ x: this.x, y: this.y, age: 0 });
  }
  updatePos(x, y) {
    if (!this.hasMoved) this.hasMoved = true;
    this.x = x;
    this.y = y;
  }
  addToScore(pointsToAdd = 1) {
    this.score += pointsToAdd;
  }
}

module.exports = Player;