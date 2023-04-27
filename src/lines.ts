/*document.addEventListener('DOMContentLoaded', onReady);
document.addEventListener('mousemove', onMove);
document.addEventListener('mousedown', onDown);
document.addEventListener('mouseup', onUp);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

var app;*/

import { downloadImage, getSel, getSelMark, inBox, roundToStep } from "./utils";
import { Vertex } from './core/vertex';
import { Spline } from './core/spline';
import { Group } from './core/group';
import { Cursor } from './core/cursor';
import { parsePath } from './svglib/pathParser';

/*function onReady() {
    app = new App(document);
    app.render();
}*/

function onMove(app: AppLegacy, e:MouseEvent) {
    var cx = (e.pageX - app.canvasDOM.offsetLeft) + app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop) + app.scrollDOM.scrollTop;
    app.setCursorPosition(cx, cy);

    if (app.tool == 0) {
        if (e.buttons == 1) {
            let hov = app.selection.selPoints.wasPointHover(app.scale, app.cursor);//app.selPoints.wasPointHover(app.scale,app.cursor);
            if (hov) {
                app.selection.selPoints.move(app.cursor);
                app.cursor.cloud = false;
            } else {

                if (app.selection.wasHover(app.scale, app.cursor)) {
                    app.selection.move(app.cursor);
                    //app.selection.entries.forEach((it)=>{
                    //    it.move(app.cursor);
                    app.cursor.cloud = false;
                    //});       
                }
            }
        }
    }
    if (app.tool == 1) {
        app.ghostSpline.ghostPoint.setPosition(app.cursor.gridPosition.x, app.cursor.gridPosition.y);
    }

    app.render();
}

function onDown(app: AppLegacy, e:MouseEvent) {
    var cx = (e.pageX - app.canvasDOM.offsetLeft) + app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop) + app.scrollDOM.scrollTop;
    var dx = (e.pageX - app.canvasDOM.offsetLeft);
    var dy = (e.pageY - app.canvasDOM.offsetTop);
    if ((dx < 0) || (dy < 0) || (((e.pageX - app.canvasDOM.offsetLeft)) > app.scrollDOM.clientWidth) || (((e.pageY - app.canvasDOM.offsetTop)) > app.scrollDOM.clientHeight)) { return false; }
    //console.log("mousedown");
    if (app.tool == 0) {
        if (e.buttons == 1) {
            //console.log("cpgcp");
            var sel = app.selection.isPointHover(app.scale, app.cursor);
            if (sel) {
                if (!sel.selected) {
                    app.selection.selectHoveredPoints(); //обновляем выделение
                    sel.selected = true;
                }
            } else {
                var sl = app.selection.isMidle(app.scale, app.cursor, app.grid.step);
                if (sl) {
                    const sele = (sl as Spline).split(app.grid.step);
                    app.selection.selectHoveredPoints(); //обновляем выделение
                    app.selection.selPoints.points.push(sele);
                    sele.selected = true;

                } else {
                    var selc = app.board.isHover(app.scale, app.cursor)
                    //console.log("cpgc");
                    if (selc) {
                        if (!selc.selected) {
                            app.board.selectHovered();
                            app.selection.entries = app.board.selection;
                            //app.selection.push(selc);
                            selc.selected = true;
                        }//console.log("cpg");
                        if (app.ctr == true) {

                            //var gr=new Group(app.ctx);
                            app.selection.entries.forEach((it) => {
                                console.log("cp");
                                //gr.entries.add(it.dublicate());
                                app.board.entries.push(it.dublicate());
                            })
                            //app.selection=gr;
                        }

                    }
                }
            }
            app.startCursorCloud(cx, cy);
        }
    }

    if (app.tool == 1) {
        if (e.buttons == 1) {
            app.ghostSpline.add();
        }
        if (e.buttons == 2) {
            if (app.ghostSpline.points.length == 0) {
                app.selTool(0);
            }
            if (app.ghostSpline.points.length > 1) {
                app.board.entries.push(app.ghostSpline);
            } else {
                app.ghostSpline.pad = true;
                app.board.entries.push(app.ghostSpline);
            }
            app.ghostSpline = new Spline(app.ctx);
            app.ghostSpline.ghostPoint.setPosition(app.cursor.gridPosition.x, app.cursor.gridPosition.y);


        }
    }
    app.render();
}

