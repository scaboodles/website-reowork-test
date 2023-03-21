import { getOffset } from "./helpers";
export function clickAndDrag(element, win){
    dragElement(element, win);
}

export function suspendDrag(elmnt){
    if (document.getElementById(elmnt.id + "Head")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "Head").removeEventListener("onmousedown");
    } else {
        //error can happen if element is missing a head or an id
        document.removeEventListener("onmousemove");
    }
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
    }
}