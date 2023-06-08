import { roundToStep } from '../utils';
import { Cursor } from './cursor';
import {Spline} from './spline';
import { Vertex } from './vertex';

export class LinearSpline extends Spline{
    qPoints: Vertex[] = [];
    add() {
        let lx = this.ghostPoint.x;
        let ly = this.ghostPoint.y;

        this.points.push(this.ghostPoint);
        if (this.points.length){
            this.qPoints.push(new Vertex(lx+10, ly + 10));
        }
        this.ghostPoint = new Vertex(lx, ly);

    }

    drawMarker(color1: string, color2: string, sc: number, point: Vertex){
        this.ctx.beginPath();
            this.ctx.arc((point.x + point.mx) * sc, (point.y + point.my) * sc, 5 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = color1;
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.beginPath();
            this.ctx.arc((point.x + point.mx) * sc, (point.y + point.my) * sc, 1 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = color2;
            this.ctx.fill();
            this.ctx.closePath();
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
            this.drawMarker("rgb(50,100,0)", "rgb(0,0,0)", sc, this.points[0]);
        }

        for (let i = 0; i < this.points.length; i++) {
            let px = (this.points[i].x + this.points[i].mx) * sc;
            let py = (this.points[i].y + this.points[i].my) * sc;
            let cx = (this.qPoints[i].x + this.qPoints[i].mx) * sc;
            let cy = (this.qPoints[i].y + this.qPoints[i].my) * sc;
            i == 0 ? this.ctx.moveTo(px, py) : this.ctx.bezierCurveTo(cx, cy, cx, cy, px, py);

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

        for (let i = 0; i < this.qPoints.length; i++) {
            if (this.selected && (!noMark)) {
                this.qPoints[i].render(this.ctx, sc, false);
            }
        }

        this.selected = sll;
        this.ctx.lineWidth = 1;
    }
}