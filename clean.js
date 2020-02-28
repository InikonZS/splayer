document.addEventListener('DOMContentLoaded', onReady);
document.addEventListener('mousemove', onMove);
document.addEventListener('mousedown', onDown);
document.addEventListener('mouseup', onUp);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

var app;

function onReady(){
    app=new App(document);
    app.render();
}

function onMove(e){
    var cx = (e.pageX - app.canvasDOM.offsetLeft)+app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop)+app.scrollDOM.scrollTop;
    app.setCursorPosition(cx, cy);

    if (app.tool==0){
        if (e.buttons==1){
           // let hov=false;
           // app.selectionPoints.forEach((it)=>{
           //     hov|=it.wasHover(app.scale,app.cursor);
           // });
           let hov=app.selection.selPoints.wasPointHover(app.scale,app.cursor);//app.selPoints.wasPointHover(app.scale,app.cursor);
            if (hov){
               // app.selectionPoints.forEach((it)=>{
                //    it.move(app.cursor);
                app.selection.selPoints.move(app.cursor);
                    app.cursor.cloud=false;
               // });
            }else{
                if (app.selection.wasHover(app.scale,app.cursor)){
                    app.selection.entries.forEach((it)=>{
                        it.move(app.cursor);
                        app.cursor.cloud=false;
                    });       
                } 
            }
        }  
    }
    if (app.tool==1){
        app.ghostSpline.ghostPoint.setPosition(app.cursor.gridPosition.x, app.cursor.gridPosition.y);
    } 

    app.render();
}

function onDown(e){
    var cx = (e.pageX - app.canvasDOM.offsetLeft)+app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop)+app.scrollDOM.scrollTop;
    if ((cx<0)||(cy<0)||(((e.pageX - app.canvasDOM.offsetLeft))>app.scrollDOM.clientWidth)||(((e.pageY - app.canvasDOM.offsetTop))>app.scrollDOM.clientHeight)) {return false;}

    if (app.tool==0){
        if (e.buttons==1){
            var sel=app.selection.isPointHover(app.scale,app.cursor);
            if (sel){
                //console.log("sdsdfddfd");
                if (!sel.selected){
                    app.selection.selectHoveredPoints();
                   // app.selectionPoints=app.selection.selectionPoints;
                   //app.selPoints.points=app.selection.selectionPoints;
                    //console.log("sdsd");
                    //app.selectionPoints.push(sel);
                    sel.selected=true; 
                }

            }else{
                var selc=app.board.isHover(app.scale,app.cursor)
                if (selc){
                    if (!selc.selected){
                        app.board.selectHovered();
                        app.selection.entries=app.board.selection;
                        //app.selection.push(selc);
                        selc.selected=true;   
                    }
                    
                } 
            }
            app.startCursorCloud(cx, cy);
        }  
    }

    if (app.tool==1){
        if (e.buttons==1){
            app.ghostSpline.add();
        }
        if (e.buttons==2){
            app.board.entries.push(app.ghostSpline);
            app.ghostSpline=new Spline(app.ctx);
            app.ghostSpline.ghostPoint.setPosition(app.cursor.gridPosition.x, app.cursor.gridPosition.y);
        }
    } 
    app.render();
}