function onUp(app: AppLegacy, e:MouseEvent) {
    var cx = (e.pageX - app.canvasDOM.offsetLeft) + app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop) + app.scrollDOM.scrollTop;
    var dx = (e.pageX - app.canvasDOM.offsetLeft);
    var dy = (e.pageY - app.canvasDOM.offsetTop);
    if ((dx < 0) || (dy < 0) || (((e.pageX - app.canvasDOM.offsetLeft)) > app.scrollDOM.clientWidth) || (((e.pageY - app.canvasDOM.offsetTop)) > app.scrollDOM.clientHeight)) { return false; }

    if (app.tool == 0) {
        //не убираем выделение если переместили группу линий
        if (!app.selection.wasHover(app.scale, app.cursor)) {
            app.board.selectHovered();
            app.selection.entries = app.board.selection;
        }
        //не убираем выделение если перместили группу точек
        let hov = app.selection.selPoints.wasPointHover(app.scale, app.cursor);
        if (!hov) {
            app.selection.selectHoveredPoints();
        }
        //применяем перемещение
        app.selection.selPoints.applyMove();
        app.selection.applyMove();

    }
    //app.cursor.hidden=false;
    app.endCursorCloud();
    app.render();
}

function onKeyDown(app: AppLegacy, e:KeyboardEvent) {
    if (e.key == "Control") {
        app.ctr = true;
    }
}

function onKeyUp(app: AppLegacy, e:KeyboardEvent) {
    console.log(e.key);
    if (e.key == "Control") {
        app.ctr = false;
    }
    if (e.key == "Delete") {

        app.board.delete();
    }
}

class Base {
    items: BaseItem[];
    //wn: any;
    selection: BaseItem;
    selIndex: number;
    constructor(/*wn: HTMLElement*/) {
        this.items = [];
        //this.wn = wn;
        this.selection;
        this.selIndex;
    }

    add(name: string, group: Group) {
        var ni = new BaseItem;
        ni.name = name;
        ni.model = group.dublicate();
        this.items.push(ni);
    }
    select(index: number) {
        this.selIndex = index;
        this.selection = this.items[index];
    }
    /*render() {
        var ht = "";
        this.items.forEach((it, i) => {
            let st = "";
            if (i == this.selIndex) { st = ' style="background-color:rgb(80,80,80)" '; }

            ht += ('<p onclick="app.base.select(' + i + ')" ' + st + '>' + it.name + '</p>');
        });
        this.wn.innerHTML = ht;
    }*/
}

class BaseItem {
    name: any;
    model: any;
    constructor() {
        this.name;
        this.model;
    }
    pushBoard() {
        //app.board.entries.push(app.base.items[0].model.dublicate())
    }
}

export class AppLegacy {
    scale: number;
    canvasDOM: HTMLCanvasElement;
    scrollDOM: HTMLDivElement;
    tool: number;
    selection: Group;
    ghostSpline: Spline;
    board: Group;
    ctr: boolean;
    ctx: CanvasRenderingContext2D;
    base: Base;
    selPoints: Spline;
    selectionPoints: Vertex[];
    grid: Grid;
    state: number;
    cursor: Cursor;

    constructor(doc: Document, canvas: HTMLCanvasElement, scroll: HTMLDivElement) {
        this.canvasDOM = canvas;//<HTMLCanvasElement>doc.getElementById("wnd");
        this.scrollDOM = scroll;//doc.querySelector(".main");
        this.ctx = this.canvasDOM.getContext('2d');
        //let wn = doc.querySelector<HTMLDivElement>(".basebar");
        this.base = new Base();
        this.selection = new Group(this.ctx);
        this.selPoints = new Spline(this.ctx);
        this.selectionPoints = [];
        this.board = new Group(this.ctx);
        this.board.main = true;
        this.ghostSpline = new Spline(this.ctx);
        this.grid = new Grid(this.ctx, 8);
        this.cursor = new Cursor(this.ctx);
        this.scale = 2;
        this.tool = 0;
        this.state = 0;
        doc.addEventListener('mousemove', (e)=>onMove(this, e));
        doc.addEventListener('mousedown', (e)=>onDown(this, e));
        doc.addEventListener('mouseup', (e)=>onUp(this, e));
        doc.addEventListener('keydown', (e)=>onKeyDown(this, e));
        doc.addEventListener('keyup', (e)=>onKeyUp(this, e));
    }

