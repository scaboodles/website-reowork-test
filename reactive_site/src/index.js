import React, { useState, useEffect, useRef } from 'react';
import ReactCliDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './style.css';
import { clickAndDrag, suspendDrag } from './draggableDiv';
import { getNumFromPx } from './helpers';

function Window(props) {
    const moverRef = React.createRef(null)
    const windowRef = React.createRef(null);
    const resizeRefT = React.createRef(null);
    const resizeRefL = React.createRef(null);
    const resizeRefR = React.createRef(null);
    const resizeRefB = React.createRef(null);

    const windowShown = props.hideWindow;
    const pairName = props.pairName;
    const guts = props.guts;

    const minWidth = 280;
    const minHeight = 280;
    let resizeOutOfBoundsOffset = 0;

    const closeFunc = (() => {
        props.closeWindow();
    });

    useEffect(() => {
        if (windowRef.current != null) {
            //make moveable
            clickAndDrag(moverRef.current, windowRef.current);

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
                console.log(resizeOutOfBoundsOffset);
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
        console.log(pairName);
        return ReactDOM.createPortal(
            <div ref={moverRef} className="mover" id={pairName}>
                <div className="window" ref={windowRef}>
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
            </div>,
            document.body
        );
    }
    return null
}

function Folder(props) {
    const folderRef = React.createRef(null);
    useEffect(() => {
        clickAndDrag(folderRef.current);
    });

    return (
        <div ref={folderRef} className="folder" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/folder.png')} />
            <h1>{props.name}</h1>
        </div>
    );
}

function Pdf(props) {
    const pdfRef = React.createRef(null);
    useEffect(() => {
        clickAndDrag(pdfRef.current);
    });

    return (
        <div ref={pdfRef} className="pdf" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/txt-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
}
class IconWindowPair extends React.Component {
    constructor(props) {
        super(props);
        let icon = null;
        if(this.props.type == "pdf"){
            icon = () => <Pdf onDoubleClick={this.toggleWindowOn} name={this.props.name}/>;
        }
        else{
            icon = () => <Folder onDoubleClick={this.toggleWindowOn} name={this.props.name}/>;
        }
        this.state = { windowToggle: false, pairName: props.name, fileType: this.props.type, icon: icon, guts: this.props.guts};
    }

    toggleWindowOn = (() => {
        this.setState((state) => {
            return { windowToggle: true, pairName: state.pairName, fileType: state.fileType, icon: state.icon, guts: this.state.guts};
        })
    });

    toggleWindowOff = (() => {
        this.setState((state) => {
            return { windowToggle: false, pairName: state.pairName, fileType: state.fileType, icon: state.icon, guts: this.state.guts};
        })
    });

    render() {
        return (
            <div id={`${this.state.pairName}Pair`}>
                {this.state.icon()}
                <Window hideWindow={this.state.windowToggle} closeWindow={this.toggleWindowOff} pairName={this.state.pairName} guts={this.state.guts}/>
            </div>
        )
    };
}
const FolderGutsTest = () => {
    const interInternals = () => {
        return(
            <p>this is cool right?</p>
        )
    }
    return(
        <IconWindowPair name="nestedPdf" type="pdf" guts={interInternals}/>
    )
}

const PdfGutsTest = () => {
    return(
        <p>This is a test of your emergency broadcast system</p>
    )
}

class Desktop extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const GithubLink = () => {
            const img1 = require('./resources/gh-icon.png');
            const img2 = require('./resources/gh-icon-invert.png');
            return <a href='https://github.com/scaboodles' target="_blank"><img id='githubIcon' src={img1} onMouseOver={e => (e.currentTarget.src = img2)} onMouseOut={e => (e.currentTarget.src = img1)} alt="github link"></img></a>;
        }

        return (
            <div>
                {GithubLink()}
                <IconWindowPair name="test" type="folder" guts={FolderGutsTest}/>
                <IconWindowPair name="samplePdf" type="pdf" guts={PdfGutsTest}/>
            </div>
        )
    };
}
const root = ReactCliDOM.createRoot(document.getElementById("root"));
root.render(<Desktop />);