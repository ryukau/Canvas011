// Converts from degrees to radians.
function clamp(val, min, max) {
    return isNaN(val) ? 0 : Math.max(min, Math.min(val, max));
}

function radians(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function degrees(radians) {
    return radians * 180 / Math.PI;
};

function angle2D(origin, _a, _b) {
    var a = { x: _a.x - origin.x, y: _a.y - origin.y };
    var b = { x: _b.x - origin.x, y: _b.y - origin.y };
    return Math.acos((a.x * b.x + a.y * b.y) / (Math.sqrt(a.x * a.x + a.y * a.y) * Math.sqrt(b.x * b.x + b.y * b.y)));
}

function distance2D(a, b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return Math.sqrt(x * x + y * y);
}

// canvas設定 //
const TWO_PI = 2 * Math.PI;
const MAX_VELOCITY = 6;
const G = 7;
const SCALE = 1e4;

var canvas = new Canvas(512, 512);
canvas.Element.addEventListener("click", onClickCanvas, false);

var point = [];
var sun = {
    x: 32 * Math.cos(Math.PI / 4) + canvas.Width / 2,
    y: 32 * Math.sin(Math.PI / 4) + canvas.Height / 2,
    vx: 0,
    vy: 0,
    mass: 1e10
}

init();

function init() {
    for (var i = 0; i < 4; ++i) {
        createPoint();
    }
    console.log(point);
    clearCanvas();
    animate();
}

function animate() {
    updateCanvas();
    requestAnimationFrame(animate);
}

function updateCanvas() {
    canvas.clear("#ffffff");

    //canvas.Context.save();
    //canvas.Context.translate(canvas.Width / 2, canvas.Height / 2);
    //canvas.Context.scale(0.3, 0.3);
    drawSun();
    drawPoints();
    //canvas.Context.restore();
    movePoints();
}

function createPoint() {
    var index, g, r, v, max = 512;

    point.push({
        x: Math.random() * canvas.Width,
        y: Math.random() * canvas.Height,
        vx: 0,//Math.random() * 2 - 1,
        vy: 0,//Math.random() * 2 - 1,
        mass: Math.random() * 100
    });

    index = point.length - 1;
    r = distance2D(sun, point[index]);
    //g = G * sun.mass * point[index].mass / (r * r);
    v = 6;//Math.sqrt(g * r / point[index].mass);
    console.log(v);
    point[index].vx = - v * (point[index].x - sun.x) / r;
    point[index].vy = v * (point[index].y - sun.y) / r;

    //point[0] = {
    //    x: 100,
    //    y: 100
    //};
    //point[1] = {
    //    x: 200,
    //    y: 100
    //};
    //point[2] = {
    //    x: 300,
    //    y: 100
    //};
}

function movePoints() {
    sun.x = 64 * Math.cos(Date.now() * 0.0003 * Math.PI / 4) + canvas.Width / 2;
    sun.y = 64 * Math.sin(Date.now() * 0.0003 * Math.PI / 4) + canvas.Height / 2;

    for (var i = 0; i < point.length; ++i) {
        point[i];
        point[i].x = (point[i].x + point[i].vx);
        point[i].y = (point[i].y + point[i].vy);
    }

    for (var i = 0; i < point.length; ++i) {
        //applyGravity(point[i], sun);
        applyGravity2(point[i], sun);
        for (var j = i + 1; j < point.length; ++j) {
            //applyGravity(point[i], point[j]);
            applyGravity2(point[i], point[j]);
        }
    }
}

function applyGravity2(a, b) {
    // つかず離れず

    var dd = 32;
    var x = a.x - b.x,
        y = a.y - b.y,
        d_xd,
        d_yd,
        distance,
        gravity;

    distance = Math.max(SCALE * Math.sqrt(x * x + y * y), 1e-10);
    gravity = 0.01 * ((distance - dd) / dd);
    d_xd = gravity * x / distance;
    d_yd = gravity * y / distance;

    a.vx = clamp(a.vx - d_xd, -MAX_VELOCITY, MAX_VELOCITY);
    b.vx = clamp(b.vx + d_xd, -MAX_VELOCITY, MAX_VELOCITY);
    a.vy = clamp(a.vy - d_yd, -MAX_VELOCITY, MAX_VELOCITY);
    b.vy = clamp(b.vy + d_yd, -MAX_VELOCITY, MAX_VELOCITY);
}

function applyGravity(a, b) {
    var x = a.x - b.x,
        y = a.y - b.y,
        d_xd,
        d_yd,
        distance,
        gravity;

    distance = Math.max(Math.sqrt(x * x + y * y), 1e-10);
    gravity = G * a.mass * b.mass / (distance * distance * distance);
    d_xd = gravity * x;
    d_yd = gravity * y;

    a.vx = clamp(a.vx - d_xd, -MAX_VELOCITY, MAX_VELOCITY);
    b.vx = clamp(b.vx + d_xd, -MAX_VELOCITY, MAX_VELOCITY);
    a.vy = clamp(a.vy - d_yd, -MAX_VELOCITY, MAX_VELOCITY);
    b.vy = clamp(b.vy + d_yd, -MAX_VELOCITY, MAX_VELOCITY);
}

function drawSun() {
    canvas.Context.fillStyle = "#0000ff";
    canvas.Context.beginPath();
    canvas.Context.arc(sun.x, sun.y, Math.log(1 + sun.mass), 0, TWO_PI, true);
    canvas.Context.fill();
}

function drawPoints() {
    canvas.Context.strokeStyle = "#aaccff";
    canvas.Context.lineWidth = 2;
    for (var i = 0; i < point.length - 2; ++i) {
        var circle = circumcircle(point[i], point[i + 1], point[i + 2]);
        canvas.Context.beginPath();
        canvas.Context.arc(circle.x, circle.y, circle.r, 0, TWO_PI, true);
        canvas.Context.stroke();
    }

    // 点を描画。
    canvas.Context.fillStyle = "#ff0000";
    for (var i = 0; i < point.length; ++i) {
        canvas.Context.beginPath();
        canvas.Context.arc(point[i].x, point[i].y, Math.log(1 + point[i].mass), 0, TWO_PI, true);
        canvas.Context.fill();
    }

    // 番号テキストを描画。
    canvas.Context.fillStyle = "#000000";
    for (var i = 0; i < point.length; ++i) {
        canvas.Context.fillText(i, point[i].x, point[i].y);
    }
}

// A circumcircle algorithm.
// Javascript implementation by mutoo (https://gist.github.com/mutoo/5617691).
function circumcircle(a, b, c) {
    var A = b.x - a.x,
        B = b.y - a.y,
        C = c.x - a.x,
        D = c.y - a.y,
        E = A * (a.x + b.x) + B * (a.y + b.y),
        F = C * (a.x + c.x) + D * (a.y + c.y),
        G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
        minx, miny, dx, dy

    /* If the points of the triangle are collinear, then just find the
    * extremes and use the midpoint as the center of the circumcircle. */
    if (Math.abs(G) < 0.000001) {
        minx = Math.min(a.x, b.x, c.x)
        miny = Math.min(a.y, b.y, c.y)
        dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5
        dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5

        return {
            x: minx + dx,
            y: miny + dy,
            r: Math.sqrt(dx * dx + dy * dy)
        }
    }

    else {
        var x = (D * E - B * F) / G
        var y = (A * F - C * E) / G
        dx = x - a.x
        dy = y - a.y

        return {
            x: x,
            y: y,
            r: Math.sqrt(dx * dx + dy * dy)
        }
    }
}

function clearCanvas() {
    updateCanvas();
}

// UI //

function onClickCanvas(event) {
    createPoint();
    updateCanvas();
}

function onDoubleClickCanvas(event) {
    var rect = event.target.getBoundingClientRect();
    origin.x = event.clientX - rect.left;
    origin.y = event.clientY - rect.top;
    clearCanvas();
}
