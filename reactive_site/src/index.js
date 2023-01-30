import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { clickAndDrag } from './draggableDiv';

 function Window(props){
    const windowRef = React.createRef(null);
    const windowShown = props.hideWindow;
    const closeFunc = (() =>{
        props.closeWindow();
    });
    useEffect(() =>{
        console.log(`window ref is null: ${windowRef.current == null}`);
        if(windowRef.current != null){
            console.log("click+drag enabled for window");
            clickAndDrag(windowRef.current);
        };
    });
    if(windowShown){
        return(
            <div className="window" id="testWin" ref={windowRef}>
                <div className="windowHead" id="testWinHead">
                    <button className='closeButton' type='button' onClick={closeFunc}>x</button>
                    Moving window test
                </div>
                <p>Try</p>
                <p>it</p>
            </div>
        );
    }
    return null
}

function Folder(props){
    const folderRef = React.createRef(null);
    useEffect(() => {
        clickAndDrag(folderRef.current)
    });

    return(
        <div ref={folderRef} className="folder" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/folder.png')}/>
            <h1>name</h1>
        </div> 
    );
}

class Icon_Window_pair extends React.Component{
    constructor(props){
        super(props);
        this.state = {windowToggle: false, pairId: props.id, windowsOpen: 0};
    }

    toggleWindowOn = (() => {
        this.setState((state) => {
            return{windowToggle: true, pairId: state.pairId, windowsOpen: this.state.windowsOpen + 1};
        })
    });

    toggleWindowOff =(() => {
        console.log("attempt to close window");
        this.setState((state) => {
            return{windowToggle: false, pairId: state.pairId, windowsOpen: this.state.windowsOpen - 1};
        })
    });

    render(){
        return(
            <div id={this.state.id}>
                <Folder onDoubleClick={this.toggleWindowOn}/>
                <Window hideWindow={this.state.windowToggle} closeWindow={this.toggleWindowOff}/>
            </div>
        )
    };
}

class Desktop extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div>
                <Icon_Window_pair id="folderTest"/>
            </div>
        )
    };
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Desktop/>);