import { Cursor } from "./cursor";
import { Spline } from "./spline";
import { Vertex } from "./vertex";

export class Group {
    entries: (Spline|Group)[];
    type: string;
    main: boolean;
    ctx: any;
    de: boolean;
    selPoints: Spline;
    selection: any[];
    hover: any;
    selected: any;
    
    constructor(ctx: CanvasRenderingContext2D) {
        this.entries = [];
        this.type = "group";
        this.main = false;
        this.ctx = ctx;
        this.de = true;
        //this.selectionPoints;
        this.selPoints = new Spline(this.ctx);
        this.selection = [];
    }
    delete() {
        var res = [];
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].de = false;

        }
        this.selection = [];
        for (let i = 0; i < this.entries.length; i++) {
            (this.entries[i].de != false) ? res.push(this.entries[i]) : this.entries[i].de = true;

        }
        this.entries = res;
        //app.render();
    }

    groupe() {
        var res = [];
        var gr = new Group(this.ctx);
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i].de = false;

        }
        this.selection = [];
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].de != false) { res.push(this.entries[i]) } else {
            this.entries[i].de = true;
                this.entries[i].selected = false;
                this.entries[i].hover = false;
                gr.entries.push(this.entries[i])
            }

        }
        this.entries = res;
        this.entries.push(gr);
        //app.render();
    }

    unGroupe() {
        var res: (Spline | Group)[] = [];
        this.selection.forEach((it) => {
            if ((it instanceof Group) && (it.type == "group")) {
                it.de = false;
                it.entries.forEach((jt) => {
                    jt.de = true;
                    this.entries.push(jt);
                })
            } else { it.de = true; }
        });
        this.entries.forEach((it) => {
            if (it.de != false) {
                res.push(it);
            }
        });
        this.selection = [];
        this.entries = res;
    }

    setHover(hover: boolean) {
        this.hover = hover;
        this.entries.forEach((it) => {
            if ((it instanceof Group) && (it.type == "group")) { it.setHover(hover); }
            else {
                it.hover = hover;
            }
        });
    }

    /*   setSelect(hover){
           this.selected=hover;
           this.entries.forEach((it)=>{
               if (it.type=="group"){it.setHover(hover);}
               else{
                   it.selected=hover;
               }
           });    
       }*/

    select(sc: number, cursor: Cursor) {
        let res = false;
        //this.hover=false;
        this.setHover(false)
        this.entries.forEach((it) => {
            res ||= it.select(sc, cursor);
        });
        if (res) {
            this.setHover(true);
            //this.entries.forEach((it)=>{
            //    it.hover=true;
            //});
            //this.hover=true;
        }
        return res;
    }

    move(cursor: Cursor) {
        this.entries.forEach((it) => {
            it.move(cursor);
        });
    }

    applyMove() {
        this.entries.forEach((it) => {
            it.applyMove();
        });
    }

    dublicate() {
        var res = new Group(this.ctx);
        this.entries.forEach((it) => {
            res.entries.push(it.dublicate());
        })
        return res;
    }

    selectHovered() {
        this.selection = []
        this.selected = this.hover;
        this.entries.forEach((it) => {
            if ((it instanceof Group) && (it.type == "group")) { it.selectHovered() } else {
                it.selected = it.hover;
            }
            if (it.selected) { this.selection.push(it) };
        });
    }

    selectHoveredPoints() {
        //this.selectionPoints=[];
        this.selPoints = new Spline(this.ctx);
        this.entries.forEach((it) => {
            if ((it instanceof Spline) && (it.type == "spline") ) {
                it.points.forEach((jt) => {
                    jt.selected = jt.hover;
                    if (jt.selected) {
                        //this.selectionPoints.push(jt); 
                        this.selPoints.points.push(jt)
                    };
                })
            }
        });
    }


    isMidle(sc: number, cursor: Cursor, step: number) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].type == "spline") {
                var index = this.entries[i].isMidle(sc, cursor, step);
                if (index) { return this.entries[i]; }
            }
        }
        return false;
    }

    isPointHover(sc: number, cursor: Cursor): Vertex {
        for (let i = 0; i < this.entries.length; i++) {
            var point = this.entries[i].isPointHover(sc, cursor);
            //return point;
            if (point) { return point; }
        }
        return null;
    }

    isHover(sc: number, cursor: Cursor) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].isHover(sc, cursor)) { return this.entries[i]; }
        }
        return false;
    }

    wasHover(sc: number, cursor: Cursor) {
        for (let i = 0; i < this.entries.length; i++) {
            if (this.entries[i].wasHover(sc, cursor)) { return this.entries[i]; }
        }
        return false;
    }
    setWidth(wdt: number) {
        this.entries.forEach((it) => {
            it.setWidth(wdt);
        })
    }
    getWidth(): number {
        var res;
        for (let i = 0; i < this.entries.length; i++) {
            var it = this.entries[i];
            if ((it instanceof Spline) && it.type == "spline") { res = it.width } 
            if ((it instanceof Group) && it.type == "group") { res = it.getWidth(); }
            if (res) { return res; }
        }
    }

    /*dublicate(){
        var res=new Spline(this.ctx);
        this.points.forEach((it)=>{
            res.points.push(it.dublicate());
        })
        return res;
    }*/

    render(sc: number, cursor: Cursor, step: number) {
        this.entries.forEach((it) => it.render(sc, false, it.hover, this.selected, !this.main, cursor, step));
    }
}