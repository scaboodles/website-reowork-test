import React, { useState, useEffect, useRef, forwardRef, createRef, StrictMode } from 'react';
import ReactCliDOM from 'react-dom/client';
import ReactDOM from 'react-dom';
import './style.css';
import { getNumFromPx, sortedKeysByVal, findKeyOfmax} from './helpers';
import { LandingWindow } from './landingPage';
import { PigeonMingleLauncher } from './pigeonMingleLauncher';
import { BrowserRouter, Route,Routes } from 'react-router-dom';

import djHotkeyDemo from "./resources/movies/dj-hotkey-demo.mov"

const maxDimensionsOffset = {width:10,height:10};
const defaultDimensions = {
    width: 860,
    height: 440
};
const defaultPosition = {x:15, y:15};
const maximizedPosition = {x:5, y:5};

function Window(props){
    const moverRef = React.createRef(null)
    const windowRef = React.createRef(null);
    const resizeRefT = React.createRef(null);
    const resizeRefL = React.createRef(null);
    const resizeRefR = React.createRef(null);
    const resizeRefB = React.createRef(null);
    const resizeRefTL = React.createRef(null);
    const resizeRefTR = React.createRef(null);
    const resizeRefBL = React.createRef(null);
    const resizeRefBR = React.createRef(null);

    const pairName = props.name;
    const Guts=props.guts;

    const zIndexes=props.zIndexes;

    const updateWidth = () => {
        if(windowRef.current){
            const styles = window.getComputedStyle(windowRef.current);
            props.updateWidth(parseInt(styles.width,10));
        }
    }
    const updateHeight = () =>{
        if(windowRef.current){
            const styles = window.getComputedStyle(windowRef.current);
            props.updateHeight(parseInt(styles.height,10));
        }
    }
    const updatePositions = () =>{
        const moverMounted = moverRef.current;
        if(moverMounted){
            const styles = window.getComputedStyle(moverMounted);
            let newPos = {x:getNumFromPx(styles.left), y:getNumFromPx(styles.top)};
            props.setPos(newPos);
        }
    }

    function clickAndDrag(element, win){
        dragElement(element, win);
    }

    function dragElement(elmnt, win){
        var x1 = 0, x2 = 0, y1 = 0, y2 = 0;

        //hella globals bc i am bad at programming
        let outOfBoundsX = 0;
        let outOfBoundsY = 0;

        let width = 0;
        let height = 0;

        let dxOld = 0;
        let dyOld = 0;

        let leftGrace = 0;
        let rightGrace = 0;

        let maxY =  window.innerHeight;
        let maxX = window.innerWidth;


        const headerOffset = 15;

        if (document.getElementById(elmnt.id + "Head")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "Head").onmousedown = dragMouseDown;
        } else {
            //error can happen if element is missing a head or an id
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e){
            e = e || window.event; //if e is unassigned, it is assigned to window.event
            e.preventDefault(); //only execute specifically handled events

            // get the mouse cursor position at startup:
            x2 = e.clientX;
            y2 = e.clientY;

            //initialize outOfBounds values
            outOfBoundsX = elmnt.offsetLeft;
            outOfBoundsY = elmnt.offsetTop;

            //max height and width of window
            maxX = window.innerHeight;
            maxX = window.innerWidth;

            if(win){ //need some data from win ref, might not exist yet
                width = win.offsetWidth;
                height = win.offsetHeight;
                let pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;
            }else{
                width = elmnt.offsetWidth;
                height = elmnt.offsetHeight;
                let pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;
            }

            document.onmouseup = closeDragElement; //stop dragging on mouse up
            document.onmousemove = elementDrag; // call a function whenever the cursor moves:

        }

        function elementDrag(e){
            e = e || window.event; //if e is unassigned, it is assigned to window.event
            e.preventDefault();

            //recalculate cursor position

            x1 = x2 - e.clientX;
            y1 = y2 - e.clientY;

            let dx = -x1;
            let dy = -y1;

            x2 = e.clientX;
            y2 = e.clientY;

            if(dxOld * dx < 0){//recalculate left and right grace spans on switch direction
                let pointOnWin = x2 - elmnt.offsetLeft;
                leftGrace = pointOnWin;
                rightGrace = width - pointOnWin;

                if(dx<0){ //force window back in bounds after change in direction
                    let outOfBounds = elmnt.offsetLeft + width - maxX;
                    if(outOfBounds>0){
                        outOfBoundsX -= outOfBounds; 
                        elmnt.style.left = `${maxX-width}px`;
                    }
                }else{
                    let outOfBounds = elmnt.offsetLeft;
                    if(outOfBounds<0){
                        outOfBoundsX -= outOfBounds; 
                        elmnt.style.left = `0px`;
                    }
                }
            }

            if(dyOld * dy < 0){
                if(dy>0){
                    let outOfBounds = elmnt.offsetTop;
                    if(outOfBounds < 0){
                        outOfBoundsY -= outOfBounds;
                        elmnt.style.top = `0px`;
                    }
                }else{
                    let outOfBounds = (elmnt.offsetTop + height) - maxY;
                    if(outOfBounds > 0){
                        outOfBoundsY -= outOfBounds;
                        elmnt.style.top = `${maxY - height}px`
                    }
                }
            }
            // set the element's new position:
            if(dx<0){ //calculate moving left and right separately
                if(outOfBoundsX >= 0 && outOfBoundsX - rightGrace <= maxX - width){//not out of bounds left side, within grace span of right edge
                    outOfBoundsX -= x1; //update outOfBounds tracker
                    elmnt.style.left = (elmnt.offsetLeft - x1) + "px";//update pos
                }else if(rightGrace < 0){
                    let pointOnWin = x2 - elmnt.offsetLeft;
                    leftGrace = pointOnWin;
                    rightGrace = width - pointOnWin;
                }
            }else if(dx>0){
                if(outOfBoundsX <= maxX - width && outOfBoundsX + leftGrace >= 0){
                    outOfBoundsX -= x1;
                    elmnt.style.left = (elmnt.offsetLeft - x1) + "px";
                }else if(leftGrace < 0){
                    let pointOnWin = x2 - elmnt.offsetLeft;
                    leftGrace = pointOnWin;
                    rightGrace = width - pointOnWin;
                }
            }

            if(dy<0){ //calculate moving up and down separately
                if(outOfBoundsY >= 0 && outOfBoundsY <= maxY && e.clientY < maxY - height + headerOffset){//not out of bounds on top
                    outOfBoundsY -= y1; //update outOfBounds tracker
                    elmnt.style.top = (elmnt.offsetTop - y1) + "px";//update pos
                }
            }else if(dy>0){
                if(outOfBoundsY <= maxY - height && outOfBoundsY >= 0 && e.clientY - headerOffset > 0){
                    outOfBoundsY -= y1;
                    elmnt.style.top = (elmnt.offsetTop - y1) + "px";
                }
            }

            if(!dx == 0){
                dxOld = dx;
            }
            if(!dy == 0){
                dyOld = dy;
            }
        }

        function closeDragElement(e) {
            // stop moving when mouse button is released by removing document mouse events
            document.onmouseup = null;
            document.onmousemove = null;
            
            if(elmnt.offsetLeft + width > maxX){//force window back in bounds if out
                elmnt.style.left = `${maxX-width}px`;
            }else if(elmnt.offsetLeft<0){
                elmnt.style.left = `0px`;
            }

            outOfBoundsX = 0;
            outOfBoundsY = 0;

            updatePositions();
        }
    }

    const minWidth = 280;
    const minHeight = 280;
    let resizeOutOfBoundsOffsetY = 0;
    let resizeOutOfBoundsOffsetX = 0;

    let windowShown = props.windowShown;

    let MaximizeButton = null;

    const closeFunc = (() => {
        props.closeWindow();
        SendZIndexToBack();
    });

    const maximizeWindow = (() => {
       props.updateHeight(window.innerHeight - maxDimensionsOffset.height);
       props.updateWidth(window.innerWidth - maxDimensionsOffset.width);
       props.setPos(maximizedPosition);
    })

    const minimizeWindow = (() => {
        props.updateHeight(defaultDimensions.height);
        props.updateWidth(defaultDimensions.width);
    })

    if(props.width >= window.innerWidth - 50 && props.height >= window.innerHeight - 50){
        MaximizeButton = () => <button className='minimizeButton' type='button' onClick={minimizeWindow}></button>;
    }else{
        MaximizeButton = () => <button className='maximizeButton' type='button' onClick={maximizeWindow}></button>;
    }

    const BringZIndexToFront = () =>{
        const highestZ=findKeyOfmax(zIndexes);
        if(highestZ == pairName){
            return;
        }else{
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

    const SendZIndexToBack = () =>{
        const highestZ=findKeyOfmax(zIndexes);
        if(highestZ != pairName){
            return;
        }else{
            let sortedKeys = sortedKeysByVal(zIndexes);
            let currIndex = sortedKeys.indexOf(pairName);
            sortedKeys.push(sortedKeys.splice(currIndex, 1)[0]);
            let updatedZs = {};
            for(let i=0; i<sortedKeys.length; i++){
                updatedZs[sortedKeys[i]] = sortedKeys.length - i + 1;
            }
            props.updateZ(updatedZs);
        }
    }

    useEffect(() => {
        const mounted = windowRef.current;
        if(mounted){
            mounted.style.width = `${props.width}px`
            mounted.style.height = `${props.height}px`
        }
        const moverMounted = moverRef.current;
        if(moverMounted){
            moverMounted.style.top = `${props.position.y}px`;
            moverMounted.style.left = `${props.position.x}px`;
        }
    },[])
      
    useEffect(() => {
        if (windowRef.current != null) {
            //make moveable
            clickAndDrag(moverRef.current, windowRef.current, () => updatePositions());

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
                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x<window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            };

            const onMouseUpRightResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveRightResize);
                resizeOutOfBoundsOffsetX = 0;

                updateWidth();
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
                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
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
                resizeOutOfBoundsOffsetX = 0;

                updatePositions();
                updateWidth();
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
                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y > 0){
                        resizableEle.style.height = `${height}px`;
                    }
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
                resizeOutOfBoundsOffsetY = 0;
                updatePositions();
                updateHeight();
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
                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }
            };

            const onMouseUpBottomResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveBottomResize);
                resizeOutOfBoundsOffsetY = 0;

                updateHeight();
            }

            const onMouseDownBottomResize = (event) => {
                y = event.clientY
                const styles = window.getComputedStyle(resizableEle);
                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = null;
                document.addEventListener("mousemove", onMouseMoveBottomResize);
                document.addEventListener("mouseup", onMouseUpBottomResize);
            }

            //Top Left
            const onMouseMoveTopLeftResize = (event) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width - dx;
                height = height - dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y>0){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpTopLeftResize = (event) => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = 0;
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`

                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = 0;
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveTopLeftResize);

                updatePositions();
                updateHeight();
                updateWidth();
            }

            const onMouseDownTopLeftResize = (event) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = null;
                resizableEle.style.bottom = styles.bottom;

                resizableEle.style.left = null; 
                resizableEle.style.right = styles.right;

                document.addEventListener("mousemove", onMouseMoveTopLeftResize);
                document.addEventListener("mouseup", onMouseUpTopLeftResize);
            }

            //Top Right
            const onMouseMoveTopRightResize = (event) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width + dx;
                height = height - dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y > 0){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x < window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpTopRightResize = (event) => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempTop = getNumFromPx(resizedStyle.top);
                moveableContainer.style.top = `${getNumFromPx(moverStyle.top) + tempTop}px`;
                resizableEle.style.top = 0;
                resizableEle.style.bottom = `${getNumFromPx(resizedStyle.bottom) + tempTop}px`;

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveTopRightResize);


                updatePositions();
                updateHeight();
                updateWidth();
            }

            const onMouseDownTopRightResize = (event) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = null;
                resizableEle.style.bottom = styles.bottom;

                resizableEle.style.left = styles.left; 
                resizableEle.style.right = null;

                document.addEventListener("mousemove", onMouseMoveTopRightResize);
                document.addEventListener("mouseup", onMouseUpTopRightResize);
            }

            //Bot Right
            const onMouseMoveBottomRightResize = (event) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width + dx;
                height = height + dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x < window.innerWidth){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpBottomRightResize = (event) => {
                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveBottomRightResize);

                updateHeight();
                updateWidth();
            }

            const onMouseDownBottomRightResize = (event) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = null;

                resizableEle.style.left = styles.left; 
                resizableEle.style.right = null;

                document.addEventListener("mousemove", onMouseMoveBottomRightResize);
                document.addEventListener("mouseup", onMouseUpBottomRightResize);
            }

            //Bot left
            const onMouseMoveBottomLeftResize = (event) => {
                const dy = event.clientY - y;
                const dx = event.clientX - x;

                y = event.clientY;
                x = event.clientX;

                width = width - dx;
                height = height + dy;

                resizeOutOfBoundsOffsetY = minHeight - height;
                if(resizeOutOfBoundsOffsetY <= 0){
                    if(y < window.innerHeight){
                        resizableEle.style.height = `${height}px`;
                    }
                }

                resizeOutOfBoundsOffsetX = minWidth - width;
                if(resizeOutOfBoundsOffsetX <= 0){
                    if(x > 0){
                        resizableEle.style.width = `${width}px`;
                    }
                }
            }

            const onMouseUpBottomLeftResize = (event) => {
                const resizedStyle = window.getComputedStyle(resizableEle);
                const moverStyle = window.getComputedStyle(moveableContainer);

                const tempLeft = getNumFromPx(resizedStyle.left);
                moveableContainer.style.left = `${getNumFromPx(moverStyle.left) + tempLeft}px`;
                resizableEle.style.left = 0;
                resizableEle.style.right = `${getNumFromPx(resizedStyle.right) + tempLeft}px`

                resizeOutOfBoundsOffsetY = 0;
                resizeOutOfBoundsOffsetX = 0;

                document.removeEventListener("mousemove", onMouseMoveBottomLeftResize);

                updatePositions();
                updateHeight();
                updateWidth();
            }

            const onMouseDownBottomLeftResize = (event) => {
                y = event.clientY;
                x = event.clientX;

                const styles = window.getComputedStyle(resizableEle);

                resizableEle.style.top = styles.top;
                resizableEle.style.bottom = null;

                resizableEle.style.left = null; 
                resizableEle.style.right = styles.right;

                document.addEventListener("mousemove", onMouseMoveBottomLeftResize);
                document.addEventListener("mouseup", onMouseUpBottomLeftResize);
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

            const resizerTopLeft = resizeRefTL.current;
            resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize);

            const resizerTopRight = resizeRefTR.current;
            resizerTopRight.addEventListener("mousedown", onMouseDownTopRightResize);

            const resizerBottomRight = resizeRefBR.current;
            resizerBottomRight.addEventListener("mousedown", onMouseDownBottomRightResize);

            const resizerBottomLeft = resizeRefBL.current;
            resizerBottomLeft.addEventListener("mousedown", onMouseDownBottomLeftResize);

            moveableContainer.addEventListener("mousedown", BringZIndexToFront);

            //cleanup event listeners
            return () => {
                resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
                resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
                resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
                resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
                resizerTopLeft.removeEventListener("mousedown", onMouseDownTopLeftResize);
                resizerTopRight.removeEventListener("mousedown", onMouseDownTopRightResize);
                resizerBottomLeft.removeEventListener("mousedown", onMouseDownBottomLeftResize);
                resizerBottomRight.removeEventListener("mousedown", onMouseDownBottomRightResize);
                moveableContainer.addEventListener("mousedown", BringZIndexToFront);
            }
        };
    });
    if (windowShown) {
        return (
            <div ref={moverRef} className="mover" id={pairName}>
                <div className="window" ref={windowRef} >
                    <div ref={resizeRefT} className="resizer resizer-t"></div>
                    <div ref={resizeRefL} className="resizer resizer-l"></div>
                    <div ref={resizeRefR} className="resizer resizer-r"></div>
                    <div ref={resizeRefB} className="resizer resizer-b"></div>
                    <div ref={resizeRefTL} className="resizer resizer-tl"/>
                    <div ref={resizeRefTR} className="resizer resizer-tr"/>
                    <div ref={resizeRefBL} className="resizer resizer-bl"/>
                    <div ref={resizeRefBR} className="resizer resizer-br"/>

                    <div className="windowHead" id={`${pairName}Head`}>
                        <img src={require('./resources/window-head-left.png')} className="windowHeadBorder windowHeadBorderLeft"></img>
                        <img src={require('./resources/window-head-middle.png')} className="windowHeadBorder windowHeadBorderMid"></img>
                        <h1>{pairName}</h1>
                        <img src={require('./resources/window-head-right.png')} className="windowHeadBorder windowHeadBorderRight"></img>
                    </div>
                    <button className='closeButton' type='button' onClick={closeFunc}></button>
                    <MaximizeButton/>
                    
                    <img src={require('./resources/window-border.png')} className="windowBorderLeft"></img>
                    <img src={require('./resources/window-border.png')} className="windowBorderRight"></img>

                    <div className='windowContents'>
                        <Guts/>
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
        <div className="icon" id={props.id} onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/folder.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

export const Mov = (props) => {
    return ( 
        <div className="icon" id={props.id} onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/mov-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

const Pdf  = (props) => {
    return(
        <div className="icon" id={props.id} onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/txt-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

const Html = (props) => {
    return(
        <div className="icon" id={props.id} onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/html-icon.png')} />
            <h1>{props.name}</h1>
        </div>
    );
};

const MingleLauncher = (props) => {
    return(
        <div className="icon" id={props.id} onDoubleClick={props.onDoubleClick}>
            <img src={require('./resources/pigeonIcon.png')} />
            <h1>{"Pigeon Mingle"}</h1>
        </div>
    );
};

class Desktop extends React.Component {
    constructor(props) {
        super(props)
        let maxDimensions = {
            width:window.innerWidth-maxDimensionsOffset.width,
            height:window.innerHeight-maxDimensionsOffset.height
        };
        this.state = {
            testFolderWindowShown:false,
            testFolderWindowWidth:defaultDimensions.width,
            testFolderWindowHeight:defaultDimensions.height,
            testFolderWindowPosition:defaultPosition,

            testPDFWindowShown:false,
            testPDFWindowWidth:defaultDimensions.width,
            testPDFWindowHeight:defaultDimensions.height,
            testPDFWindowPosition: defaultPosition,

            welcomePageShown:true,
            welcomePageWidth:maxDimensions.width,
            welcomePageHeight:maxDimensions.height,
            welcomePagePosition:maximizedPosition,

            mingleLauncherShown:false,
            mingleLauncherWidth:maxDimensions.width,
            mingleLauncherHeight:maxDimensions.height,
            mingleLauncherPosition:maximizedPosition,

            testVideoShown:false,
            testVideoWidth:defaultDimensions.width,
            testVideoHeight:defaultDimensions.height,
            testVideoPosition:defaultPosition,

            zIndexes:{welcomePage:6, testVideo:5, testPDF:4, testFolder:3, mingleLauncher: 2}
        };
    }
    render() {
        const setNewZIndex = (updatedIndexes) => {
            this.setState({zIndexes:updatedIndexes});
        }

        const updateZIndexes = (name) =>{
            let zIndexes = this.state.zIndexes;
            const highestZ=findKeyOfmax(zIndexes);
            if(highestZ == name){
                return;
            }else{
                let sortedKeys = sortedKeysByVal(zIndexes);
                let currIndex = sortedKeys.indexOf(name);
                sortedKeys.unshift(sortedKeys.splice(currIndex, 1)[0]);
                let updatedZs = {};
                for(let i=0; i<sortedKeys.length; i++){
                    updatedZs[sortedKeys[i]] = sortedKeys.length - i + 1;
                }
                setNewZIndex(updatedZs);
            }
        }

        const GithubLink = () => {
            const img1 = require('./resources/gh-icon.png');
            const img2 = require('./resources/gh-icon-invert.png');
            return <a href='https://github.com/scaboodles' target="_blank"><img id='githubIcon' src={img1} onMouseOver={e => (e.currentTarget.src = img2)} onMouseOut={e => (e.currentTarget.src = img1)} alt="github link"></img></a>;
        }

        const LinkedInLink = () => {
            const img1 = require('./resources/linkedInIcon.png');
            const img2 = require('./resources/linkedInIcon-hover.png');
            return <a href='https://www.linkedin.com/in/owen-wolff-061a85229/' target="_blank"><img id='linkedInIcon' src={img1} onMouseOver={e => (e.currentTarget.src = img2)} onMouseOut={e => (e.currentTarget.src = img1)} alt="linked in link"></img></a>;
        }

        const TestPDF = () => {
            const openFunc = () =>{
                this.setState({testPDFWindowShown:true})
                updateZIndexes('testPDF');
            }
            return <Pdf name='testPDF' onDoubleClick={openFunc}/>
        }
        const TestPDFWindow = () =>{
            const setWidth = (newWidth) =>{
                this.setState({testPDFWindowWidth:newWidth});
            }
            const setHeight = (newHeight) =>{
                this.setState({testPDFWindowHeight:newHeight});
            }
            const setPos = (newPos) =>{
                this.setState({testPDFWindowPosition:newPos});
            }
            let str = () =><p>'this is a test of your emergency broadcast system'</p>;
            return <Window name='testPDF' closeWindow={()=> this.setState({testPDFWindowShown:false})} windowShown={this.state.testPDFWindowShown} guts={str} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)} width={this.state.testPDFWindowWidth} height={this.state.testPDFWindowHeight} updateWidth={setWidth} updateHeight={setHeight} position={this.state.testPDFWindowPosition} setPos={setPos}/>
        }

        const TestFolder = () => {
            const openFunc = () => {
                this.setState({testFolderWindowShown:true});
                updateZIndexes('testFolder');
            }
            return <Folder name='testFolder' id={"testFolder"} onDoubleClick={openFunc} />
        }
        const TestFolderWindow = () => {
            const setWidth = (newWidth) =>{
                this.setState({testFolderWindowWidth:newWidth});
            }
            const setHeight = (newHeight) =>{
                this.setState({testFolderWindowHeight:newHeight});
            }
            const setPos = (newPos) =>{
                this.setState({testFolderWindowPosition:newPos});
            }
            return <Window name='testFolder' closeWindow={() => this.setState({testFolderWindowShown:false})} windowShown={this.state.testFolderWindowShown} guts={() => <TestPDF/>} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)} width={this.state.testFolderWindowWidth} height={this.state.testFolderWindowHeight} updateWidth={setWidth} updateHeight={setHeight} position={this.state.testFolderWindowPosition} setPos={setPos}/>
        }

        const mingleLauncherOpenFunc = () =>{
            this.setState({mingleLauncherShown:true});
            updateZIndexes('mingleLauncher');
        }
        const MingleLauncherIcon = () =>{
            return <MingleLauncher name='mingleLauncher' onDoubleClick={mingleLauncherOpenFunc} id={"mingleLauncher"}/>
        }

        const MingleLauncherWindow = () =>{
            const closeFunc = () => {
                this.setState({mingleLauncherShown:false});
            }
            const setWidth = (newWidth) =>{
                this.setState({mingleLauncherWidth:newWidth});
            }
            const setHeight = (newHeight) =>{
                this.setState({mingleLauncherHeight:newHeight});
            }
            const setPos = (newPos) =>{
                this.setState({mingleLauncherPosition:newPos});
            }
            return <Window name='mingleLauncher' closeWindow={closeFunc} windowShown={this.state.mingleLauncherShown} guts={()=><PigeonMingleLauncher/>} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)} width={this.state.mingleLauncherWidth} height={this.state.mingleLauncherHeight} updateWidth={setWidth} updateHeight={setHeight} position={this.state.mingleLauncherPosition} setPos={setPos}/>
        }

        const WelcomeIcon = () =>{
            const openFunc = () =>{
                this.setState({welcomePageShown:true});
                updateZIndexes('welcomePage');
            }
            return <Html name='welcomePage' onDoubleClick={openFunc} id={"welcomeWindow"}/>
        }

        const WelcomeWindow = () =>{
            const closeFunc = () => {
                this.setState({welcomePageShown:false});
            }
            const setWidth = (newWidth) =>{
                this.setState({welcomePageWidth:newWidth});
            }
            const setHeight = (newHeight) =>{
                this.setState({welcomePageHeight:newHeight});
            }
            const setPos = (newPos) =>{
                this.setState({welcomePagePosition:newPos});
            }
            return <Window name='welcomePage' closeWindow={closeFunc} windowShown={this.state.welcomePageShown} guts={ () => <LandingWindow openMingleLancher={mingleLauncherOpenFunc}/>} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)} width={this.state.welcomePageWidth} height={this.state.welcomePageHeight} updateWidth={setWidth} updateHeight={setHeight} position={this.state.welcomePagePosition} setPos={setPos}/>
        }

        const TestVideoIcon = () =>{
            const openFunc = () =>{
                this.setState({testVideoShown:true});
                updateZIndexes('testVideo');
            }
            return <Mov name='testVideo' onDoubleClick={openFunc} id={"testVideo"}/>
        }
        const TestVideoGuts = () =>{
            return(
                <div className='windowVidBackground'>
                    <video className='windowVid' controls autoPlay loop muted>
                        <source src={djHotkeyDemo} type="video/mp4"></source>
                    </video>
                </div>
            )
        }
        const TestVideoWindow = () =>{
            const closeFunc = () => {
                this.setState({testVideoShown:false});
            }
            const setWidth = (newWidth) =>{
                this.setState({testVideoWidth:newWidth});
            }
            const setHeight = (newHeight) =>{
                this.setState({testVideoHeight:newHeight});
            }
            const setPos = (newPos) =>{
                this.setState({testVideoPosition:newPos});
            }
            return <Window name='testVideo' closeWindow={closeFunc} windowShown={this.state.testVideoShown} guts={ () => <TestVideoGuts/>} zIndexes={this.state.zIndexes} updateZ={(indexDict) => setNewZIndex(indexDict)} width={this.state.testVideoWidth} height={this.state.testVideoHeight} updateWidth={setWidth} updateHeight={setHeight} position={this.state.testVideoPosition} setPos={setPos}/>
        }

        return (
            <div id='Desktop'>
                <GithubLink/>
                <LinkedInLink/>

                <TestFolder/>
                <TestFolderWindow/>
                <TestPDFWindow/>

                <WelcomeIcon/>
                <WelcomeWindow/>

                <MingleLauncherIcon/>
                <MingleLauncherWindow/>

                <TestVideoIcon/>
                <TestVideoWindow/>
            </div>
        )
    };
}

function Wrapper(){
    const reload = () => window.location.reload();
    return(
        <div>
            <Routes>
                <Route path='/' element={<Desktop/>}/>
            </Routes>
        </div>
    )
}

const root = ReactCliDOM.createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <BrowserRouter>
            <Wrapper />
        </BrowserRouter>
    </StrictMode>
);