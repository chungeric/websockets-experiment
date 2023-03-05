export default class Player {
  constructor(x, y, color, lifetime) {
    this.x = 0;
    this.y = 0;
    this.color = `220, 80, 60`; // hsl
    this.trail = []; // [{ x, y, age }]
    this.lifetime = 30; // 30 frames
  }
  update(x, y) {
    this.trail.forEach((trailItem, i) => {
      this.trail[i] = { ...trailItem, age: age + 1 };
      if (trailItem.age >= 30) this.trail.splice(i, 1);
    })
    this.trail.push(this.x, this.y);
    this.x = x;
    this.y = y;
  }
  drawCircle(ctx, x, y, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const xx = ctx.canvas.clientWidth * x;
    const yy = ctx.canvas.clientHeight * y;
    ctx.beginPath();
    ctx.arc(xx, yy, 100, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${this.color})`;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  draw(ctx) {
    this.drawCircle(ctx, this.x, this.y, 1);
    this.trail.forEach(trailItem => this.drawCircle(ctx, trailItem.x, trailItem.y, 1 - trailItem.age / this.lifetime));
  }
}