import Color from "https://colorjs.io/dist/color.js";
import { playPreloadedSong } from "./setup.js";

async function playGameSong() {
    const song = "Umbrella.mp3";
    await playPreloadedSong(song);
}

let sensitivity = 1.0;
export function SetSensitivity(_sense){
    sensitivity = 1.2/_sense //if we wanna change the sensitivity relation here it is
}

export function initGame() { // essentially onload for join
    const shakeBar = document.querySelector(".shakeBar")
    const root = document.querySelector(":root");
    const debug = document.querySelector("#debug");
    const upIcon = document.querySelector(".bigIcon");
    const toRad = Math.PI / 180.0;
    const qUp = new Quaternion(0, 0, 1, 0);

    const initialWait = 2000;

    const barCol1 = new Color("lightgreen");
    const barCol2 = new Color("tomato");
    const barGradient = barCol1.range(barCol2, {
        space: "lch",
        outputSpace: "srgb",
        hue: "increasing",
    });

    let percentage = 0.0;
    let kfMotion = new KalmanFilter({ R: 0.01, Q: 20, A: 0.5 });
    let kfRotate = new KalmanFilter();
    

    let gameOver = false;

    //Counter to ignore the initial few accelerometer readings
    let ignoreBeginData = 0;
    const numDataIgnore = 100;

    if (window.DeviceOrientationEvent) {
    addEventListener(
        "deviceorientation",
        function (event) {
            if (!gameOver && ignoreBeginData > numDataIgnore) {

            let q = Quaternion.fromEuler(
                event.alpha * toRad,
                event.beta * toRad,
                event.gamma * toRad,
                "ZXY"
            );

            //=====Point up arrow=====
            let qFinal = q.inverse();
            upIcon.style.transform =
                "scaleX(-1) matrix3d(" +
                qFinal.conjugate().toMatrix4() +
                ") rotateX(90deg) scaleX(-1)";
            // upIcon.style.transform = "rotate(" + qUp.dot(q) + "deg)";

            //=====Gyro score=====
            let gyroScore = calcGyroScore(event.beta);

            //=====Check Game Over=====
            if(gyroScore < 0.65)
            {
                gameOver = true;
                socket.emit("playerLost");
            }

            //=====Debug Output=====
            // debug.innerHTML = v[0].toFixed(1) + ", " + v[1].toFixed(1) + ", " + v[2].toFixed(1);// + "<br />" + gyroScore.toFixed(3);
            // debug.innerHTML = "<br />" + gyroScore.toFixed(3);
            // debug.innerHTML += "<br />" + event.alpha.toFixed(1) + "<br />" + event.beta.toFixed(1) + "<br />" + event.gamma.toFixed(1);
        }
        },
        true
    );
    }

    if (window.DeviceMotionEvent) {
    addEventListener(
        "devicemotion",
        function (event) {
            // document.writeln(accelScore);
        if (!gameOver && ignoreBeginData++ > numDataIgnore) { //Date.now() - pageLoadTime > initialWait) {

            //=====Accel Score=====
            let accelScore = calcAccelScore(event.acceleration.x, event.acceleration.y, event.acceleration.z);
            accelScore *= sensitivity;

            setPercentage(100.0*clamp(accelScore, 0.0, 1.0));

            //=====Check Game Over=====
            if (accelScore > 1.0) {
                gameOver = true;
                setPercentage(100);
                socket.emit("playerLost");
            }

            //=====Debug Output=====
            // debug.innerHTML = accelScore.toFixed(3);
        }
        },
        true
    );
    } else {
        addEventListener(
        "MozOrientation",
        function (event) {
        // debug.textContent = orientation.x;
        },
        true
    );
    }

    function setPercentage(perc) {
        percentage = perc;
        debug.innerHTML = percentage.toFixed(3);
        updateShakeBar();
    }

    function addPercentage() {
        percentage += 0.5;
        percentage %= 100;
        updateShakeBar();
    }

    function updateShakeBar() {
        shakeBar.style.height = percentage + "%";

        shakeBar.style.opacity = remap(percentage, 0.0, 100.0, 20.0, 40.0) + "%";
        // shakeBar.style.backgroundColor = barGradient(percentage/100.0).toString();
        // root.style.setProperty(
        //     "--shakeAmount",
        //     (percentage * percentage) / 200.0 + "px"
        // );
        document.body.style.backgroundColor = barGradient(
            percentage / 100.0
        ).toString();
    }

    function calcGyroScore(beta)
    {
        //this is fuck ugly, will reduce later
        return Math.sign(beta)*(1.0-Math.abs(90-Math.abs(beta))/90.0);
    }

    function calcAccelScore(aX, aY, aZ)
    {
        let mag = norm(aX, aY, aZ);
        return Math.abs(kfMotion.filter(mag));
    }

    function remap(x, fromMin, fromMax, toMin, toMax) {
        return ((x - fromMin) / fromMax) * toMax + toMin;
    }

    function sigmoid(z) {
        return 1.0 / (1 + Math.exp(-z / 2));
    }

    function clamp(x, min, max) {
        return Math.min(max, Math.max(min, x));
    }

    function threshold(x, t) {
        return Math.max(x, t);
    }

    function norm(x, y, z) {
        return x * x + y * y + z * z;
    }

    function vDot(v1, v2) {
        return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    }

    // screen.orientation //TODO: DOUBLE CHECK THIS <<--
    // .lock()
    // .then(function () {
    //     screen.lockOrientation("default");
    // })
    // .catch(function (e) {});

    function getRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
    playGameSong();

}