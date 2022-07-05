import Color from "https://colorjs.io/dist/color.js";

const shakeBar = document.querySelector(".shakeBar");
const root = document.querySelector(":root");
const debug = document.querySelector("#debug");
const upIcon = document.querySelector(".bigIcon");
const toRad = Math.PI/180.0;
const qUp = new Quaternion(0, 0, 1, 0);

const barCol1 = new Color("lightgreen");
const barCol2 = new Color("tomato");
const barGradient = barCol1.range(barCol2, {space: "lch", outputSpace: "srgb", hue: "increasing"});

let percentage = 0.0;
let kfMotion = new KalmanFilter({R: 0.01, Q: 20, A: 0.9});
let kfRotate = new KalmanFilter();

let gameOver = false;

if (window.DeviceOrientationEvent) {
addEventListener("deviceorientation", function (event) {
    // Vertical up has a beta of 90
    // upIcon.style.transform.rotate
    // setPercentage(Math.abs(90 - event.beta));
    // root.style.setProperty("--upIconRotation", 0*(event.beta-90) + "deg");

    let q = Quaternion.fromEuler(event.alpha * toRad, event.beta * toRad, event.gamma * toRad, 'ZXY');
    let pointUp = Quaternion.I;
    // let pointUp = new Quaternion(0, 0, 0, 0);
    // let pointUp = Quaternion.fromAxisAngle("Z", 0);
    let qFinal = q;
    // let qFinal = Quaternion.fromBetweenVectors(q.toVector(), pointUp.toVector());
    // let qFinal = Quaternion.slerp();

    upIcon.style.transform = "matrix3d(" + qFinal.conjugate().toMatrix4() + ")";
    // upIcon.style.transform = "rotate(" + qUp.dot(q) + "deg)";

    let v = qFinal.toVector();
    debug.innerHTML = v[0].toFixed(1) + ", " + v[1].toFixed(1) + ", " + v[2].toFixed(1);
    // debug.innerHTML = event.alpha.toFixed(1) + "<br />" + event.beta.toFixed(1) + "<br />" + event.gamma.toFixed(1);
    }, true);
}
if (window.DeviceMotionEvent) {
addEventListener('devicemotion', function () {
    if(false && !gameOver)
    {
        let mag = norm(event.acceleration.x, event.acceleration.y, event.acceleration.z);
        let sig = 100.0*Math.abs(kfMotion.filter(mag));

        debug.textContent = sig.toFixed(4);
        setPercentage(clamp(sig, 0.0, 100.0));

        if(sig > 100.0)
        {
            //Lose game
            gameOver = true;
            setPercentage(100);
            debug.textContent = "GAME OVER " + debug.textContent;
        }
        // if(sig < min) { min = sig; debug.textContent = min; }
    }
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

function addPercentage() {
    percentage += 0.5;
    percentage %= 100;
    updateShakeBar();
}

function updateShakeBar() {
    shakeBar.style.height = percentage + "%";

    shakeBar.style.opacity = remap(percentage, 0.0, 100.0, 20.0, 30.0) + "%";
    // shakeBar.style.backgroundColor = barGradient(percentage/100.0).toString();
    root.style.setProperty("--shakeAmount", percentage*percentage/200.0 + "px");
    document.body.style.backgroundColor = barGradient(percentage/100.0).toString();
}

function remap(x, fromMin, fromMax, toMin, toMax) {
    return ((x - fromMin)/fromMax)*toMax + toMin;
}

function sigmoid(z) {
    return 1.0/(1 + Math.exp(-z/2));
}

function clamp(x, min, max) {
    return Math.min(max, Math.max(min, x));
}

function threshold(x, t) {
    return Math.max(x, t);
}

function norm(x, y, z) {
    return x*x + y*y + z*z;
}

// setPercentage(50.0);
// setInterval(addPercentage, 30);