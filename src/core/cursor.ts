import { roundToStep } from "../utils";
import { Vertex } from "./vertex";

export class Cursor {
    realPosition: Vertex;
    gridPosition: Vertex;
    startPos: Vertex;
    gridStartPos: Vertex;
    hidden: boolean;
    cloud: boolean;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.realPosition = new Vertex(0, 0);
        this.gridPosition = new Vertex(0, 0);
        this.startPos = new Vertex(0, 0);
        this.gridStartPos = new Vertex(0, 0);
        //this.endPos = new Vertex (0, 0);
        this.hidden = false;
        this.cloud = false;
        this.ctx = ctx;
    }

    setPosition(x: number, y: number, step: number, sc: number) {
        this.realPosition.setPosition(x / sc, y / sc);
        this.gridPosition.setPosition(roundToStep(x / sc, step), roundToStep(y / sc, step));
    }

    startCloud(x: number, y: number, step: number, sc: number) {
        this.cloud = true;
        this.startPos.setPosition(x / sc, y / sc);
        this.gridStartPos.setPosition(roundToStep(x / sc, step), roundToStep(y / sc, step));
    }

    endCloud() {
        this.cloud = false;
    }

    render(sc: number) {
        //this.realPosition.render(this.ctx, sc);
        //this.gridPosition.render(this.ctx, sc);
        if (this.cloud && (!this.hidden)) {
            let xs = this.startPos.x * sc;
            let ys = this.startPos.y * sc;
            let xe = this.realPosition.x * sc;
            let ye = this.realPosition.y * sc;
            this.ctx.beginPath();
            this.ctx.strokeStyle = "rgb(255,0,0)";
            this.ctx.moveTo(xs, ys);
            this.ctx.lineTo(xs, ye);
            this.ctx.lineTo(xe, ye);
            this.ctx.lineTo(xe, ys);
            this.ctx.lineTo(xs, ys);
            this.ctx.stroke();
        }
    }
}