export function hashStringToColor(str) {
    var hash = djb2(str);
    var h = (hash & 0xFF0000) >> 16;
    var s = (hash & 0x00FF00) >> 8;  s %= 128; s += 128;
    var v = hash & 0x0000FF;         v %= 128; v += 64;
    return { h: h, s: s, v: v };
}

function djb2(str) {
    var hash = 5381; // getting random number
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
}

export function hsvToString(hsv) {
    return "hsl(" + hsv.h + ", " + hsv.s/2.55 + "%, " + hsv.v/2.55 + "%)";
}

export function invertColor(color) {
    return {
        r: ("0" + (255-Number("0x"+color.h)).toString(16)).substr(-2),
        g: ("0" + (255-Number("0x"+color.s)).toString(16)).substr(-2),
        b: ("0" + (255-Number("0x"+color.v)).toString(16)).substr(-2),
    };
}
