export function getNumFromPx(numPx){
    if(typeof numPx == "string"){
      const stripped = numPx.replace("px", '');
      return parseInt(stripped, 10);
    }
    console.log("input not a string for get num from px");
    return numPx;
}

export function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}


export function sortedKeysByVal(dict){
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


export function findKeyOfmax(dict){
    let maxKey, maxValue = 0;
    for(const [key, value] of Object.entries(dict)) {
      if(value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }
    return maxKey;
}