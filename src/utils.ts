export function roundToStep(x: number, step: number) {
    return ((x % step) < step / 2) ? x - x % step : (x + step) - (x + step) % step;
}

export function getDist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function getEq(x1: number, y1: number, x2: number, y2: number) {
    const res = [0, 0];
    res[0] = (y1 - y2) / (x1 - x2);
    res[1] = y1 - res[0] * x1;
    return res;
}

export function getSel(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, sc: number) {
    var kx = getEq(x1, y1, x2, y2);
    var a = kx[0];
    var b = -1;
    var c = kx[1];
    var dist = Math.abs(a * x3 + b * y3 + c) / (Math.sqrt(a * a + b * b));
    if (Math.abs(a) > 100000) { dist = 0; }
    let n = 5 / sc;
    var bou = ((x3 <= x1 + n) && (x3 > x2 - n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
        (x3 > x1 - n) && (x3 <= x2 + n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
        (x3 <= x1 + n) && (x3 > x2 - n) && (y3 > y1 - n) && (y3 <= y2 + n) ||
        (x3 > x1 - n) && (x3 <= x2 + n) && (y3 > y1 - n) && (y3 <= y2 + n));
    return (((dist < (10 / sc)) && bou) || getSelMark(x1, y1, x3, y3, sc) || getSelMark(x2, y2, x3, y3, sc));
}

export function inBox(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, sc?:number) {
    let n = 0;
    var bou = ((x3 <= x1 + n) && (x3 > x2 - n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
        (x3 > x1 - n) && (x3 <= x2 + n) && (y3 <= y1 + n) && (y3 > y2 - n) ||
        (x3 <= x1 + n) && (x3 > x2 - n) && (y3 > y1 - n) && (y3 <= y2 + n) ||
        (x3 > x1 - n) && (x3 <= x2 + n) && (y3 > y1 - n) && (y3 <= y2 + n));
    return bou;
}

/*function solveLines(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, sc: any) {
    var kx = getEq(x1, y1, x2, y2);
    var k1 = kx[0];
    var b1 = kx[1];
    var kx = getEq(x3, y3, x4, y4);
    var k2 = kx[0];
    var b2 = kx[1];
    var x = (b2 - b1) / (k - K1);
    var y = k1 * x + b1;
    if (inBox(x1, y1, x2, y2, x, y)) {
        var res = [x, y];
    }
    else { res = null }
    return res;
}*/

export function getSelMark(x1: number, y1: number, x3: number, y3: number, sc: number) {
    return (getDist(x1, y1, x3, y3) < (10 / sc));
}

//downloadImage(canvas.toDataURL(), filename);
export function downloadImage(data: string, filename: string) {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
};