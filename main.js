let roots = [];
let time;
class Grafics1d {
  constructor(xmin = -5, xmax = 5, W = 120, H = 100) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = 0;
    this.ymax = 0;
    this.W = W;
    this.H = H;
    this.f = function f(x) {
      function sin(x) {
        return Math.sin(x);
      }
      function cos(x) {
        return Math.cos(x);
      }
      function abs(x) {
        return Math.abs(x);
      }
      function asin(x) {
        return Math.asin(x);
      }
      function acos(x) {
        return Math.acos(x);
      }
      function atan(x) {
        return Math.atan(x);
      }
      function ceil(x) {
        return Math.ceil(x);
      }
      function exp(x) {
        return Math.exp(x);
      }
      function floor(x) {
        return Math.floor(x);
      }
      function log(x) {
        return Math.log(x);
      }
      function round(x) {
        return Math.round(x);
      }
      function sqrt(x) {
        return Math.sqrt(x);
      }
      function tan(x) {
        return Math.tan(x);
      }
      function tanh(x) {
        return Math.tanh(x);
      }
      let b = Number(document.getElementById('b').value);
      return eval(document.getElementById('function').value);
    };
    this.Float64Array = new Float64Array(this.W);
  }
  evaluate() {
    let j = 0;
    let dx = (this.xmax - this.xmin) / this.W;
    for(let i = this.xmin; i <= this.xmax; i += dx) {
      this.Float64Array[j] = this.f(i);
      j++;
    }
  }
  autodraw() {
    let fmax = this.Float64Array[0];
    let fmin = this.Float64Array[0];
    for(let i = 1; i < this.Float64Array.length; i++) {
      fmax = Math.max(fmax, this.Float64Array[i]);
      fmin = Math.min(fmin, this.Float64Array[i]);
    }
    this.ymax = fmax + 1;
    this.ymin = fmin - 1;
  }
  draw(intervals = [], fun = 'red', coordLines = 'green', nulls = 'indigo',
       breaks = 'magenta', background = 'grey') {
    let dx = (this.xmax - this.xmin) / this.W;
    let dy = (this.ymax - this.ymin) / this.H;
    let S1 = this.W / (this.xmax - this.xmin);
    let S2 = this.H / (this.ymin - this.ymax);

    const canvas = document.getElementById('canvas');
    canvas.height = this.H;
    canvas.width = this.W;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, this.W, this.H);

    // Grades
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    let Y = (this.ymax - this.ymin)*S2+this.H;
    let Sx = S1;
    let T1 = 1;
    if(Sx < 15) {
      while(Sx < 15) {
        Sx *= 2;
        T1 *= 2;
      }
    }
    else if(Sx > 80) {
      while(Sx > 80) {
        Sx /= 2;
        T1 /= 2;
      }
    }
    for(let x = (0-this.xmin)*S1; x <= this.W; x += Sx) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, Y+this.H);
    }
    for(let x = (0-this.xmin)*S1; x >= 0; x -= Sx) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, Y+this.H);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 0.5;
    let X = (this.xmax - this.xmin)*S1;
    let Sy = -S2;
    let T2 = 1;
    if(Sy < 15) {
      while(Sy < 15) {
        Sy *= 2;
        T2 *= 2;
      }
    }
    else if(Sy > 80) {
      while(Sy > 80) {
        Sy /= 2;
        T2 /= 2;
      }
    }
    for(let y = (0-this.ymin)*S2+this.H; y <= this.H; y += Sy) {
      ctx.moveTo(0, y);
      ctx.lineTo(X, y);
    }
    for(let y = (0-this.ymin)*S2+this.H; y >= 0; y -= Sy) {
      ctx.moveTo(0, y);
      ctx.lineTo(X, y);
    }
    ctx.stroke();
    ctx.closePath();

    // Axes
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    X = (0 - this.xmin)*S1;
    Y = this.H;
    ctx.moveTo(X, Y);
    for(let y = this.ymin; y <= this.ymax; y += dy) {
      Y = (y-this.ymin)*S2+this.H;
      ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = coordLines;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1.5;
    X = 0;
    Y = (0-this.ymin)*S2+this.H;
    ctx.moveTo(X, Y);
    for(let x = this.xmin; x <= this.xmax; x += dx) {
      X = (x-this.xmin)*S1;
      ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = coordLines;
    ctx.stroke();
    ctx.closePath();

    // Function
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = fun;
    ctx.moveTo(0, (this.Float64Array[0]-this.ymin) * S2 + this.H);
    let i = 1;
    for(let x = this.xmin + dx; x <= this.xmax; x += dx) {
      ctx.lineTo((x - this.xmin) * S1, (this.Float64Array[i] - this.ymin) * S2 + this.H);
      i++;
    }
    ctx.stroke();
    ctx.closePath();

    // Nulls
    i = 0;
    for(let x = this.xmin; x < this.xmax; x += dx) {
      X = (x-this.xmin)*S1;
      Y = (this.Float64Array[i]-this.ymin)*S2+this.H;
      if(this.Float64Array[i] * this.Float64Array[i+1] < 0 &&
        Math.abs(this.Float64Array[i] * this.Float64Array[i+1]) < Math.abs(this.ymax / 2)) {
        ctx.beginPath();
        let Y2 = (0-this.ymin)*S2+this.H;
        ctx.arc(X, Y2, 2, 0, 2 * Math.PI);
        ctx.fillStyle = nulls;
        ctx.fill();
        ctx.closePath();
      }
      i++;
    }

    // Breaks
    i = 0;
    for(let x = this.xmin; x < this.xmax; x += dx) {
      X = (x-this.xmin)*S1;
      if((this.Float64Array[i] > this.ymax / 16 && this.Float64Array[i + 1] < this.ymin / 16) ||
        (this.Float64Array[i] < this.ymin / 16 && this.Float64Array[i + 1] > this.ymax / 16)) {
        ctx.beginPath();
        X = (x-this.xmin)*S1;
        Y = (0-this.ymin)*S2+this.H;
        ctx.arc(X, Y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = breaks;
        ctx.fill();
        ctx.closePath();
      }
      i++;
    }

    // Text
    ctx.fillStyle = 'white';
    ctx.font = "10px bold";
    let xmax1 = this.xmax;
    let ymax1 = this.ymax;
    let xmaxNumber = 0;
    let ymaxNumber = 0;
    while(xmax1 >= 1) {
      xmax1 /= 10;
      xmaxNumber++;
    }
    while(ymax1 >= 1) {
      ymax1 /= 10;
      ymaxNumber++;
    }
    let Numbers = xmaxNumber + ymaxNumber;
    let s1 ='(' + this.xmin.toFixed(3) + ', ' + this.ymin.toFixed(3) + ')',
      s2 = '(' + this.xmax.toFixed(3) + ', ' + this.ymax.toFixed(3) + ')';
    ctx.fillText(s1, 5, this.H - 5);
    ctx.fillText(s2, this.W - Numbers * 5 - 60, 10);
    let changedScaleInX = 'X-Axis scale - ' + ((T1 < 1) ? 1 : T1).toString() + ':' + ((T1 < 1) ? 1/T1 : 1).toString(),
      changedScaleInY = 'Y-Axis scale - ' + ((T2 < 1) ? 1 : T2).toString() + ':' + ((T2 < 1) ? 1/T2 : 1).toString();
    ctx.fillText(changedScaleInX, 0, 10);
    ctx.fillText(changedScaleInY, 0, 20);
  }

  takeIntervals() {
    let inIntervals = [];
    let increasing = (this.Float64Array[0] < this.Float64Array[1]);
    let i = 1;
    let dx = (this.xmax - this.xmin)/this.W;
    let left = this.xmin;
    for(let x = this.xmin; x <= this.xmax; x += dx) {
      if(increasing && this.Float64Array[i - 1] > this.Float64Array[i]) {
        let right = x;
        inIntervals.push([left, right, increasing]);
        increasing = false;
        left = right;
      }
      else if(!increasing && this.Float64Array[i - 1] < this.Float64Array[i]) {
        let right = x;
        inIntervals.push([left, right, increasing]);
        increasing = true;
        left = right;
      }
      i++;
    }
    console.log(inIntervals);
    return inIntervals;
  }

  TernarySearch(intervals) {
    time = Number(document.getElementById('time').value) * 1000;
    let iterationNumbers = [];
    let globalDX = document.getElementById('dx').value;
    for(let i = 0; i < intervals.length; i++) {
      let iteration = 1;
      while(intervals[i][1]-intervals[i][0] >= globalDX) {
        let m1 = intervals[i][0] + (intervals[i][1] - intervals[i][0])/3;
        let m2 = intervals[i][1] - (intervals[i][1] - intervals[i][0])/3;
        if(intervals[i][2]) {
          if(this.f(m1) < this.f(m2)) intervals[i][0] = m1;
          else intervals[i][1] = m2;
        }
        else {
          if(this.f(m1) > this.f(m2)) intervals[i][0] = m1;
          else intervals[i][1] = m2;
        }
        iteration++;
      }
      roots.push([(intervals[i][1]+intervals[i][0])/2, this.f((intervals[i][1]+intervals[i][0])/2)]);
      iterationNumbers.push(iteration);
    }
    console.log(roots);
    let j = 0;
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f9f700';
    let S1 = graph.W / (graph.xmax - graph.xmin);
    let S2 = graph.H / (graph.ymin - graph.ymax);
    let timerID = setInterval(function () {
      let s = 'x=' + roots[j][0] + ', y=' + roots[j][1] + ', iterations: ' + iterationNumbers[j] + ';\n';
      document.getElementById('Textarea').value += s;
      let x = Number(roots[j][0]);
      let y = Number(roots[j][1]);
      let X1 = (x - graph.xmin)*S1;
      let Y1 = (y - graph.ymin)*S2+graph.H;
      ctx.beginPath();
      ctx.arc(X1, Y1, 3, 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
      j++;
      if(j >= roots.length) clearInterval(timerID);
    }, time);
  }
}

let graph;
function printPicture () {
  document.getElementById('Textarea').value = '';
  roots = [];
  graph = new Grafics1d(Number(document.getElementById('xmin').value), Number(document.getElementById('xmax').value),
    Number(document.getElementById('width').value), Number(document.getElementById('height').value));
  graph.evaluate();
  graph.autodraw();
  graph.draw();
  let intervals = graph.takeIntervals();
  graph.TernarySearch(intervals);
}
