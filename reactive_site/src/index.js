import React, { useState, useEffect, useRef, forwardRef, createRef } from 'react';
import ReactCliDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './style.css';
import { clickAndDrag, suspendDrag } from './draggableDiv';
import { getNumFromPx } from './helpers';

const Window = React.forwardRef((props, ref) => {
    const moverRef = React.createRef(null)
    const windowRef = React.createRef(null);
    const resizeRefT = React.createRef(null);
    const resizeRefL = React.createRef(null);
    const resizeRefR = React.createRef(null);
    const resizeRefB = React.createRef(null);

    const pairName = props.pairName;
    const guts=props.guts;
    const gutsRef = ref;

    const minWidth = 280;
    const minHeight = 280;
    let resizeOutOfBoundsOffset = 0;

    let windowShown = props.hideWindow;

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

                    <div className='windowContents' ref={gutsRef}>
                        {this.props.children}
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
    return(
        <div className='hidden'>
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

                    <div className='windowContents' ref={gutsRef}>
                        {props.children}
                    </div>

                    <div className='windowBorderBottomContainer'>
                        <img src={require('./resources/window-border-bottom-left.png')} className='windowBorderBottomLeft'></img>
                        <img src={require('./resources/window-border.png')} className='windowBorderBottom'></img>
                        <img src={require('./resources/window-border-bottom-right.png')} className='windowBorderBottomRight'></img>
                    </div>
                </div>
            </div>
        </div>
    );
});

const Folder = React.forwardRef((props, ref) => {
    const iconRef = React.createRef(null);
    useEffect(() => {
        clickAndDrag(iconRef.current);
    });
    if(ref != null && ref.current != null){
        const windowContainer = ref.current;
        windowContainer.state.guts.push( () => ( 
            <div ref={iconRef} className="folder" onDoubleClick={props.onDoubleClick}>
                <img src={require('./resources/folder.png')} />
                <h1>{props.name}</h1>
            </div>
        ));
    }else{
        return ( 
            <div ref={iconRef} className="folder" onDoubleClick={props.onDoubleClick}>
                <img src={require('./resources/folder.png')} />
                <h1>{props.name}</h1>
            </div>
        );
    }
});

const Pdf = React.forwardRef((props, ref) => {
    const iconRef = React.createRef(null);
    useEffect(() => {
        clickAndDrag(iconRef.current);
    });
    return(
        <div ref={iconRef} className="pdf" onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/txt-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
});
class IconWindowPair extends React.Component {
    constructor(props) {
        super(props);
        let icon = null;
        if(this.props.type == "pdf"){
            icon = () => <Pdf onDoubleClick={this.toggleWindowOn} name={this.props.name} ref = {props.forwardRefIcon}/>;
        }
        else{
            icon = () => <Folder onDoubleClick={this.toggleWindowOn} name={this.props.name} ref={props.forwardRefIcon}/>;
        }
        this.state = { windowToggle: false, pairName: props.name, fileType: this.props.type, icon: icon, guts: this.props.guts};
    }

    toggleWindowOn = (() => {
        this.setState({windowToggle:true});
    });

    toggleWindowOff = (() => {
        this.setState({windowToggle:false});
    });

    render() {
        return (
            <div id={`${this.state.pairName}Pair`}>
                {this.state.icon()}
                <Window hideWindow={this.state.windowToggle} closeWindow={this.toggleWindowOff} pairName={this.state.pairName} guts={[this.state.guts]} ref={this.props.forwardRefWindow}/>
            </div>
        )
    };
}

const IconWindowPairWithRefs = React.forwardRef((props, ref) => {
    const {ref1, ref2} = ref;
    return(
        <IconWindowPair {...props} forwardRefIcon={ref1} forwardRefWindow={ref2}/>
    );
});

const FolderGutsTest = () => {
    /*const interInternals = () => {
        return(
            <p>this is cool right?</p>
        )
    }
    return(
        <IconWindowPair name="nestedPdf" type="pdf" guts={interInternals}/>
    )*/
    <p>nothin special</p>
}

const PdfGutsTest = () => {
    return(
        <p>This is a test of your emergency broadcast system</p>
    )
}

class Desktop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {testFolderRef:React.createRef(null), testFolderWindow:React.createRef(null)};
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
                <IconWindowPairWithRefs name="test" type="folder" guts={FolderGutsTest} ref={{ref1:this.state.testFolderRef, ref2:this.state.testFolderWindow}}/>
            </div>
        )
    };
}
const root = ReactCliDOM.createRoot(document.getElementById("root"));
root.render(<Desktop />);