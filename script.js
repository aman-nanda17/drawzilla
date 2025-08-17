const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let paths = [], redoStack = [];
let drawing = false;
let currentTool = 'pencil';
let currentColour = '#000000';
let brushSize = 5;

function setupCanvas() {
    // adjust the canvas size
    const rect = canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;

    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
    console.log(dpi);
    console.log(rect);
    console.log(canvas.width);
    console.log(canvas.height);
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('pencilButton').addEventListener('click', () => setActiveTool('pencil'));
    document.getElementById('eraserButton').addEventListener('click', () => setActiveTool('eraser'));
    document.getElementById('undoButton').addEventListener('click', () => undoLastAction());
    document.getElementById('redoButton').addEventListener('click', () => redoLastAction());
    document.getElementById('clearButton').addEventListener('click', () => clearCanvas());
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        currentColour = e.target.value;
        setActiveTool('pencil');
    });
    document.getElementById('brushSize').addEventListener('input', (e) => {
        brushSize = e.target.value;
    })

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing); // releasing the mouse, stop drawing
    canvas.addEventListener('mousemove', draw);

    setActiveTool('pencil');

});

function draw(e) {
    if(!drawing) return;

    // get mouse position
    const mousePos = getMousePos(e);

    paths[paths.length-1].points.push(mousePos);
    // add that mouse position to the existing path in the paths array

    redrawCanvas();
}

function undoLastAction() {
    // check if there are any drawing sections stored in the paths array
    if(paths.length > 0) {
        //pop the last drawing action from the paths array and push it to the redostack
        redoStack.push(paths.pop());
        redrawCanvas();
    }
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    paths.forEach(drawPath);
}

function drawPath(path) {
    ctx.beginPath();

    ctx.moveTo(path.points[0].x, path.points[0].y);

    for(let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);

        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;

        ctx.stroke();
    }
}

function startDrawing(e) {
    drawing = true;
    const mousePos = getMousePos(e);

    // paths => array of object

    paths.push({
        color: currentTool === 'eraser' ? 'white' : currentColour,
        points: [mousePos],
        width: brushSize
    });

    redoStack = [];
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (canvas.width / rect.width);
    const y = (evt.clientY - rect.top) * (canvas.height / rect.height);

    return {x,y};
}

function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.toolItem').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}Button`).classList.add('active');
}

function stopDrawing() {
    drawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths = [];
    redoStack = [];
}

function redoLastAction() {
    if(redoStack.length > 0) {
        paths.push(redoStack.pop());
        redrawCanvas();
    }
}

setupCanvas();

