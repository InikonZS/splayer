import { getSel, getSelMark, inBox, roundToStep } from "../utils";
import { Cursor } from "./cursor";
import { Vertex } from "./vertex";

export class Spline {
    ctx: CanvasRenderingContext2D;
    hovered: Vertex[];
    points: Vertex[];
    midIndex: number;
    width: number;
    pad: boolean;
    de: boolean;
    ghostPoint: Vertex;
    hover: boolean;
    selected: boolean;
    type: string;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.hovered = [];
        this.points = [];
        this.midIndex = 0;
        this.width = 4;
        this.pad = false;
        this.de = true;
        //this.midPoints=[];
        this.ghostPoint = new Vertex(0, 0);
        this.hover = false;
        this.selected = false;
        this.type = "spline";

    }

    setWidth(wdt: number) {
        this.width = wdt;
    }

    move(cursor: Cursor) {
        this.points.forEach((it) => {
            it.move(cursor)
        });
    }

    applyMove() {
        this.points.forEach((it) => {
            it.applyMove()
        });
    }

    add() {
        let lx = this.ghostPoint.x;
        let ly = this.ghostPoint.y;

        if (this.points.length > 0) {
            let pu = this.calcBi(1);
            let px1 = pu[0];
            let py1 = pu[1];
            let np = new Vertex(px1, py1);
            if (!((px1 == lx) && (py1 == ly))) {
                this.points.push(np);
            }
        }

        this.points.push(this.ghostPoint);
        this.ghostPoint = new Vertex(lx, ly);

    }

    isPointHover(sc: number, cursor: Cursor) { // возвращаем первую точку под курсором
        let x = cursor.realPosition.x;
        let y = cursor.realPosition.y;
        for (let i = 0; i < this.points.length; i++) {
            let px = this.points[i].x;
            let py = this.points[i].y;
            if (getSelMark(px, py, x, y, sc)) { return this.points[i] };
        }
        return null;
    }

    wasPointHover(sc: number, cursor: Cursor) { // возвращаем первую точку до перемещения под курсором
        let x = cursor.startPos.x;
        let y = cursor.startPos.y;
        for (let i = 0; i < this.points.length; i++) {
            let px = this.points[i].x;
            let py = this.points[i].y;
            if (getSelMark(px, py, x, y, sc)) { return this.points[i] };
        }
        return false;
    }

    _hover(sc: number, x: number, y: number) {
        /* for (let i=1; i<this.points.length; i++){
             let px=this.points[i].x;
             let py=this.points[i].y;
             let ex=this.points[i-1].x;
             let ey=this.points[i-1].y;
             if (getSel(px,py,ex,ey,x,y,sc)) {return true};
         }
         return false;    */
        let cs = false;
        for (let i = 0; i < this.points.length; i++) {

            let px = this.points[i].x;
            let py = this.points[i].y;
            if (i > 0) {
                let ex = this.points[i - 1].x;
                let ey = this.points[i - 1].y;
                cs ||= getSel(px, py, ex, ey, x, y, sc);
            } else {
                cs ||= getSelMark(px, py, x, y, sc);
            }
        }
        return cs;
    }

    isHover(sc: number, cursor: Cursor) {
        let x = cursor.realPosition.x;
        let y = cursor.realPosition.y;
        return this._hover(sc, x, y);
    }

    wasHover(sc: number, cursor: Cursor) {
        let x = cursor.startPos.x;
        let y = cursor.startPos.y;
        return this._hover(sc, x, y);
    }

    select(sc: number, cursor: Cursor) {
        let x = cursor.realPosition.x;
        let y = cursor.realPosition.y;
        let xx = cursor.startPos.x;
        let yy = cursor.startPos.y;
        let cs = false;
        let bx = false;
        for (let i = 0; i < this.points.length; i++) {

            let px = this.points[i].x;
            let py = this.points[i].y;
            if (i > 0) {
                let ex = this.points[i - 1].x;
                let ey = this.points[i - 1].y;
                cs ||= getSel(px, py, ex, ey, x, y, sc);
            } else {
                cs ||= getSelMark(px, py, x, y, sc);
            }

            if (cursor.cloud) {
                bx ||= inBox(x, y, xx, yy, px, py, sc);
            }
            this.hover = cs || bx;
        }
        return this.hover;
    }

    selectMarker(sc: number, cursor: Cursor) {
        this.hovered = [];
        for (let i = 0; i < this.points.length; i++) {
            let px = this.points[i].x;
            let py = this.points[i].y;
            let x = cursor.realPosition.x;
            let y = cursor.realPosition.y;
            let xx = cursor.startPos.x;
            let yy = cursor.startPos.y;
            let hov = getSelMark(px, py, x, y, sc) || (inBox(x, y, xx, yy, px, py, sc) && cursor.cloud);
            this.points[i].hover = hov;
            if (hov) { this.hovered.push(this.points[i]); }
        }
    }

    split(step: number) {
        var res = []
        for (let i = 0; i < this.points.length; i++) {
            res.push(this.points[i]);
            if ((i == this.midIndex - 1)) {
                var nd = this.getMidle(this.midIndex);
                nd.x = roundToStep(nd.x, step);//app.grid.step);
                nd.y = roundToStep(nd.y, step);//app.grid.step);
                res.push(nd);
            }
        }
        this.points = res;
        return nd;
    }
    isMidle(sc:number, cursor: Cursor, step: number) {
        for (let i = 1; i < this.points.length; i++) {
            let gm = this.getMidle(i);
            let px = roundToStep(gm.x, step);//app.grid.step)
            let py = roundToStep(gm.y, step);//app.grid.step);
            let x = cursor.realPosition.x;
            let y = cursor.realPosition.y;
            let hov = getSelMark(px, py, x, y, sc)
            if (hov) { this.midIndex = i; return i; }

        }
        return false;
    }

    getMidle(i: number) {
        //var res=new Spline(this.ctx);

        //(let i=1; i<this.points.length; i++){
        let px = (this.points[i].x + this.points[i].mx);
        let py = (this.points[i].y + this.points[i].my);
        let px1 = (this.points[i - 1].x + this.points[i - 1].mx);
        let py1 = (this.points[i - 1].y + this.points[i - 1].my);
        var vert = new Vertex((px + px1) / 2, (py + py1) / 2);

        return vert;
        //}
        // return res;  
    }

    dublicate() {
        var res = new Spline(this.ctx);
        res.pad = this.pad;
        res.width = this.width;
        this.points.forEach((it) => {
            res.points.push(it.dublicate());
        })
        return res;
    }

    render(sc: number, gh: boolean, hover: boolean, selected: boolean, noMark: boolean, cursor: Cursor, step: number) {
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
            //this.ctx.lineWidth=1;
            this.ctx.beginPath();
            this.ctx.arc((this.points[0].x + this.points[0].mx) * sc, (this.points[0].y + this.points[0].my) * sc, 5 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgb(50,100,0)";
            this.ctx.fill();
            // this.ctx.stroke();
            this.ctx.closePath();
            //this.ctx.stroke
            this.ctx.beginPath();
            this.ctx.arc((this.points[0].x + this.points[0].mx) * sc, (this.points[0].y + this.points[0].my) * sc, 1 * sc, 0, Math.PI * 2);
            this.ctx.fillStyle = "rgb(0,0,0)";
            this.ctx.fill();
            //this.ctx.stroke();
            this.ctx.closePath();
            //this.ctx.lineWidth=this.width*sc;
        }
        // if (this.selected){
        //var mids=this.getMidles();
        // this.midPoints.forEach((it)=>{it.render(this.ctx,sc)})
        // }
        for (let i = 0; i < this.points.length; i++) {
            let px = (this.points[i].x + this.points[i].mx) * sc;
            let py = (this.points[i].y + this.points[i].my) * sc;
            //let px=(this.points[i].x)*sc;
            //let py=(this.points[i].y)*sc;
            i == 0 ? this.ctx.moveTo(px, py) : this.ctx.lineTo(px, py);
            /*  if (this.selected&&(!noMark)){
                  this.points[i].render(this.ctx, sc);
                  if (i>0) {
  
                      let a=this.getMidle(i);
                      let nd=this.getMidle(i);
                      nd.x=roundToStep(nd.x,app.grid.step);
                      nd.y=roundToStep(nd.y,app.grid.step);
                      a.hover=nd.isHover(sc,app.cursor);
                      a.render(this.ctx,sc);}
              }*/
        }
        if (gh) {
            if (this.points.length > 0) {
                // let lx=this.points[this.points.length-1].x*sc;
                //let ly=this.points[this.points.length-1].y*sc;
                let px = this.ghostPoint.x * sc;
                let py = this.ghostPoint.y * sc;
                let pu = this.calcBi(sc);
                let px1 = pu[0];
                let py1 = pu[1];
                /*  if ((py-ly)*(px-lx)>0){
                      if (Math.abs(py-ly)<Math.abs(px-lx)){
                          px1=(px)-((py-ly));
                          py1=ly;
                      }else{
                          py1=(py)-((px-lx));
                          px1=lx;   
                      }
                  }else{
                      if (Math.abs(py-ly)<Math.abs(px-lx)){
                          px1=(px)+((py-ly));
                          py1=ly;
                      }else{
                          py1=(py)+((px-lx));
                          px1=lx;   
                      }    
                  }
                  */
                this.ctx.lineTo(px1, py1);
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
                    nd.x = roundToStep(nd.x, step);//app.grid.step);
                    nd.y = roundToStep(nd.y, step);//app.grid.step);
                    a.hover = nd.isHover(sc, cursor);//app.cursor);
                    a.render(this.ctx, sc, true);
                }
            }
        }

        this.selected = sll;
        this.ctx.lineWidth = 1;
    }

    calcBi(sc: number) {
        let px = this.ghostPoint.x * sc;
        let py = this.ghostPoint.y * sc;
        let lx = this.points[this.points.length - 1].x * sc;
        let ly = this.points[this.points.length - 1].y * sc;
        let px1;
        let py1;
        if ((py - ly) * (px - lx) > 0) {
            if (Math.abs(py - ly) < Math.abs(px - lx)) {
                px1 = (px) - ((py - ly));
                py1 = ly;
            } else {
                py1 = (py) - ((px - lx));
                px1 = lx;
            }
        } else {
            if (Math.abs(py - ly) < Math.abs(px - lx)) {
                px1 = (px) + ((py - ly));
                py1 = ly;
            } else {
                py1 = (py) + ((px - lx));
                px1 = lx;
            }
        }
        return [px1, py1];
    }

}