    download() {
        downloadImage(this.ctx.canvas.toDataURL(), "filename.png");
    }

    setScale(scn: number) {
        scn = Math.trunc(scn);
        if (scn >= 1) {
            var k = scn / this.scale;
            this.scale = scn;
            this.canvasDOM.width = this.canvasDOM.width * k;
            this.canvasDOM.height = this.canvasDOM.height * k;
            this.render();
        }
    }

    setCursorPosition(x: number, y: number) {
        this.cursor.setPosition(x, y, this.grid.step, this.scale);
    }

    startCursorCloud(x: number, y: number) {
        this.cursor.startCloud(x, y, this.grid.step, this.scale);
    }

    endCursorCloud() {
        this.cursor.endCloud();
    }

    selTool(tool: number) {
        this.tool = tool;
    }

    getSvg(){
        let content = this.board.getSvg();
        return `<svg fill=none stroke="#000"> ${content}</svg>`;
    }

    private parseGroup(group: Group, node: SVGGElement | SVGSVGElement){
        node.childNodes.forEach(node=>{
            if (node instanceof SVGGElement){
                const childGroup = new Group(this.ctx);
                console.log('loaded group ', childGroup)
                this.parseGroup(childGroup, node);
                group.entries.push(childGroup);
            } else if (node instanceof SVGPathElement){
                this.parseSpline(group, node);
            }
        })
    }

    private parseSpline(group: Group, node: SVGPathElement){
        const spline = new Spline(this.ctx);
        const path = parsePath(node.getAttribute('d'));
        console.log(path)
        path.forEach(step=>{
            if (step.tag == 'M' || step.tag == 'L'){
                spline.points.push(new Vertex(step.args[0], step.args[1]));
            }
        })
        console.log('loaded spline ', spline);
        group.entries.push(spline);
    }

    setSvg(text: string){
        const el = document.createElement('div');
        el.innerHTML = text;
        const svg = el.querySelector('svg');
        console.log(svg);
        const root = new Group(this.ctx);
        this.parseGroup(root, svg);
        this.board.entries.push(root);
        /*svg.childNodes.forEach(node=>{
            if (node instanceof SVGGElement){
                
            } else if (node instanceof SVGPathElement){
                
            }
        })*/
    }

    render() {
        //this.base.render();
        //var curToolIco = document.getElementById("tool" + this.tool);
        /*var lineWidthOut = document.getElementById("wid");
        if (this.selection.entries[0]) {
            lineWidthOut.innerHTML = this.selection.getWidth().toString();
        }*/
        //
        //var toolIcons = document.querySelectorAll(".sidebar_item");
        //toolIcons.forEach((it) => it.style = "");
        //curToolIco.style.cssText = "background-color:rgb(80,80,80)";

        this.ctx.fillStyle = 'rgb(50, 50, 50)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.grid.render(this.scale);
        this.cursor.render(this.scale);
        this.ghostSpline.render(this.scale, true, false, false, false, this.cursor, this.grid.step);
        //this.board.entries.forEach((it)=>{it.hover=it.isHover(this.scale, this.cursor.realPosition.x,this.cursor.realPosition.y)});
        this.board.entries.forEach((it) => { if (it.type != "sple") { it.select(this.scale, this.cursor) } });
        this.board.entries.forEach((it) => { if ((it instanceof Spline) && it.type == "spline") { if (it.selected) { it.selectMarker(this.scale, this.cursor) } } });
        this.board.render(this.scale, this.cursor, this.grid.step);
    }
}

class Grid {
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

class Sprite {
    point: Vertex;
    type: string;
    constructor() {
        this.point = new Vertex(0, 0);
        this.type = "sprite";
    }
}

