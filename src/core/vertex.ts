import { getSelMark, roundToStep } from "../utils";
import { Cursor } from "./cursor";

export class Vertex {
    x: number;
    y: number;
    mx: number;
    my: number;
    hover: boolean;
    selected: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.mx = 0;
        this.my = 0;
        this.hover = false;
        this.selected = false;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.mx = 0;
        this.my = 0;
    }

    move(cursor: Cursor) {
        this.mx = cursor.gridPosition.x - cursor.gridStartPos.x;
        this.my = cursor.gridPosition.y - cursor.gridStartPos.y;
    }

    applyMove(step: number) {
        this.x = this.x + this.mx;
        this.y = this.y + this.my;
        /*if ( this.mx ){
            this.x = roundToStep(this.x + this.mx, step);
        }
        if (this.my){
            this.y = roundToStep(this.y + this.my, step);
        }*/
        this.my = 0;
        this.mx = 0;
    }

    isHover(sc: number, cursor: Cursor) {
        let x = cursor.realPosition.x;
        let y = cursor.realPosition.y;
        return getSelMark(this.x, this.y, x, y, sc);
    }

    wasHover(sc: number, cursor: Cursor) {
        let x = cursor.startPos.x;
        let y = cursor.startPos.y;
        return getSelMark(this.x, this.y, x, y, sc);
    }

    dublicate() {
        var res = new Vertex(this.x, this.y);
        return res;
    }

    render(ctx: CanvasRenderingContext2D, sc: number, rd: boolean) {
        ctx.fillStyle = "rgb(0,0,0)";
        if (this.hover) {
            ctx.fillStyle = "rgb(200,150,0)";
        }
        if (this.selected) {
            ctx.fillStyle = "rgb(0,255,0)";
        }
        //ctx.fillRect(this.x*sc-5,this.y*sc-5,5,5);
        if (!rd) {
            ctx.fillRect((this.mx + this.x) * sc - 3, (this.my + this.y) * sc - 3, 6, 6);
        }
        else {
            if (this.hover) {
                ctx.fillStyle = "rgb(0,0,150)";
            } else { ctx.fillStyle = "rgb(0,0,80)"; }
            ctx.beginPath();
            ctx.arc(this.x * sc, this.y * sc, 3, 0, Math.PI * 2);

            ctx.fill();
            //this.ctx.stroke();
            ctx.closePath();
        }
    }

}
