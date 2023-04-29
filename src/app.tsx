import React, { useEffect, useRef, useState } from "react";
import {AppLegacy} from './lines';
import {Incdec} from './components/incdec';

export function App(){
    const [app, setApp] = useState<AppLegacy>(null);
    const [base, setBase] = useState<Array<string>>([]);
    const [baseSelected, setBaseSelected] = useState(-1);
    const [tool, setTool] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>();
    const scrollRef = useRef<HTMLDivElement>();
    const [svg, setSvg] = useState('');
    const [gridStep, setGridStep] = useState(8);
    const [scale, setScale] = useState(2);
 
    useEffect(()=>{
        const applegacy = new AppLegacy(document, canvasRef.current, scrollRef.current);
        applegacy.render();
        setApp(applegacy);
    },[])
    useEffect(()=>{
        if (app){
            app.selTool(tool); 
            app.setGridStep(gridStep);
            app.setScale(scale);
            app.render();
        }
    }, [app, tool, gridStep, scale]);
    return (
        <div className="wrapper clearfix">
        <div className="toolbar">
        </div>
        <div className="sidebar">
                <button className={"sidebar_item" + (tool==0 ? " selected": "")} id="tool0" onClick={()=>{setTool(0);}}>
                    select
                </button>
                <button className={"sidebar_item" + (tool==1 ? " selected": "")} id="tool1" onClick={()=>{setTool(1)}}>
                    spline
                </button>
                <button className="sidebar_item" id="" onClick={()=>{app.board.groupe()}}>
                    group
                </button>
                <button className="sidebar_item" id="" onClick={()=>{app.board.unGroupe()}}>
                    ungroup
                </button>
                <button className="sidebar_item" id="" onClick={()=>{setBase(last=>[...last, last.length.toString()]); app.base.add('model',app.selection.dublicate()); app.render();}}>
                    to base
                </button>
                <div className="sidebar_item" id="" onClick={()=>{
                    //app.base.select(' + i + ')
                    if (baseSelected!=-1){app.board.entries.push(app.base.items[baseSelected].model.dublicate()); app.render();}
                    }}>
                    from base
                </div>

                <Incdec 
                    caption="grid"
                    value={gridStep} 
                    onInc={last => {
                        const val = Math.min(last * 2, 64);
                        setGridStep(val); 
                    }} 
                    onDec={last => {
                        const val = Math.max(last / 2, 1);
                        setGridStep(val); 
                    }}
                />
                <Incdec 
                    caption="zoom"
                    value={scale} 
                    onInc={last => {
                        const val = Math.min(last * 2, 4);
                        setScale(val);
                    }} 
                    onDec={last => {
                        const val = Math.max(last / 2, 1);
                        setScale(val);
                    }}
                />

                <button className="sidebar_item" onClick={()=>{
                    const res = app.getSvg();
                    console.log(res);
                    setSvg(res);
                }}>
                    save svg
                </button>

                <button className="sidebar_item" onClick={()=>{
                    const res = app.setSvg(svg);
                }}>
                    load svg
                </button>
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
            <div>
                <p>Click left mouse button to draw spline</p>
                <p>Click right button to finish spline</p>
                <p>Click right button to select spline and drag markers to edit it</p>
                <p>Press Delete button to delete selected spline</p>
                <p>Use tool Select to edit spline by left button</p>
                <p>Use tool Spline to draw new spline</p>
            </div>
            <div>
                <div>Preview:</div>
                <div className="preview_block" dangerouslySetInnerHTML={{__html: svg}}></div> 
                <div>
                    <a className="download" download="image.svg" href={'data:image/svg+xml;base64,'+btoa(svg)}>download (base)</a> 
                </div>
                <div>
                    <a className="download" download="image.svg" href={URL.createObjectURL(new Blob([svg], {type:'image/svg+xml'}))}>download (blob)</a>  
                </div>
                
            </div> 
        </div>
    </div>
    )
}