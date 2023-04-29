import React from "react";
import { useEffect, useState } from "react"

interface IIncdecProps{
    value: number;
    onInc: (last: number)=>void;
    onDec: (last: number)=>void;
    caption: string;
}

export function Incdec({value, caption, onInc, onDec}: IIncdecProps) {
    return (
        <div className="sidebar_item clearfix" id="" >
            <div className="sidebar_item_name">{caption}</div>
            <div className="sidebar_item_controls">
                <button className="sidebar_item_button" onClick={() => {
                        onDec(value); 
                    }} >
                    -
                </button>
                <div className="sidebar_item_value" >
                    {value}
                </div>
                <button className="sidebar_item_button" onClick={() => { 
                        onInc(value); 
                    }} >
                    +
                </button>
            </div>

        </div>
    )
}