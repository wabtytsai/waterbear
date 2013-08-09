
function rad2deg(rad){
    return rad / DEGREE;
}

function deg2rad(deg){
    return deg * DEGREE;
}

function randint(start, stop){
    // return an integer between start and stop, inclusive
    if (stop === undefined){
        stop = start;
        start = 0;
    }
    var factor = stop - start + 1;
    return Math.floor(Math.random() * factor) + start;
}
