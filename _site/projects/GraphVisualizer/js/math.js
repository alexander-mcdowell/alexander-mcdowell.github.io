function normalize(u) {
    let v = [];
    let n = norm(u);
    for (let i = 0; i < u.length; i++) v.push(u[i]/n);
    return v;
}

function norm(u) { return Math.sqrt(dot(u,u)); }

function dot(u, v) {
    let x = 0;
    for (let i = 0; i < u.length; i++) x += u[i]*v[i];
    return x;
}

// Rotate point p=(x, y) counter-clockwise about the origin by theta
function rotate(p, theta) {
    let c = Math.cos(theta); let s = Math.sin(theta);
    return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
}

// Translate point p=(x, y) by d=(dx, dy)
function translate(p, d) { return [p[0] + d[0], p[1] + d[1]]; }