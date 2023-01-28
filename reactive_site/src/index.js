import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { clickAndDrag } from './draggableDiv';

function Window(props){
    const ref = useRef(null)
    useEffect(() =>{
        clickAndDrag(ref.current);
    });
    return(
        <div className="window" id="testWin" ref={ref}>
            <div className="windowHead" id="testWinHead">
                Moving window test
            </div>
            <p>Try</p>
            <p>it</p>
        </div>
    );
}

function Folder(props){
    const ref = useRef(null)
    useEffect(() => {
        clickAndDrag(ref.current)
    });

    function renderWindow(){
        console.log("double click");
    }
    return(
        <div ref={ref.current} className="folder" onDoubleClick={renderWindow}>
            <img src={require('./resources/folder.png')}/>
            <h1>name</h1>
        </div> 
    );
}

function Icon_Window_pair(){
    return(
        <div>
            <Folder/>
            <Window/>
        </div>
    );
}

class Desktop extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <p>Is this thing on?</p>
                <Icon_Window_pair/>
            </div>
        );
    };
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Desktop/>);