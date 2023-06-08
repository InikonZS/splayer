import { roundToStep } from '../utils';
import { Cursor } from './cursor';
import {Spline} from './spline';
import { Vertex } from './vertex';

export class LinearSpline extends Spline{
    add() {
        let lx = this.ghostPoint.x;
        let ly = this.ghostPoint.y;

        this.points.push(this.ghostPoint);
        this.ghostPoint = new Vertex(lx, ly);

    }

    render(sc: number, ghost: boolean, hover: boolean, selected: boolean, noMark: boolean, cursor: Cursor, step: number) {
        //this.getMidles();
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        var sll = this.selected;
        this.selected ||= selected;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.width * sc;
        this.ctx.strokeStyle = "rgb(0,0,0)";
        if (hover) {
            this.ctx.strokeStyle = "rgb(80,0,0)";
        }
        if (this.selected) {
            this.ctx.strokeStyle = "rgb(255,0,0)";
        }
        //to do draw pads upper 
        if (this.pad && this.points[0]) {
            this.ctx.beginPath();
            this.ctx.arc((this.points[0].x + this.points[0].mx) * sc, (this.points[0].y + this.points[0].my) * sc, 5 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgb(50,100,0)";
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.arc((this.points[0].x + this.points[0].mx) * sc, (this.points[0].y + this.points[0].my) * sc, 1 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgb(0,0,0)";
            this.ctx.fill();
            this.ctx.closePath();
        }

        for (let i = 0; i < this.points.length; i++) {
            let px = (this.points[i].x + this.points[i].mx) * sc;
            let py = (this.points[i].y + this.points[i].my) * sc;
            i == 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);

        }
        if (ghost) {
            if (this.points.length > 0) {
                let px = this.ghostPoint.x * sc;
                let py = this.ghostPoint.y * sc;
                this.ctx.lineTo(px, py);
            }

        }
        this.ctx.stroke();
        for (let i = 0; i < this.points.length; i++) {
            if (this.selected && (!noMark)) {
                this.points[i].render(this.ctx, sc, false);
                if (i > 0) {

                    let a = this.getMidle(i);
                    let nd = this.getMidle(i);
                    nd.x = roundToStep(nd.x, step);
                    nd.y = roundToStep(nd.y, step);
                    a.hover = nd.isHover(sc, cursor);
                    a.render(this.ctx, sc, true);
                }
            }
        }

        this.selected = sll;
        this.ctx.lineWidth = 1;
    }
}