function onUp(e){
    var cx = (e.pageX - app.canvasDOM.offsetLeft)+app.scrollDOM.scrollLeft;
    var cy = (e.pageY - app.canvasDOM.offsetTop)+app.scrollDOM.scrollTop;
    if ((cx<0)||(cy<0)||(((e.pageX - app.canvasDOM.offsetLeft))>app.scrollDOM.clientWidth)||(((e.pageY - app.canvasDOM.offsetTop))>app.scrollDOM.clientHeight)) {return false;}
    //if ((cx<0)||(cy<0)||((cx)>app.scrollDOM.clientWidth)||((cy)>app.scrollDOM.clientHeight)) {return false;}

    if (app.tool==0){
        
        if (!app.selection.wasHover(app.scale,app.cursor)){
        //app.selection=new Group();
        //app.board.entries.forEach((it)=>{it.selected=false; if (it.hover) {it.selected=true; app.selection.entries.push(it)}});
        app.board.selectHovered();
        app.selection.entries=app.board.selection;
        }
       // selectHovered(){
       //     this.selection=[]
       //     this.entries.forEach((it)=>{
        //        it.selected=it.hover;
        //        if (it.selected){this.selection.push(it)};   
       //     });
       // }
        //let hov=false;
        //    app.selectionPoints.forEach((it)=>{
        //        hov|=it.wasHover(app.scale,app.cursor);
        //    });
            let hov =app.selection.isPointHover(app.scale,app.cursor);
            if (!hov){
                app.selection.selectHoveredPoints();
                //app.selPoints.points=app.selection.selectionPoints;
               // app.selectionPoints=app.selection.selectionPoints;
            }
            app.selection.selPoints.applyMove();
        //app.selectionPoints.forEach((it)=>{
        //    it.applyMove();
        //});
       // app.selection.entries.forEach((it)=>{
       //     it.applyMove();
       // });
        app.selection.applyMove();
        //console.log(app.selection);
    
    }
    app.cursor.hidden=false;
    app.endCursorCloud();
    app.render();
}

function onKeyDown(e){
    if (e.key=="Control"){
        app.ctr=true;
    }       
}

function onKeyUp(e){
    console.log(e.key);
    if (e.key=="Control"){
        app.ctr=false;
    }
    if (e.key=="Delete"){
        
    }    
}

class App {
    constructor (doc){
        this.canvasDOM=doc.getElementById("wnd");
        this.scrollDOM=doc.querySelector(".main");
        this.ctx=this.canvasDOM.getContext('2d');
        
        this.selection = new Group();
        this.selPoints = new Spline();
        this.selectionPoints = [];
        this.board = new Group();
        this.ghostSpline = new Spline(this.ctx); 
        this.grid = new Grid(this.ctx, 8); 
        this.cursor = new Cursor(this.ctx); 
        this.scale=2;
        this.tool=0;
        this.state=0;  
    }
    setScale(scn){
        scn=Math.trunc(scn);
        if (scn>=1){
        var k=scn/this.scale;
        this.scale=scn;
        this.canvasDOM.width=this.canvasDOM.width*k;
        this.canvasDOM.height=this.canvasDOM.height*k;
        this.render();
        }
    }

    setCursorPosition(x, y){
        this.cursor.setPosition(x, y, this.grid.step, this.scale);    
    }

    startCursorCloud(x, y){
        this.cursor.startCloud(x, y, this.grid.step, this.scale);    
    }

    endCursorCloud(){
        this.cursor.endCloud();  
    }

    selTool(tool){
        this.tool=tool;
    }


    render(){
        var curToolIco=document.getElementById("tool"+this.tool);
        var toolIcons=document.querySelectorAll(".sidebar_item");
        toolIcons.forEach((it)=>it.style="");
        curToolIco.style="background-color:rgb(80,80,80)";

        this.ctx.fillStyle = 'rgb(50, 50, 50)';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.grid.render(this.scale);
        this.cursor.render(this.scale);
        this.ghostSpline.render(this.scale, true, false, false);
        //this.board.entries.forEach((it)=>{it.hover=it.isHover(this.scale, this.cursor.realPosition.x,this.cursor.realPosition.y)});
        this.board.entries.forEach((it)=>{it.select(this.scale, this.cursor)});
        this.board.entries.forEach((it)=>{if (it.selected){it.selectMarker(this.scale, this.cursor)}});
        this.board.render(this.scale);
    }
}

class Grid {
    constructor (ctx, step){
        this.step = step;
        this.ctx = ctx;
    }

