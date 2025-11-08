function updateAlpha(value) {
    value *= 0.01;
    $("#alpha").html(value.toFixed(2));
    alpha = value;
}

function updateCoeff(value) {
    value *= 0.01;
    $("#coeff").html(value.toFixed(2));
    coeff = value;
}

// Run WebGL
$(function() { webGLStart(); });