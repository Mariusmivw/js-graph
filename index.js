let canvas;
let cSize = 700;
let gSize = 20000;

let scaleFunction = () => {
  return cSize / gSize;
};

let xOffset = -gSize / 2;
let yOffset = -gSize / 2;
let lineGap = 1000;

let initScale = scaleFunction();

let xDistFunction = () => {
  return (0.05 * initScale) / scaleFunction();
};

function setup() {
  canvas = createCanvas(700, 700).canvas;
}

function mouseWheel(e) {
  if (
    e.pageX > canvas.offsetLeft &&
    e.pageX < canvas.offsetLeft + canvas.width &&
    e.pageY > canvas.offsetTop &&
    e.pageY < canvas.offsetTop + canvas.height
  ) {
    // before zoom
    let mY = (cSize - e.offsetY) / scaleFunction();
    let mX = e.offsetX / scaleFunction();

    // zoom
    let zoomAmount = e.delta / 30;
    gSize += zoomAmount;

    // after zoom
    xOffset -= e.offsetX / scaleFunction() - mX;
    yOffset -= (cSize - e.offsetY) / scaleFunction() - mY;
  }
}

function mouseDragged(e) {
  xOffset -= (e.movementX / cSize) * gSize;
  yOffset += (e.movementY / cSize) * gSize;
}

// vars for functions
const rho = 1.293; // gemiddeld in Nederland
const Cw = 1.2; // gemiddeld bij de mens
const A = 1.7 / 2; // gemiddeld oppervlakte huid van mens / 2




// functions

let functions = {
  Fwl: function(v) {
    return 0.5 * rho * Cw * A * Math.pow(v + 70, 2);
  }
};




function draw() {
  if (frameCount % 1 == 0) {
    background(255);
    let scale = scaleFunction();
    let xDist = xDistFunction();

    let graphs = [];

    let xMaxI = ceil((gSize + xOffset) / lineGap);
    for (let i = ceil(xOffset / lineGap); i < xMaxI; i++) {
      let x = scale * (lineGap * i - xOffset);

      if (i == 0) {
        push();
        stroke(255, 0, 0);
        strokeWeight(2.5);
      }

      line(x, 0, x, height);

      if (i == 0) {
        pop();
      }
    }

    let yMaxI = ceil((gSize + yOffset) / lineGap);
    for (let i = ceil(yOffset / lineGap); i < yMaxI; i++) {
      let y = scale * (lineGap * i - yOffset);

      if (i == 0) {
        push();
        stroke(255, 0, 0);
        strokeWeight(2.5);
      }

      line(0, height - y, width, height - y);

      if (i == 0) {
        pop();
      }
    }

    let f = functions;
    for (let fn in f) {
      let points = [];
      for (let i = xOffset; i <= gSize + xOffset + xDist; i += xDist) {
        points.push([
          (i - xOffset) * scale,
          (-f[fn](i) + gSize + yOffset) * scale
        ]);
      }
      graphs.push(points);
    }

    push();
    strokeWeight(1.5);
    colorMode(HSB);
    let hue = 0;

    for (let points of graphs) {
      hue += 360 / (graphs.length + 1);
      stroke(hue, 100, 100);
      for (let i = 0; i < points.length - 1; i++) {
        line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
      }
    }
    pop();
  }
}