    render(sc){
        this.ctx.beginPath();
        this.ctx.strokeStyle  ="rgb(90,90,90)";
        for (let i=0; i<this.ctx.canvas.width; i+=this.step*sc){
            this.ctx.moveTo(i,0);
            this.ctx.lineTo(i,this.ctx.canvas.height);
        }
        for (let i=0; i<this.ctx.canvas.height; i+=this.step*sc){
            this.ctx.moveTo(0,i);
            this.ctx.lineTo(this.ctx.canvas.width,i);
        }
        this.ctx.stroke();
    }

}

class Cursor {
    constructor (ctx){
        this.realPosition = new Vertex (0, 0);
        this.gridPosition = new Vertex (0, 0);
        this.startPos = new Vertex (0, 0);
        this.gridStartPos= new Vertex (0, 0);
        //this.endPos = new Vertex (0, 0);
        this.hidden=false;
        this.cloud=false;
        this.ctx=ctx;
    }

    setPosition (x, y, step, sc){
        this.realPosition.setPosition(x/sc, y/sc);
        this.gridPosition.setPosition(roundToStep(x/sc,step), roundToStep(y/sc,step));
    }

    startCloud (x, y, step, sc){
        this.cloud=true;
        this.startPos.setPosition(x/sc, y/sc);
        this.gridStartPos.setPosition(roundToStep(x/sc,step), roundToStep(y/sc,step));
    }

    endCloud (){
        this.cloud=false;
    }

    render (sc){
        //this.realPosition.render(this.ctx, sc);
        //this.gridPosition.render(this.ctx, sc);
        if (this.cloud&&(!this.hidden)){
            let xs=this.startPos.x*sc;
            let ys=this.startPos.y*sc;
            let xe=this.realPosition.x*sc;
            let ye=this.realPosition.y*sc;
            this.ctx.beginPath();
            this.ctx.strokeStyle="rgb(255,0,0)";
            this.ctx.moveTo(xs,ys);
            this.ctx.lineTo(xs,ye);
            this.ctx.lineTo(xe,ye);
            this.ctx.lineTo(xe,ys);
            this.ctx.lineTo(xs,ys);
            this.ctx.stroke(); 
        }
    }
}

class Group {
    constructor (ctx){
        this.entries=[];
        this.type = "group"; 
        this.ctx=ctx; 
        //this.selectionPoints;
        this.selPoints=new Spline (this.ctx);
        this.selection = []; 
    }

    applyMove(){
        this.entries.forEach((it)=>{
            it.applyMove();
        });
    }

    selectHovered(){
        this.selection=[]
        this.entries.forEach((it)=>{
            it.selected=it.hover;
            if (it.selected){this.selection.push(it)};   
        });
    }

    selectHoveredPoints(){
        //this.selectionPoints=[];
        this.selPoints=new Spline(this.ctx);
        this.entries.forEach((it)=>{
            it.points.forEach((jt)=>{
                jt.selected=jt.hover;
                if (jt.selected){
                    //this.selectionPoints.push(jt); 
                    this.selPoints.points.push(jt)};   
            }) 
        });
    }

    isPointHover(sc,cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        for (let i=0;i<this.entries.length;i++){
            var point=this.entries[i].isPointHover(sc,cursor);
            if (point) {return point;}
        }
        return false;
    }

    isHover(sc,cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        for (let i=0;i<this.entries.length;i++){
            if (this.entries[i].isHover(sc,cursor)) {return this.entries[i];}
        }
        return false;
    }

    wasHover(sc,cursor){
        let x=cursor.startPos.x;
        let y=cursor.startPos.y;
        for (let i=0;i<this.entries.length;i++){
            if (this.entries[i].wasHover(sc,cursor)) {return true;}
        }
        return false;
    }

    render(sc){
        this.entries.forEach((it)=>it.render(sc, false, it.hover,false));
    }
}

