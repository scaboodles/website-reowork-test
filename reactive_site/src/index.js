import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
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
        return (
            <div ref={moverRef} className="mover" id="mover">
                <div className="window" id="testWin" ref={windowRef}>
                    <div ref={resizeRefT} className="resizer resizer-t"></div>
                    <div ref={resizeRefL} className="resizer resizer-l"></div>
                    <div ref={resizeRefR} className="resizer resizer-r"></div>
                    <div ref={resizeRefB} className="resizer resizer-b"></div>

                    <div className="windowHead" id="moverHead">
                        <img src={require('./resources/window-head-left.png')} className="windowHeadBorder windowHeadBorderLeft"></img>
                        <button className='closeButton' type='button' onClick={closeFunc}></button>
                        <img src={require('./resources/window-head-middle.png')} className="windowHeadBorder windowHeadBorderMid"></img>
                        <h1>Moving window test</h1>
                        <img src={require('./resources/window-head-right.png')} className="windowHeadBorder windowHeadBorderRight"></img>
                    </div>
                    
                    <img src={require('./resources/window-border.png')} className="windowBorderLeft"></img>
                    <img src={require('./resources/window-border.png')} className="windowBorderRight"></img>

                    <div className='windowContents'>
                        <p>Try</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
                        <p>it</p>
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
            <h1>name</h1>
        </div>
    );
}

class IconWindowPair extends React.Component {
    constructor(props) {
        super(props);
        this.state = { windowToggle: false, pairId: props.id, windowSize: { height: 200, width: 200 } };
    }

    windowResize = ((e, direction, ref, d) => {
        this.setState((state) => {
            return { windowToggle: state.windowToggle, pairId: state.pairId, windowSize: { width: state.width + d.width, height: state.height + d.height } };
        })
    })

    toggleWindowOn = (() => {
        this.setState((state) => {
            return { windowToggle: true, pairId: state.pairId, windowSize: state.windowSize };
        })
    });

    toggleWindowOff = (() => {
        this.setState((state) => {
            return { windowToggle: false, pairId: state.pairId, windowSize: state.windowSize };
        })
    });

    render() {
        return (
            <div id={this.state.id}>
                <Folder onDoubleClick={this.toggleWindowOn} />
                <Window hideWindow={this.state.windowToggle} closeWindow={this.toggleWindowOff} windowSize={this.state.windowSize} resizeFunc={this.windowResize} />
            </div>
        )
    };
}

class Desktop extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div cursor={'col-resize'}>
                <IconWindowPair id="folderTest" />
            </div>
        )
    };
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Desktop />);