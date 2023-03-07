import React, { useState, useEffect, useRef, forwardRef, createRef } from 'react';
import ReactCliDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './style.css';
import { clickAndDrag, suspendDrag } from './draggableDiv';
import { getNumFromPx } from './helpers';
import { landingWindow } from './landingPage';

const findKeyOfmax = (dict) => {
    let maxKey, maxValue = 0;
    for(const [key, value] of Object.entries(dict)) {
      if(value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }

    return maxKey;
}

function Window(props){
    const moverRef = React.createRef(null)
    const windowRef = React.createRef(null);
    const resizeRefT = React.createRef(null);
    const resizeRefL = React.createRef(null);
    const resizeRefR = React.createRef(null);
    const resizeRefB = React.createRef(null);

    const pairName = props.name;
    const guts=props.guts;

    const zIndexes=props.zIndexes;

    const minWidth = 280;
    const minHeight = 280;
    let resizeOutOfBoundsOffset = 0;

    let windowShown = props.windowShown;

    const closeFunc = (() => {
        props.closeWindow();
    });

    const updateZIndexes = () =>{
        const highestZ=findKeyOfmax(zIndexes);
        if(highestZ == pairName){
            return;
        }else{
            console.log(zIndexes);
            let sortedKeys = sortedKeysByVal(zIndexes);
            let currIndex = sortedKeys.indexOf(pairName);
            sortedKeys.unshift(sortedKeys.splice(currIndex, 1)[0]);
            let updatedZs = {};
            for(let i=0; i<sortedKeys.length; i++){
                updatedZs[sortedKeys[i]] = sortedKeys.length - i + 1;
            }
            props.updateZ(updatedZs);
        }
    }
    
    const sortedKeysByVal = (dict) =>{
        let items =Object.keys(dict).map(
            (key) => {return [key, dict[key]] });
        items.sort(
            (first, second) => { return first[1] = second[1]}
        );
        let keys = items.map(
            (e) => { return e[0]}
        );

        return keys
    }

    useEffect(() => {
        if (windowRef.current != null) {
            //make moveable
            clickAndDrag(moverRef.current, windowRef.current);

            //update z indexes
            moverRef.current.style["z-index"] = zIndexes[pairName];

            //make resize handles
            const resizableEle = windowRef.current;
            const moveableContainer = moverRef.current;

            const styles = window.getComputedStyle(resizableEle);

            let width = parseInt(styles.width, 10);
            let height = parseInt(styles.height, 10);

            let x = 0;
            let y = 0;

            //right
            const onMouseMoveRightResize = (event) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width + dx;
                resizeOutOfBoundsOffset = minWidth - width;
                if(resizeOutOfBoundsOffset <= 0){
                    resizableEle.style.width = `${width}px`;
                }
            };

            const onMouseUpRightResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveRightResize);
                resizeOutOfBoundsOffset = 0;
            }

            const onMouseDownRightResize = (event) => {
                x = event.clientX;
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.left = styles.left;
                resizableEle.style.right = null;
                document.addEventListener("mousemove", onMouseMoveRightResize);
                document.addEventListener("mouseup", onMouseUpRightResize);
            }

            //left
            const onMouseMoveLeftResize = (event) => {
                const dx = event.clientX - x;
                x = event.clientX;
                width = width - dx;
                resizeOutOfBoundsOffset = minWidth - width;
                if(resizeOutOfBoundsOffset <= 0){
                    resizableEle.style.width = `${width}px`;
                }
            };

            const onMouseUpLeftResize = (event) => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);
                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = 0;
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`
                document.removeEventListener("mousemove", onMouseMoveLeftResize);
                resizeOutOfBoundsOffset = 0;
            }

            const onMouseDownLeftResize = (event) => {
                x = event.clientX;
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.right = styles.right;
                resizableEle.style.left = null;
                document.addEventListener("mousemove", onMouseMoveLeftResize);
                document.addEventListener("mouseup", onMouseUpLeftResize);
            }
            //top
            const onMouseMoveTopResize = (event) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height - dy;
                resizeOutOfBoundsOffset = minHeight - height;
                if(resizeOutOfBoundsOffset <= 0){
                    resizableEle.style.height = `${height}px`;
                }
            };

            const onMouseUpTopResize = (event) => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);
                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = 0;
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`
                document.removeEventListener("mousemove", onMouseMoveTopResize);
                resizeOutOfBoundsOffset = 0;
            }

            const onMouseDownTopResize = (event) => {
                const styles = window.getComputedStyle(resizableEle);
                y = event.clientY;
                resizableEle.style.bottom = styles.bottom;
                resizableEle.style.top = null;
                document.addEventListener("mousemove", onMouseMoveTopResize);
                document.addEventListener("mouseup", onMouseUpTopResize);
                windowRef.current.classList.add("resizingTop");
            }
            //Bottom
            const onMouseMoveBottomResize = (event) => {
                const dy = event.clientY - y;
                y = event.clientY;
                height = height + dy;
                resizeOutOfBoundsOffset = minHeight - height;
                if(resizeOutOfBoundsOffset <= 0){
                    resizableEle.style.height = `${height}px`;
                }
            };

            const onMouseUpBottomResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveBottomResize);
                resizeOutOfBoundsOffset = 0;
            }

            const onMouseDownBottomResize = (event) => {
                y = event.clientY
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = null;
                document.addEventListener("mousemove", onMouseMoveBottomResize);
                document.addEventListener("mouseup", onMouseUpBottomResize);
            }

            //add event listeners

            const resizerRight = resizeRefR.current;
            resizerRight.addEventListener("mousedown", onMouseDownRightResize);

            const resizerLeft = resizeRefL.current;
            resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

            const resizerTop = resizeRefT.current;
            resizerTop.addEventListener("mousedown", onMouseDownTopResize);

            const resizerBottom = resizeRefB.current;
            resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);

            //cleanup event listeners
            return () => {
                resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
                resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
                resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
                resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
            }
        };
    });
    if (windowShown) {
        return (
            <div ref={moverRef} className="mover" id={pairName}>
                <div className="window" ref={windowRef} onMouseDown={() => updateZIndexes()}>
                    <div ref={resizeRefT} className="resizer resizer-t"></div>
                    <div ref={resizeRefL} className="resizer resizer-l"></div>
                    <div ref={resizeRefR} className="resizer resizer-r"></div>
                    <div ref={resizeRefB} className="resizer resizer-b"></div>

                    <div className="windowHead" id={`${pairName}Head`}>
                        <img src={require('./resources/window-head-left.png')} className="windowHeadBorder windowHeadBorderLeft"></img>
                        <button className='closeButton' type='button' onClick={closeFunc}></button>
                        <img src={require('./resources/window-head-middle.png')} className="windowHeadBorder windowHeadBorderMid"></img>
                        <h1>{pairName}</h1>
                        <img src={require('./resources/window-head-right.png')} className="windowHeadBorder windowHeadBorderRight"></img>
                    </div>
                    
                    <img src={require('./resources/window-border.png')} className="windowBorderLeft"></img>
                    <img src={require('./resources/window-border.png')} className="windowBorderRight"></img>

                    <div className='windowContents'>
                        {guts()}
                    </div>

                    <div className='windowBorderBottomContainer'>
                        <img src={require('./resources/window-border-bottom-left.png')} className='windowBorderBottomLeft'></img>
                        <img src={require('./resources/window-border.png')} className='windowBorderBottom'></img>
                        <img src={require('./resources/window-border-bottom-right.png')} className='windowBorderBottomRight'></img>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export const Folder = (props) => {
    return ( 
        <div className="folder" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/folder.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

const Pdf  = (props) => {
    return(
        <div className="pdf" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/txt-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

const Html = (props) => {
    return(
        <div className="html" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/html-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

class Desktop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            testFolderRef:React.createRef(null), 
            testFolderWindow:React.createRef(null),
            testFolderWindowShown:false,
            testPDFWindowShown:false,
            welcomePage:true,
            zIndexes:{testFolder:1, testPDF:2, welcomePage:3}
        };
    }
    render() {
        const setNewZIndex = (updatedIndexes) => {
            this.setState({zIndexes:updatedIndexes});
        }
        const GithubLink = () => {
            const img1 = require('./resources/gh-icon.png');
            const img2 = require('./resources/gh-icon-invert.png');
            return <a href='https://github.com/scaboodles' target="_blank"><img id='githubIcon' src={img1} onMouseOver={e => (e.currentTarget.src = img2)} onMouseOut={e => (e.currentTarget.src = img1)} alt="github link"></img></a>;
        }
        const testPDF = () => {
            return <Pdf name='testPDF' onDoubleClick={() => this.setState({testPDFWindowShown:true})}/>
        }
        const testPDFWindow = () =>{
            let str = () =><p>'this is a test of your emergency broadcast system'</p>;
            return <Window name='testPDF' closeWindow={()=> this.setState({testPDFWindowShown:false})} windowShown={this.state.testPDFWindowShown} guts={str} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)}/>
        }
        const testFolder = () => {
            const openFunc = () => {
                this.setState({testFolderWindowShown:true})
            }
            return <Folder name='testFolder' onDoubleClick={openFunc}/>
        }
        const testFolderWindow = () => {
            return <Window name='testFolder' closeWindow={() => this.setState({testFolderWindowShown:false})} windowShown={this.state.testFolderWindowShown} guts={testPDF} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)}/>
        }
        const welcomeIcon = () =>{
            const openFunc = () =>{
                this.setState({welcomePage:true});
            }
            return <Html name='welcomePage' onDoubleClick={openFunc}/>
        }
        const welcomeWindow = () =>{
            return <Window name='welcomePage' closeWindow={() => this.setState({welcomePage:false})} windowShown={this.state.welcomePage} guts={landingWindow} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)}/>
        }

        return (
            <div id='Desktop'>
                {GithubLink()}
                {testFolder()}
                {testFolderWindow()}
                {testPDFWindow()}
                {welcomeIcon()}
                {welcomeWindow()}
            </div>
        )
    };
}
const root = ReactCliDOM.createRoot(document.getElementById("root"));
root.render(<Desktop />);