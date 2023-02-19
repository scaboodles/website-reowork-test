export function getNumFromPx(numPx){
    const stripped = numPx.replace("px", '');
    return parseInt(stripped, 10);
}