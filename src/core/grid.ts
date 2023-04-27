export class Grid {
    step: number;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, step: number) {
        this.step = step;
        this.ctx = ctx;
    }

    render(sc: number) {
        console.log('grid')
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(90,90,90)";
        for (let i = 0; i < this.ctx.canvas.width; i += this.step * sc) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.ctx.canvas.height);
        }
        for (let i = 0; i < this.ctx.canvas.height; i += this.step * sc) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.ctx.canvas.width, i);
        }
        this.ctx.stroke();
    }

}