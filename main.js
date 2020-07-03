let globalDX = document.getElementById('dx').value;
let roots = [];
class Grafics1d {
  constructor(xmin = -5, xmax = 5, W = 120, H = 100) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = 0;
    this.ymax = 0;
    this.W = W;
    this.H = H;
    this.f = function f(x) {
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
    this.ymax = fmax;
    this.ymin = fmin;
  }
  draw(fun = 'red', coordLines = 'green', nulls = 'indigo',
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

    // Text
    ctx.fillStyle = 'white';
    ctx.font = "20px bold";
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
    ctx.fillText(s1, 0, this.H - 10);
    ctx.fillText(s2, this.W - Numbers * 9 - 120, 20);
    let changedScaleInX = 'X-Axis scale - ' + ((T1 < 1) ? 1 : T1).toString() + ':' + ((T1 < 1) ? 1/T1 : 1).toString(),
      changedScaleInY = 'Y-Axis scale - ' + ((T2 < 1) ? 1 : T2).toString() + ':' + ((T2 < 1) ? 1/T2 : 1).toString();
    ctx.fillText(changedScaleInX, 5, 20);
    ctx.fillText(changedScaleInY, 5, 50);

    // Roots
    ctx.beginPath();
    ctx.fillStyle = '#f9f700';
    if(roots.length != 0) {
      for(let extremum = 0; extremum < roots.length; extremum++) {
        let x = roots[extremum][0];
        let y = roots[extremum][1];
        X = (x-this.xmin)*S1;
        Y = (y-this.ymin)*S2+this.H;
        ctx.arc(X, Y, 4, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.closePath();
    }
  }

  findPoints() {
    let intervals = [];
    let i = 0;
    let m1 = this.xmin;
    let m2 = m1;
    let dx = (this.xmax - this.xmin) / this.W;
    let f = this.Float64Array[0] > this.Float64Array[1];
    for(let x = this.xmin + dx; x < this.xmax; x += dx) {
      i++;
      if(f) if(this.Float64Array[i-1] < this.Float64Array[i]) {
        m2 = x;
        intervals.push([m1, m2]);
        m1 = m2;
        f = false;
      }
      if(!f) if(this.Float64Array[i-1] > this.Float64Array[i]) {
        m2 = x;
        intervals.push([m1, m2]);
        m1 = m2;
        f = true;
      }
    }
    if(intervals.length == 0) intervals.push([m1, this.xmax]);
    return intervals;
  }

  TernarySearch(interval) {
    this.xmin = interval[0];
    this.xmax = interval[1];
    let extremum = [this.xmin, this.Float64Array[0]];
    let f = extremum[1] < this.Float64Array[1];
    let dx = (this.xmax - this.xmin) / this.W;
    let i = 1;
    for(let x = this.xmin + dx; x <= this.xmax; x += dx) {
      if(f) {
        if(extremum[1] < this.Float64Array[i]) {
          extremum[1] = this.Float64Array[i];
          extremum[0] = x;
        }
        else break;
      }
      else {
        if(extremum[1] > this.Float64Array[i]) {
          extremum[1] = this.Float64Array[i];
          extremum[0] = x;
        }
        else break;
      }
      i++;
    }
    if(extremum > globalDX) {
      return this.TernarySearch(interval);
    }
    else {
      return extremum;
    }
  }

  drawAll() {
    this.evaluate();
    this.autodraw();
    this.draw();
  }

  search() {
    let intervals = this.findPoints();
    console.log(intervals);
    let k = intervals.length;
    for(let interval = 0; interval < k; interval++) {
      roots.push(this.TernarySearch(intervals[interval]));
    }
    console.log(roots);
  }
}
function printPicture () {
  grafic = new Grafics1d(Number(document.getElementById('xmin').value), Number(document.getElementById('xmax').value),
    Number(document.getElementById('width').value), Number(document.getElementById('height').value));
  grafic.drawAll();
  grafic.search();
}
