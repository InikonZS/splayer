import React, { useEffect, useRef, useState } from "react";
import {AppLegacy} from './lines';

export function App(){
    const [app, setApp] = useState<AppLegacy>(null);
    const [base, setBase] = useState<Array<string>>([]);
    const [baseSelected, setBaseSelected] = useState(-1);
    const [tool, setTool] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>();
    const scrollRef = useRef<HTMLDivElement>();
    const [svg, setSvg] = useState('');
 
    useEffect(()=>{
        const applegacy = new AppLegacy(document, canvasRef.current, scrollRef.current);
        applegacy.render();
        setApp(applegacy);
    },[])
    useEffect(()=>{
        if (app){
            app.selTool(tool); 
            app.render();
        }
    }, [app, tool]);
    return (
        <div className="wrapper clearfix">
        <div className="toolbar">
        </div>
        <div className="sidebar">
                <div className={"sidebar_item" + (tool==0 ? " selected": "")} id="tool0" onClick={()=>{setTool(0);}}>
                    select
                </div>
                <div className={"sidebar_item" + (tool==1 ? " selected": "")} id="tool1" onClick={()=>{setTool(1)}}>
                    spline
                </div>
                <div className="sidebar_item" id="" onClick={()=>{app.board.groupe()}}>
                    group
                </div>
                <div className="sidebar_item" id="" onClick={()=>{app.board.unGroupe()}}>
                    ungroup
                </div>
                <div className="sidebar_item" id="" onClick={()=>{setBase(last=>[...last, last.length.toString()]); app.base.add('model',app.selection.dublicate()); app.render();}}>
                    to base
                </div>
                <div className="sidebar_item" id="" onClick={()=>{
                    //app.base.select(' + i + ')
                    if (baseSelected!=-1){app.board.entries.push(app.base.items[baseSelected].model.dublicate()); app.render();}
                    }}>
                    from base
                </div>
                <div className="sidebar_item clearfix" id="" >
                    <div className="sidebar_item_s" onMouseDown={()=>{"md()"}} onMouseMove={()=>{"mv()"}} id="" >
                    -    
                    </div> 
                    <div className="sidebar_item_s"  id="wid" >
                            w    
                    </div>    
                    <div className="sidebar_item_s"  id="" >
                    +    
                    </div>       
                </div>
                <div className="sidebar_item" id="" onClick={()=>{app.setScale(app.scale*2)}}>
                    zoom+
                </div>
                <div className="sidebar_item" id="" onClick={()=>{app.setScale(app.scale/2)}}>
                    zoom-
                </div>
                <div onClick={()=>{
                    const res = app.getSvg();
                    console.log(res);
                    setSvg(res);
                }}>
                    svg
                </div>
        </div>
        <div ref={scrollRef} className="main">
            <canvas ref={canvasRef} width="800px" height="700px" id="wnd" onContextMenu={(e)=>{e.preventDefault()}}></canvas> 
        </div>
        <div className="basebar">
            {base.map((item, index)=>{
                return (
                    <div className={index == baseSelected ? "selected" : ""} onClick={()=>setBaseSelected(index)}>
                        {item}
                    </div>
                )
            })}
        </div>
        <div className="rightbar">
                <p>Click left mouse button to draw spline</p>
                <p>Click right button to finish spline</p>
                <p>Click right button to select spline and drag markers to edit it</p>
                <p>Press Delete button to delete selected spline</p>
                <p>Use tool Select to edit spline by left button</p>
                <p>Use tool Spline to draw new spline</p>
                <div dangerouslySetInnerHTML={{__html: svg}}></div>
        </div>
    </div>
    )
}