class Spline {
    constructor (ctx){
        this.ctx=ctx;
        this.hovered=[];
        this.points=[];
        this.ghostPoint=new Vertex(0, 0); 
        this.hover=false;
        this.selected=false;
        this.type = "spline";
        
    }

    move (cursor){
        this.points.forEach((it)=>{
            it.move(cursor)
        });
    }

    applyMove(){
        this.points.forEach((it)=>{
            it.applyMove()
        }); 
    }

    add(){
        let lx=this.ghostPoint.x;
        let ly=this.ghostPoint.y;
        this.points.push(this.ghostPoint);
        this.ghostPoint=new Vertex(lx, ly); 
    }

    isPointHover(sc, cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        for (let i=0; i<this.points.length; i++){
            let px=this.points[i].x;
            let py=this.points[i].y;
            if (getSelMark(px,py,x,y,sc)) {return this.points[i]};
        }
        return false;
    }

    wasPointHover(sc, cursor){
        let x=cursor.startPos.x;
        let y=cursor.startPos.y;
        for (let i=0; i<this.points.length; i++){
            let px=this.points[i].x;
            let py=this.points[i].y;
            if (getSelMark(px,py,x,y,sc)) {return this.points[i]};
        }
        return false;
    }

    isHover(sc, cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        for (let i=1; i<this.points.length; i++){
            let px=this.points[i].x;
            let py=this.points[i].y;
            let ex=this.points[i-1].x;
            let ey=this.points[i-1].y;
            if (getSel(px,py,ex,ey,x,y,sc)) {return true};
        }
        return false;
    }

    wasHover(sc, cursor){
        let x=cursor.startPos.x;
        let y=cursor.startPos.y;
        for (let i=1; i<this.points.length; i++){
            let px=this.points[i].x;
            let py=this.points[i].y;
            let ex=this.points[i-1].x;
            let ey=this.points[i-1].y;
            if (getSel(px,py,ex,ey,x,y,sc)) {return true};
        }
        return false;
    }

    select(sc, cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        let xx=cursor.startPos.x;
        let yy=cursor.startPos.y;
        let cs=false;
        let bx=false;
        for (let i=0; i<this.points.length; i++){
            
            let px=this.points[i].x;
            let py=this.points[i].y;
            if (i>0){
                let ex=this.points[i-1].x;
                let ey=this.points[i-1].y;
                cs|=getSel(px,py,ex,ey,x,y,sc);
            }
            
            if (cursor.cloud){
                bx|=inBox(x,y,xx,yy,px,py,sc);
            }
            this.hover=cs||bx;
        }

    }

    selectMarker(sc, cursor){
        this.hovered=[];
        for (let i=0; i<this.points.length; i++){
            let px=this.points[i].x;
            let py=this.points[i].y;
            let x=cursor.realPosition.x;
            let y=cursor.realPosition.y;
            let xx=cursor.startPos.x;
            let yy=cursor.startPos.y;
            let hov=getSelMark(px,py,x,y,sc)||(inBox(x,y,xx,yy,px,py,sc)&&cursor.cloud); 
            this.points[i].hover=hov;
            if (hov){this.hovered.push(this.points[i]);}  
        }    
    }

    render(sc, gh, hover, selected){
        this.ctx.beginPath();
        this.ctx.strokeStyle="rgb(0,0,0)";
        if (hover){
            this.ctx.strokeStyle="rgb(80,0,0)";
        }
        if (this.selected){
            this.ctx.strokeStyle="rgb(255,0,0)";
        }

        for (let i=0; i<this.points.length; i++){
            let px=(this.points[i].x+this.points[i].mx)*sc;
            let py=(this.points[i].y+this.points[i].my)*sc;
            //let px=(this.points[i].x)*sc;
            //let py=(this.points[i].y)*sc;
            i==0 ? this.ctx.moveTo(px,py) : this.ctx.lineTo(px,py); 
            if (this.selected){
                this.points[i].render(this.ctx, sc);
            }
        }
        if (gh){
            let px=this.ghostPoint.x*sc;
            let py=this.ghostPoint.y*sc;
            this.ctx.lineTo(px,py);    
            
        }
        this.ctx.stroke(); 
    }
}

