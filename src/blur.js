import {floor, max, min} from "./math.js";

function blurTransfer(V, r, n, vertical) {
  if (!r) return; // radius 0 is a noop

  const [source, target] = V,
    m = floor(source.length / n),
    w = (r << 1) + 1,
    w2 = (r << 2) + 1,
    ki = vertical ? m : 1,
    kj = vertical ? 1 : n,
    W = w * ki,
    R = r * ki,
    R2 = R * 2,
    blocks = 1 / (r * r * w);

  for (let j = 0; j < m; ++j) {
    const k0 = kj * j,
      kn = k0 + ki * (n - 1);
    let k, kd;
    for (
      let i = 0,
        sr0,
        sr1 = w * source[k0],
        sr2 = w2 * source[k0],
        dr = 0,
        dr2 = source[k0];
      i < n + 2 * r;
      ++i
    ) {
      // I believe this is equivalent to the stackblur approach:
      // sr0: central value at x
      // sr1: running sum on the interval [x - r, x + r]
      // sr2: running sum on the interval [x - 2r, x + 2r]
      // dr: integral of sr2 - 2 sr1 + sr0
      // dr2: integral of dr
      k = ki * i + kj * j;
      sr0 = source[(kd = max(k - R2, k0))];
      sr1 += source[min(max(k - R, k0), kn)] - source[max(k - R - W, k0)];
      sr2 += source[min(k, kn)] - source[max(k - W - R2, k0)];
      target[kd] = dr2;
      dr += (sr2 - 2 * sr1 + sr0) * blocks;
      dr2 += dr;
    }
  }
  V.reverse(); // target becomes V[0] and will be used as source in the next iteration
}

export default function blur() {
  var rx = 7,
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

    blurTransfer(V, rx, n, false);
    blurTransfer(V, ry, m, true);
    V[0].width = n;
    V[0].height = m;
    return V[0];
  }

  blur.radius = _ =>  _ === undefined
    ? (rx + ry) / 2
    : (rx = ry = Math.round(_), blur);
  blur.radiusX = _ =>  _ === undefined
    ? rx
    : (rx = Math.round(_), blur);
  blur.radiusY = _ =>  _ === undefined
    ? ry
    : (ry = Math.round(_), blur);
  blur.width = _ =>
    _ === undefined ? width : (width = Math.round(+_), blur);
  blur.value = _ =>
    typeof _ === "function" ? (value = _, blur) : value;

  return blur;
}
