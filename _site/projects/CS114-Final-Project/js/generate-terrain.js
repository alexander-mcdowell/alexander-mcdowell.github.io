// Vertex data
var vertexPositions, vertexNormals, vertexColors, vertexIndices;

var n = 250;
var S = 20;

// Fade function from 0 to 1 along 0 <= t <= 1
function fade(t) {
    // 6t^5 - 15t^4 + 10t^3, the original function used in Perlin's paper
    return t*t*t*(6*t*t-15*t+10);
}

// Fisher-Yates shuffle
function shuffle(arr) {
    var j, temp;
    for (var i = arr.length - 1; i >= 1; i--) {
        j = Math.floor((i + 1) * Math.random());
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

var permutations;
var gradList;
var perlin;
function perlinConfigure() {
    // Generate permutation table and gradients
    permutations = new Array(512);
    gradList = new Array(256);
    for (var index = 0; index < 256; index++) {
        gradList[index] = [Math.cos(index * 2.0 * Math.PI / 256), Math.sin(index * 2.0 * Math.PI / 256)]
        permutations[2 * index] = index;
        permutations[2 * index + 1] = index;
    }
    shuffle(permutations);
}

// Fractal noise built on top of perlin noise
function fractal(x, y) {
    var noise = 0.0;
    var k, persistence;
    var freq = 32.0;

    // Layer multiple sets of noise on top of each other in different frequencies.
    var X, Y;
    for (var octave = 0; octave < 5; octave++) {
        k = Math.pow(2, octave);
        x2 = k * x / freq; y2 = k * y / freq;
        persistence = 128/freq * k;
        
        X = Math.floor(x2); Y = Math.floor(y2);

        var gridX, fadeX, distX;
        var gridY, fadeY, distY;
        var hash, grad;
        var baseNoise = 0.0;
        for (var deltaX = 0; deltaX <= 1; deltaX++) {
            for (var deltaY = 0; deltaY <= 1; deltaY++) {
                gridX = X + deltaX; gridY = Y + deltaY;
                distX = Math.abs(x2 - gridX); distY = Math.abs(y2 - gridY);
                fadeX = 1 - fade(distX); fadeY = 1 - fade(distY);

                // Determine which random gradient to use
                hash = permutations[permutations[gridX % persistence] + (gridY % persistence)];
                // Dot product contribution
                grad = (x2 - gridX) * gradList[hash][0] + (y2 - gridY) * gradList[hash][1];
                baseNoise += fadeX * fadeY * grad;
            }
        }

        noise += baseNoise/k;
    }

    // Noise is in the range -1 to 1, so project to 0 to 1 range.
    return (noise+1)/2.0;
}

var coeff = 1.2;
var alpha = 1.5;

function elevation(x, y) {
    // -S <= x, y <= S ---> 0 <= x, y <= 127
    var noiseX = 127 * (x+S)/(2*S); var noiseY = 127 * (y+S)/(2*S);

    var posOffset = [32, 20];
    var posOffset2 = [1, 8]; var posOffset3 = [12, 35];
    var scale = 4;

    // Domain warping
    var offset = [fractal(noiseX, noiseY), fractal(noiseX + posOffset[0], noiseY + posOffset[1])];
    var offset2 = [fractal(noiseX + scale * offset[0] + posOffset2[0], noiseY + scale * offset[1] + posOffset2[1]),
                  fractal(noiseX + scale * offset[0] + posOffset3[0], noiseY + scale * offset[1] + posOffset3[1])];
    var noise = fractal(noiseX + scale * offset2[0], noiseY + scale * offset2[1]);
    return Math.pow(coeff * noise, alpha);
}

// Given three points, compute the normal to the plane
function computeNormal(p1, p2, p3) {
    var diff1 = vec3.create(); var diff2 = vec3.create();
    var normal = vec3.create();

    vec3.subtract(p2, p1, diff1);
    vec3.subtract(p3, p1, diff2);
    vec3.cross(diff1, diff2, normal);
    normal = vec3.normalize(normal);
    return normal;
}

// Linear interpolation from a to b (t=0 yields a, t=1 yields b )
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Get t value such that x = lerp(a, b, t)
function invLerp(a, b, x) {
    return (x - a)/(b-a);
}

// Smoothly interpolate from c1 to c2 (t=0 yields c1, t=1 yields c2)
function colorInterpolate(c1, c2, t) {
    // Control points
    var p1 = [(c1[0] + c2[0])/2, (c1[1] + c2[1])/2, c1[2]];
    var p2 = [c1[0], (c1[1] + c2[1])/2, (c1[2]+c2[2])/2];
    // Interpolate
    var c3 = [0.0, 0.0, 0.0];
    var t_comp = 1-t;
    for (var i = 0; i < 3; i++) {
        // (1-t)^3 * c1 + 3*(1-t)^2*t*p1 + 3*(1-t)*t^2*p2 + t^3*c2
        // (1-t)^2 * ((1-t)*c1 + 3*t*p1) + t^2*(3*(1-t)*p2 + t*c2)
        c3[i] = t_comp*t_comp*(t_comp*c1[i] + 3*t*p1[i]) + t*t*(3*t_comp*p2[i] + t*c2[i]);
    }
    return c3;
}

// Return the corresponding perlin noise at point 0 <= u, v < 1
function generate() {
    var numVertices = n*n;
    var delta = (2*S)/(n-1);
    var max_height = 5.0;

    var waterThresh = 0.3;
    var lowLandThresh = 0.5;
    var beachThresh = (waterThresh + lowLandThresh) / 2.0;
    var midLandThresh = 0.7;
    var mountainThresh = 0.8;

    var waterColor = [0.24, 0.52, 0.78];
    var beachColor = [0.9, 0.85, 0.55];
    var lowLandColor = [0.32, 0.78, 0.32];
    var midLandColor = [0.43, 0.69, 0.28];
    var mountainColor = [0.4, 0.4, 0.4];
    var peakColor = [0.85, 0.85, 0.85];

    vertexPositions = new Array(numVertices * 3);
    vertexNormals = new Array(numVertices * 3);
    vertexColors = new Array(numVertices * 3);
    vertexIndices = new Array(numVertices * 6);

    var cornerIndex;
    // Set positions and colors for each vertex
    var X, Z, height, color;
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            cornerIndex = n * i + j;
            // (x, y, z)
            X = -S + delta * i;
            Z = S - delta * j;
            height = elevation(X, Z);
            vertexPositions[3 * cornerIndex] = X;
            vertexPositions[3 * cornerIndex + 1] = max_height * height;
            vertexPositions[3 * cornerIndex + 2] = Z;

            // (cx, cy, cz)
            if (height < waterThresh) {
                color = colorInterpolate(waterColor, beachColor, invLerp(0.0, waterThresh, height));
            }
            else if (height < beachThresh) {
                color = colorInterpolate(beachColor, lowLandColor, invLerp(waterThresh, beachThresh, height));
            }
            else if (height < lowLandThresh) {
                color = colorInterpolate(lowLandColor, midLandColor, invLerp(beachThresh, lowLandThresh, height));
            }
            else if (height < midLandThresh) {
                color = colorInterpolate(midLandColor, mountainColor, invLerp(lowLandThresh, midLandThresh, height));
            }
            else if (height < mountainThresh) {
                color = colorInterpolate(mountainColor, peakColor, invLerp(midLandThresh, mountainThresh, height));
            }
            else color = peakColor;

            vertexColors[3 * cornerIndex] = color[0];
            vertexColors[3 * cornerIndex + 1] = color[1];
            vertexColors[3 * cornerIndex + 2] = color[2];
        }
    }

    // Set normals for each vertex
    var p1, p2, p3;
    var deltaIs = [-1, 0, 1, 1, 0, -1]; var deltaJs = [0, 1, 1, 0, -1, -1];
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            cornerIndex = n * i + j;
            var normal = vec3.create();

            // p1 = point whose normal we want.
            p1 = vec3.create([vertexPositions[3 * cornerIndex], vertexPositions[3 * cornerIndex + 1], vertexPositions[3 * cornerIndex + 2]]);

            // Use surrounding six points to compute the normal
            // https://stackoverflow.com/questions/6656358/calculating-normals-in-a-triangle-mesh/21660173#21660173
            for (var k = 0; k < 6; k++) {
                var di = deltaIs[k], dj = deltaJs[k];
                if (!(0 <= i + di < n && 0 <= j + dj < n)) continue
                var di2 = deltaIs[(k+1)%6], dj2 = deltaJs[(k+1)%6];
                if (!(0 <= i + di2 < n && 0 <= j + dj2 < n)) continue
    
                var cornerIndex2 = n * (i+di) + (j+dj);
                var cornerIndex3 = n * (i+di2) + (j+dj2);
                p2 = vec3.create([vertexPositions[3 * cornerIndex2], vertexPositions[3 * cornerIndex2 + 1], vertexPositions[3 * cornerIndex2 + 2]]);
                p3 = vec3.create([vertexPositions[3 * cornerIndex3], vertexPositions[3 * cornerIndex3 + 1], vertexPositions[3 * cornerIndex3 + 2]]);
                vec3.add(normal, computeNormal(p1, p2, p3), normal);
            }
            vec3.normalize(normal);

            // Finally set normal
            vertexNormals[3 * cornerIndex] = normal[0];
            vertexNormals[3 * cornerIndex + 1] = normal[1];
            vertexNormals[3 * cornerIndex + 2] = normal[2];
        }
    }
    
    // Form triangles
    var counter = 0;
    for (var i = 0; i < n-1; i++) {
        for (var j = 0; j < n-1; j++) {
            cornerIndex = n * i + j;

            // Triangle one
            vertexIndices[6 * counter] = cornerIndex;
            vertexIndices[6 * counter + 1] = cornerIndex + 1;
            vertexIndices[6 * counter + 2] = cornerIndex + n;

            // Triangle two
            vertexIndices[6 * counter + 3] = cornerIndex + 1;
            vertexIndices[6 * counter + 4] = cornerIndex + n;
            vertexIndices[6 * counter + 5] = cornerIndex + 1 + n;

            counter += 1;
        }
    }
}