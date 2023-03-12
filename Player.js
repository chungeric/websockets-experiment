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
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.color = generateRandomColor(); // hsl
    this.trail = []; // [{ x, y, age }]
  }
  update(x, y) {
    this.trail.forEach((trailItem, i) => {
      this.trail[i] = { ...trailItem, age: trailItem.age + 1 };
      if (trailItem.age >= 30) this.trail.splice(i, 1);
    })
    this.trail.push({ x: this.x, y: this.y, age: 0 });
    if (x) {
      this.x = x;
    }
    if (y) {
      this.y = y;
    }
  }
  addToScore(pointsToAdd = 1) {
    this.score += pointsToAdd;
  }
  // drawCircle(ctx, x, y, alpha) {
  //   ctx.globalAlpha = alpha;
  //   ctx.fillStyle = 'black';
  //   ctx.fillRect(0, 0, canvas.width, canvas.height);
  //   const xx = ctx.canvas.clientWidth * x;
  //   const yy = ctx.canvas.clientHeight * y;
  //   ctx.beginPath();
  //   ctx.arc(xx, yy, 100, 0, 2 * Math.PI);
  //   ctx.fillStyle = `hsl(${this.color})`;
  //   ctx.fill();
  //   ctx.globalAlpha = 1;
  // }
  // draw(ctx) {
  //   this.drawCircle(ctx, this.x, this.y, 1);
  //   this.trail.forEach(trailItem => this.drawCircle(ctx, trailItem.x, trailItem.y, 1 - trailItem.age / this.lifetime));
  // }
}

module.exports = Player;