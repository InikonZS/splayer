document.addEventListener('DOMContentLoaded', onReady);
document.addEventListener('mousemove', move);
document.addEventListener('mousedown', down);
document.addEventListener('mouseup', up);
var gWd;
var gWindow;
function getDist(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function getEq(x1,y1,x2,y2){
    res=[0,0];
    res[0]=(y1-y2)/(x1-x2);
    res[1]=y1-res[0]*x1;
    return res;
}
function getSel(x1,y1,x2,y2,x3,y3){
    var kx=getEq(x1,y1,x2,y2);
    var a=kx[0];
    var b=-1;
    var c=kx[1];
    var dist=Math.abs(a*x3+b*y3+c)/(Math.sqrt(a*a+b*b));
    var bou=((x3<=x1)&&(x3>x2)&&(y3<=y1)&&(y3>y2)||
            (x3>x1)&&(x3<=x2)&&(y3<=y1)&&(y3>y2)||
            (x3<=x1)&&(x3>x2)&&(y3>y1)&&(y3<=y2)||
            (x3>x1)&&(x3<=x2)&&(y3>y1)&&(y3<=y2))
    return (((dist<10)&&bou)|| getSelMark(x1,y1,x3,y3)|| getSelMark(x2,y2,x3,y3));
   // return (getDist(x1,y1,x3,y3)<10||getDist(x2,y2,x3,y3)<10)
}
function getSelMark(x1,y1,x3,y3){
    return (getDist(x1,y1,x3,y3)<10); 
}
function clear(ctx){
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);
}
class board{
    constructor (){
        this.entries=[];
        this.mdp=false;
        this.entr=false;
        this.ofs=false;
        this.ldx=0;
        this.ldy=0;
    }
    resetSlc(){
        for(let i=0;i<this.entries.length;i++){
            this.entries[i].slc=false;
            this.entries[i].markd=-1;
            this.mdp=false;
            this.entr=false;
        }    
    }
    setSlc(){
        for(let i=0;i<this.entries.length;i++){
            this.entries[i].slc=this.entries[i].sel;
            if (this.entries[i].sel==true){
                this.entries[i].markd=this.entries[i].mark;
                this.mdp=this.entries[i].points[this.entries[i].markd];
                this.entr=this.entries[i];
                return this.entries[i];
            }
        }    
    }
    render (ctx,cup){
        for(let i=0;i<this.entries.length;i++){
            this.entries[i].render(ctx,false,cup);
        }
        if (this.entr){this.entr.render(ctx,false,cup,this.ofs);}
    }
}

class spline{
    constructor (){
        this.points=[];
        this.slc=false;
        this.sel=false;
        this.mark=-1;
        this.markd=-1;
    }
    fin () {
        var a=new spline();
        a.points=this.points.concat([]);
        return a;
    }
    check (cup){
        for(let i=1;i<this.points.length;i++){
            if (getSel(this.points[i][0],this.points[i][1],this.points[i-1][0],this.points[i-1][1],cup[0],cup[1])){
            this.sel=true;
            break;}
            
            else{
            this.sel=false;}
        }
    }
    checkMark(cup){
        this.mark=-1;
        for(let i=0;i<this.points.length;i++){
            if (getSelMark(this.points[i][0],this.points[i][1],cup[0],cup[1])){
                this.mark=i;
                break;
            }   
        }
        
    }
    render (ctx,cp,cup,ofs){
        //ctx.fillStyle = 'rgb(50, 50, 50)';
        //ctx.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);
        if (!ofs){ofs=[0,0];}
        this.check(cup);
        this.checkMark(cup);
        if (this.points.length>0){
            
            ctx.beginPath();       // Начинает новый путь
            ctx.moveTo(this.points[0][0]+ofs[0], this.points[0][1]+ofs[1]);    // Рередвигает перо в точку (30, 50)
            if (this.slc==true) {
                ctx.strokeStyle="rgb(255,0,0)";
                for(let i=0;i<this.points.length;i++){
                    if (i==this.mark){ctx.fillStyle="rgb(0,255,0)";}else{
                    ctx.fillStyle="rgb(0,0,0)";}
                    ctx.fillRect(this.points[i][0]-5+ofs[0],this.points[i][1]+ofs[1]-5,5,5);    
                }
            } else 
            {
                if (this.sel==true){
                ctx.strokeStyle="rgb(100,0,0)";    
                }
                else{
                ctx.strokeStyle="rgb(0,0,0)";
                }
            }
            
            for(let i=1;i<this.points.length;i++){
                
                ctx.lineTo(this.points[i][0]+ofs[0], this.points[i][1]+ofs[1]);  // Рисует линию до точки (150, 100)
                var eq=getEq(this.points[i][0],this.points[i][1],this.points[i-1][0],this.points[i-1][1])
                ctx.fillStyle="rgb(0,0,0)";
                //if (getSelMark(this.points[i][0],this.points[i][1],cup[0],cup[1])){
                    //ctx.fillRect(this.points[i][0]-5,this.points[i][1]-5,5,5);
                //}
              /*  for (let j=this.points[i-1][0];j<this.points[i][0];j++){
                ctx.fillRect(j,eq[0]*j+eq[1],3,3);
                }*/
            }
            if (cp!=false){
            ctx.lineTo(cp[0], cp[1]);
            }
            ctx.stroke(); 
        }
    }
}
var brd=new board();
var spl=new spline();

function onReady(){
    gWd=document.getElementById("wnd");
    //gWd.onclick=onClick;
	gWindow=gWd.getContext('2d');
	gWindow.fillStyle = 'rgb(50, 50, 50)';
    gWindow.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);
}    
function move(e){
    var cx = e.pageX - gWd.offsetLeft;
    var cy = e.pageY - gWd.offsetTop;
    if (brd.mdp){
        brd.mdp[0]=cx;
        brd.mdp[1]=cy;
    } else{
        if (brd.entr){
            brd.ofs=[cx-brd.ldx,cy-brd.ldy];    
        }
    }
    clear(gWindow);

    brd.render(gWindow,[cx,cy]);
    spl.render(gWindow,[cx,cy],[cx,cy]);
    
    //if (e.buttons==1){
    //    gWindow.fillStyle="rgb(0,0,0)";
    //    gWindow.fillRect(cx,cy,10,10);
    //}    
}
function down(e){
    brd.resetSlc();
    var cx = e.pageX - gWd.offsetLeft;
    var cy = e.pageY - gWd.offsetTop;
    if (e.buttons==1){
        
        //if (e.buttons==1){
        spl.points.push([cx,cy]);
    }
    if (e.buttons==2){
        //brd.entries.push(spl);
        brd.ldx=cx;
        brd.ldy=cy;
        brd.ofs=[0,0];
        brd.entries.push(spl.fin());
        
        spl=new spline();
        brd.setSlc();
    }
    clear(gWindow);
    brd.render(gWindow,[cx,cy]);
    spl.render(gWindow,[cx,cy],[cx,cy]);
    //}    
}

function up(e){
    var cx = e.pageX - gWd.offsetLeft;
    var cy = e.pageY - gWd.offsetTop;
    brd.mdp=false;
    if (brd.entr){
    for (let i=0;i<brd.entr.points.length;i++){
        brd.entr.points[i][0]=brd.entr.points[i][0]+brd.ofs[0];
        brd.entr.points[i][1]=brd.entr.points[i][1]+brd.ofs[1];
    }
    }
    brd.entr=false;
    clear(gWindow);
    brd.render(gWindow,[cx,cy]);
    spl.render(gWindow,[cx,cy],[cx,cy]);
}