class Sprite {
    constructor (){
        this.point = new Vertex();
        this.type = "sprite";
    }
}

class Vertex {
    constructor (x, y){
        this.x=x;
        this.y=y;
        this.hover=false;
        this.selected=false;
    }

    setPosition (x, y){
        this.x=x;
        this.y=y;
        this.mx=0;
        this.my=0;
    }
    
    move (cursor){
        this.mx=cursor.gridPosition.x-cursor.gridStartPos.x;
        this.my=cursor.gridPosition.y-cursor.gridStartPos.y;
    }

    applyMove(){
        this.x+=this.mx;
        this.y+=this.my;
        this.my=0;
        this.mx=0;
    }

    isHover(sc, cursor){
        let x=cursor.realPosition.x;
        let y=cursor.realPosition.y;
        return getSelMark(this.x,this.y,x,y,sc);
    }

    wasHover(sc, cursor){
        let x=cursor.startPos.x;
        let y=cursor.startPos.y;
        return getSelMark(this.x,this.y,x,y,sc);
    }

    render (ctx, sc){
        ctx.fillStyle="rgb(0,0,0)";
        if (this.hover){
            ctx.fillStyle="rgb(200,150,0)";    
        }
        if (this.selected){
            ctx.fillStyle="rgb(0,255,0)";    
        }
        //ctx.fillRect(this.x*sc-5,this.y*sc-5,5,5);
        ctx.fillRect((this.mx+this.x)*sc-5,(this.my+this.y)*sc-5,5,5);
    }

}

////////////UTILS//////////////
function roundToStep(x, step){
    return ((x%step)<step/2) ? x-x%step : (x+step)-(x+step)%step;
}

function getDist(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function getEq(x1,y1,x2,y2){
    res=[0,0];
    res[0]=(y1-y2)/(x1-x2);
    res[1]=y1-res[0]*x1;
    return res;
}

function getSel(x1,y1,x2,y2,x3,y3,sc){
    var kx=getEq(x1,y1,x2,y2);
    var a=kx[0];
    var b=-1;
    var c=kx[1];
    var dist=Math.abs(a*x3+b*y3+c)/(Math.sqrt(a*a+b*b));
    if (Math.abs(a)>100000){dist=0;}
    let n=5/sc;
    var bou=((x3<=x1+n)&&(x3>x2-n)&&(y3<=y1+n)&&(y3>y2-n)||
            (x3>x1-n)&&(x3<=x2+n)&&(y3<=y1+n)&&(y3>y2-n)||
            (x3<=x1+n)&&(x3>x2-n)&&(y3>y1-n)&&(y3<=y2+n)||
            (x3>x1-n)&&(x3<=x2+n)&&(y3>y1-n)&&(y3<=y2+n));
    return (((dist<(10/sc))&&bou)|| getSelMark(x1,y1,x3,y3, sc)|| getSelMark(x2,y2,x3,y3, sc));
}

function inBox(x1,y1,x2,y2,x3,y3){
    let n=0;
    var bou=((x3<=x1+n)&&(x3>x2-n)&&(y3<=y1+n)&&(y3>y2-n)||
            (x3>x1-n)&&(x3<=x2+n)&&(y3<=y1+n)&&(y3>y2-n)||
            (x3<=x1+n)&&(x3>x2-n)&&(y3>y1-n)&&(y3<=y2+n)||
            (x3>x1-n)&&(x3<=x2+n)&&(y3>y1-n)&&(y3<=y2+n));
    return bou;    
}

function getSelMark(x1,y1,x3,y3, sc){
    return (getDist(x1,y1,x3,y3)<(10/sc)); 
}