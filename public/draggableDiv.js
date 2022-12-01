window.onload = init;

function init(){
    let windows = document.getElementsByClassName("windowHead");

    for(let i=0; i<windows.length; i++){
        dragElement(windows[i]);
    }
}

function dragElement(elmnt){
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e){
        e = e || window.event; //if e is unassigned, it is assigned to window.event
        e.preventDefault(); //only execute specifically handled events

        // get the mouse cursor position at startup:
        x2 = e.clientX;
        y2 = e.clientY;

        document.onmouseup = closeDragElement; //stop dragging on mouse up
        document.onmousemove = elementDrag; // call a function whenever the cursor moves:
    }

    function elementDrag(e){
        e = e || window.event; //if e is unassigned, it is assigned to window.event
        e.preventDefault();

        //recalculate cursor position

        x1 = x2 - e.clientX;
        y1 = y2 - e.clientY;

        x2 = e.clientX;
        y2 = e.clientY;

        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - y1) + "px";
        elmnt.style.left = (elmnt.offsetLeft - x1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released by removing document mouse events
        document.onmouseup = null;
        document.onmousemove = null;
    }
}