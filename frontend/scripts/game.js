import Color from "https://colorjs.io/dist/color.js";

async function playGameSong() {
    const song = "Umbrella.mp3";
    await playPreloadedSong(song);
}

export function initGame() { // essentially onload for join
    playGameSong();

    const shakeBar = document.querySelector(".shakeBar");
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
    let sensitivity = 1;

    let gameOver = false;

    if (window.DeviceOrientationEvent) {
    addEventListener(
        "deviceorientation",
        function (event) {
            if (!gameOver && Date.now() - pageLoadTime > initialWait) {

            // Vertical up has a beta of 90
            // upIcon.style.transform.rotate
            // setPercentage(Math.abs(90 - event.beta));
            // root.style.setProperty("--upIconRotation", 0*(event.beta-90) + "deg");

            let q = Quaternion.fromEuler(
                event.alpha * toRad,
                event.beta * toRad,
                event.gamma * toRad,
                "ZXY"
            );
            let qFinal = q.inverse();

            upIcon.style.transform =
                "scaleX(-1) matrix3d(" +
                qFinal.conjugate().toMatrix4() +
                ") rotateX(90deg) scaleX(-1)";
            // upIcon.style.transform = "rotate(" + qUp.dot(q) + "deg)";

            let v = q.toVector();
            let gyroScore = Math.abs(vDot(v, [0.7, 0.7, 0]));

            if(gyroScore < 0.9)
            {
                //Lose game
                gameOver = true;
                debug.textContent = "GAME OVER GYRO\n" + debug.textContent;
            }

            debug.innerHTML = v[0].toFixed(1) + ", " + v[1].toFixed(1) + ", " + v[2].toFixed(1) + "<br />" + gyroScore.toFixed(3);
            // debug.innerHTML = event.alpha.toFixed(1) + "<br />" + event.beta.toFixed(1) + "<br />" + event.gamma.toFixed(1);
        }
        },
        true
    );
    }

    if (window.DeviceMotionEvent) {
    addEventListener(
        "devicemotion",
        function () {
        if (!gameOver && Date.now() - pageLoadTime > initialWait) {
            let mag = norm(
            event.acceleration.x,
            event.acceleration.y,
            event.acceleration.z
            );
            let sig = 100.0 * Math.abs(kfMotion.filter(mag)) * sensitivity;

            debug.textContent = sig.toFixed(4);
            setPercentage(clamp(sig, 0.0, 100.0));

            if (sig > 100.0) {
            //Lose game
                gameOver = true;
                setPercentage(100);
                debug.textContent = "GAME OVER " + debug.textContent;
                socket.emit("playerLost");
            }
            // if(sig < min) { min = sig; debug.textContent = min; }
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
    root.style.setProperty(
        "--shakeAmount",
        (percentage * percentage) / 200.0 + "px"
    );
    document.body.style.backgroundColor = barGradient(
        percentage / 100.0
    ).toString();
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
        return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
    }

    screen.orientation //TODO: DOUBLE CHECK THIS <<--
    .lock()
    .then(function () {
        screen.lockOrientation("default");
    })
    .catch(function (e) {});

    function getRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
    }
}