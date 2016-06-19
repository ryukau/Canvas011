var cv = new Canvas(512, 512)
cv.Element.addEventListener("click", onClickCanvas, false)

const CENTER = cv.Center

var point = []
var property = {
    add: { x: 0, y: 0 },
    sub: { x: 0, y: 0 },
    dot: 0,
    cross: 0,
}

init()

function init() {
    createPoint()
    updateCanvas()
}

function updateCanvas() {
    cv.clear("#ffffff")
    drawCross()

    cv.Context.save()
    cv.Context.translate(CENTER.x, CENTER.y)
    drawProperty()
    drawPoint()
    cv.Context.restore()
}

function createPoint() {
    point.length = 0
    for (var i = 0; i < 2; ++i) {
        point.push({
            x: 0.5 * (Math.random() - 0.5) * cv.Width,
            y: 0.5 * (Math.random() - 0.5) * cv.Height
        })
    }

    calcProperty()
}

function calcProperty() {
    property.add = {
        x: point[0].x + point[1].x,
        y: point[0].y + point[1].y
    }
    property.sub = {
        x: point[1].x - point[0].x,
        y: point[1].y - point[0].y
    }
    property.dot = point[0].x * point[1].x + point[0].y * point[1].y
    property.cross = point[0].x * point[1].y - point[0].y * point[1].x
}

function drawPoint() {
    var i, text

    cv.Context.strokeStyle = "#888888"
    cv.Context.lineWidth = 2
    for (i = 0; i < point.length; ++i) {
        cv.drawLine({ x: 0, y: 0 }, point[i])
    }

    cv.Context.fillStyle = "#337777"
    cv.Context.font = "14px serif"
    for (i = 0; i < point.length; ++i) {
        cv.drawPoint(point[i], 3)
        text = i + "(" + point[i].x.toFixed(1) + "," + point[i].y.toFixed(1) + ")"
        cv.Context.fillText(text, point[i].x, point[i].y)
    }
}

function drawProperty() {
    cv.Context.fillStyle = "#ff8888"
    cv.Context.strokeStyle = "#ff8888"
    cv.Context.lineWidth = 2
    cv.drawLine({ x: 0, y: 0 }, property.add)
    cv.drawPoint(property.add, 3)

    cv.Context.fillStyle = "#8888ff"
    cv.Context.strokeStyle = "#8888ff"
    cv.Context.lineWidth = 2
    cv.drawLine({ x: 0, y: 0 }, property.sub)
    cv.drawPoint(property.sub, 3)

    cv.Context.fillStyle = "#337777"
    cv.Context.font = "14px serif"
    cv.Context.fillText("dot: " + property.dot.toFixed(1), -CENTER.x, 14 - CENTER.y)
    cv.Context.fillText("cross: " + property.cross.toFixed(1), -CENTER.x, 28 - CENTER.y)
    cv.Context.fillText("direction: " + (property.cross < 0 ? "left" : "right"), -CENTER.x, 42 - CENTER.y)
}

function drawCross() {
    cv.Context.strokeStyle = "#cccccc"
    cv.Context.lineWidth = 1
    cv.drawLine({ x: 0, y: CENTER.y }, { x: 512, y: CENTER.y })
    cv.drawLine({ x: CENTER.x, y: 0 }, { x: CENTER.x, y: cv.Height })
}

function onClickCanvas(event) {
    var rect = event.target.getBoundingClientRect()
    var x = event.clientX - rect.left
    var y = event.clientY - rect.top

    init()
}