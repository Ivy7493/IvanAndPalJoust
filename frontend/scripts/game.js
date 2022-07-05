import Color from "https://colorjs.io/dist/color.js";

const shakeBar = document.querySelector(".shakeBar");
const root = document.querySelector(":root");
const debug = document.querySelector("#debug");

const barCol1 = new Color("lightgreen");
const barCol2 = new Color("tomato");
const barGradient = barCol1.range(barCol2, { space: "lch", outputSpace: "srgb", hue: "increasing" });

let percentage = 0.0;

// window.addEventListener("deviceorientation", (event) => {
//     debug.innerHTML = tilt([event.beta, event.gamma]);
// }, true);

if (window.DeviceOrientationEvent) {
    addEventListener("deviceorientation", function (event) {
        // debug.textContent = event.beta;
    }, true);
}
if (window.DeviceMotionEvent) {
    addEventListener('devicemotion', function (event) {
        // debug.textContent = event.acceleration.x.toFixed(2);
        setPercentage(event.acceleration.x + event.acceleration.y + event.acceleration.y);
    }, true);
}
else {
    addEventListener("MozOrientation", function (event) {
        // debug.textContent = orientation.x;
    }, true);
}

function setPercentage(perc) {
    percentage = perc;
    updateShakeBar();
}

// calculates the norm of an R^3 vector
function norm(vec) {
    return Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z)
}

function addPercentage() {
    percentage += 0.5;
    percentage %= 100;
    updateShakeBar();
    // document.writeln("asdf");
}

function updateShakeBar() {
    shakeBar.style.height = percentage + "%";

    shakeBar.style.opacity = remap(percentage, 0.0, 100.0, 20.0, 30.0) + "%";
    // shakeBar.style.backgroundColor = barGradient(percentage/100.0).toString();
    root.style.setProperty("--shakeAmount", percentage / 10.0 + "px");
    document.body.style.backgroundColor = barGradient(percentage / 100.0).toString();
}

function remap(x, fromMin, fromMax, toMin, toMax) {
    return ((x - fromMin) / fromMax) * toMax + toMin;
}

// setPercentage(50.0);
setInterval(addPercentage, 30);