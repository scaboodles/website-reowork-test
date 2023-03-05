export function getNumFromPx(numPx){
    const stripped = numPx.replace("px", '');
    return parseInt(stripped, 10);
}

export function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }