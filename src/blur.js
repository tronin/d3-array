function blurTransfer(V, r, n, vertical) {
  const [source, target] = V,
    m = Math.floor(source.length / n),
    w = (r << 1) + 1,
    ki = vertical ? m : 1,
    kj = vertical ? 1 : n,
    W = w * ki,
    R = r * ki;
  for (let j = 0; j < m; ++j) {
    for (let i = 0, sr = 0, q = 0; i < n + r; ++i) {
      const k = ki * i + kj * j;
      if (i < n) {
        sr += source[k];
        q++;
      }
      if (i >= r) {
        if (i >= w) {
          sr -= source[k - W];
          q--;
        }
        target[k - R] = sr / q;
      }
    }
  }
  V.reverse();
}

export default function blur() {
  var radius = 5,
    iterations = 3,
    accessor,
    width,
    direction;

  function blur(data) {
    const n = width || data.length,
      m = Math.round(data.length / n),
      V = [
        accessor
          ? Float32Array.from(data, accessor)
          : Float32Array.from(data),
        new Float32Array(data.length)
      ];

    for (var i = 0; i < iterations; i++) {
      if (direction !== "y" && n > 1) {
        blurTransfer(V, radius, n, false);
      }
      if (direction !== "x" && m > 1) {
        blurTransfer(V, radius, m, true);
      }
    }
    V[0].width = n;
    V[0].height = m;
    return V[0];
  }

  blur.radius = _ =>
    _ === undefined ? radius : ((radius = Math.round(+_)), blur);
  blur.width = _ =>
    _ === undefined ? width : ((width = Math.round(+_)), blur);
  blur.iterations = _ =>
    _ === undefined ? iterations : ((iterations = +_), blur);
  blur.direction = _ =>
    _ === undefined ? direction : ((direction = _), blur);
  blur.value = _ =>
    typeof _ === "function" ? ((accessor = _), blur) : accessor;

  return blur;
}
