import {floor, max, min} from "./math.js";

function blurTransfer(V, r, n, vertical) {
  if (!r) return; // radius 0 is a noop

  const [source, target] = V,
    rc = Math.ceil(r),
    frac = (rc - r) / rc,
    frac_1 = r / rc,
    m = floor(source.length / n),
    w = 2 * rc + 1,
    w1 = 1 / w,
    ki = vertical ? m : 1,
    kj = vertical ? 1 : n,
    W = w * ki,
    R = rc * ki;

  for (let j = 0; j < m; ++j) {
    const k0 = kj * j,
      kn = k0 + ki * (n - 1);
    // faster loop for integer radius
    if (!frac) {
      for (let i = 0, sr = w * source[k0]; i < n + rc; ++i) {
        const k = ki * i + kj * j;
        sr += source[min(k, kn)] - source[max(k - W, k0)];
        target[max(k - R, k0)] = sr * w1;
      }
    } else {
      for (let i = 0, sr = w * source[k0]; i < n + rc; ++i) {
        const k = ki * i + kj * j,
          index = max(k - R, k0);
        sr += source[min(k, kn)] - source[max(k - W, k0)];
        target[index] = frac_1 * sr * w1 + frac * source[index];
      }
    }
  }
  V.reverse(); // target becomes V[0] and will be used as source in the next iteration
}

export default function blur() {
  const iterations = 3;
  let rx = 5,
    ry = rx,
    value,
    width;

  function blur(data) {
    const n = width || data.length,
      m = Math.round(data.length / n),
      V = [
        value ? Float32Array.from(data, value) : Float32Array.from(data),
        new Float32Array(data.length)
      ];

    for (let i = 0; i < iterations; i++) {
      blurTransfer(V, rx, n, false);
      blurTransfer(V, ry, m, true);
    }
    V[0].width = n;
    V[0].height = m;
    return V[0];
  }

  blur.radius = _ =>  _ === undefined
    ? (rx + ry) / 2
    : (rx = ry = +_, blur);
  blur.radiusX = _ =>  _ === undefined
    ? rx : (rx = +_, blur);
  blur.radiusY = _ =>  _ === undefined
    ? ry : (ry = +_, blur);
  blur.width = _ =>
    _ === undefined ? width : (width = Math.round(+_), blur);
  blur.value = _ =>
    typeof _ === "function" ? (value = _, blur) : value;

  return blur;
}
