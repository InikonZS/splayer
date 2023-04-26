import React, { useEffect, useState } from "react";
import {AppLegacy} from './lines';

export function App(){
    const [app, setApp] = useState<AppLegacy>(null);
    const [tool, setTool] = useState<number>(0);
    useEffect(()=>{
        const applegacy = new AppLegacy(document);
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
                <div className="sidebar_item" id="" onClick={()=>{"app.board.groupe()"}}>
                    group
                </div>
                <div className="sidebar_item" id="" onClick={()=>{"app.board.unGroupe()"}}>
                    ungroup
                </div>
                <div className="sidebar_item" id="" onClick={()=>{"app.base.add('model',app.selection.dublicate()); app.render();"}}>
                    to base
                </div>
                <div className="sidebar_item" id="" onClick={()=>{"if (app.base.selection){app.board.entries.push(app.base.items[app.base.selIndex].model.dublicate()); app.render();}"}}>
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
                <div className="sidebar_item" id="" onClick={()=>{"app.setScale(app.scale*2)"}}>
                    zoom+
                </div>
                <div className="sidebar_item" id="" onClick={()=>{"app.setScale(app.scale/2)"}}>
                    zoom-
                </div>
        </div>
        <div className="main">
            <canvas width="800px" height="700px" id="wnd" onContextMenu={(e)=>{e.preventDefault()}}></canvas> 
        </div>
        <div className="basebar">
                <p>sdfg</p>
                <p>gdfg</p>
                <p>Clicgf</p>
                <p>Presfg</p>
                <p>Use toog</p>
                <p>Use tode</p>
                <p>sdfg</p>
                <p>gdfg</p>
                <p>Clicgf</p>
                <p>Presfg</p>
                <p>Use toog</p>
                <p>Use tode</p>
                <p>sdfg</p>
                <p>gdfg</p>
                <p>Clicgf</p>
                <p>Presfg</p>
                <p>Use toog</p>
                <p>Use tode</p>
                
        </div>
        <div className="rightbar">
                <p>Click left mouse button to draw spline</p>
                <p>Click right button to finish spline</p>
                <p>Click right button to select spline and drag markers to edit it</p>
                <p>Press Delete button to delete selected spline</p>
                <p>Use tool Select to edit spline by left button</p>
                <p>Use tool Spline to draw new spline</p>
        </div>
    </div>
    )
}