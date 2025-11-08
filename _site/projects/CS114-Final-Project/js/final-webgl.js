// Initialize GL object
var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) { }
    if (!gl) alert("Unable to initialise WebGL.");

    gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError, validateNoneOfTheArgsAreUndefined);
}


// Initialize shaders
var shaderProgram;
function createShader(vsID, fsID) {
    var shaderProg = createShaderProg(vsID, fsID);

    // Update vertex position and vertex normals
    shaderProg.vertexPositionAttribute = gl.getAttribLocation(shaderProg, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProg.vertexPositionAttribute);
    shaderProg.vertexNormalAttribute = gl.getAttribLocation(shaderProg, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProg.vertexNormalAttribute);
    shaderProg.vertexColorAttribute = gl.getAttribLocation(shaderProg, "aVertexColor");
    gl.enableVertexAttribArray(shaderProg.vertexColorAttribute);        

    // Update matrices and light position
    shaderProg.pMatrixUniform = gl.getUniformLocation(shaderProg, "uPMatrix");
    shaderProg.mvMatrixUniform = gl.getUniformLocation(shaderProg, "uMVMatrix");
    shaderProg.nMatrixUniform = gl.getUniformLocation(shaderProg, "uNMatrix");
    shaderProg.lightPosUniform = gl.getUniformLocation(shaderProg, "uLightPos");

    return shaderProg;
}

function initShaders() {
    shaderProgram = createShader("shader-vs", "shader-fs");
    gl.useProgram(shaderProgram);    
}


// Initialize vertex array and update element array buffers
var vertexPositionBuffer, vertexNormalBuffer, vertexColorBuffer, indexBuffer;
function initBuffers(createBuffers) {
    if (createBuffers) {
        vertexPositionBuffer = gl.createBuffer();
        vertexNormalBuffer = gl.createBuffer();
        vertexColorBuffer = gl.createBuffer();
        indexBuffer = gl.createBuffer();
    }
    updateBuffers();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(vertexIndices), gl.STATIC_DRAW);
}

function updateBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexPositions), gl.DYNAMIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexNormals), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertexColors), gl.DYNAMIC_DRAW);
}

// Matrices for vertex shader
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var fov = 35;
var front = 0.1;
var back = 100.0;

// Camera position and basis vectors
var cameraPos = [0.0, 10.0, -15];
var cameraForward = vec3.normalize([0.0, -0.5, 1.0]);
var cameraLeft = vec3.normalize([-1.0, 0.0, 0.0]);
var cameraUp = vec3.normalize([0.0, 1.0, 0.0]);

// Lighting control
var lightPos = [0.0, 5.0, 0.0];

function setUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var nMatrix = mat4.transpose(mat4.inverse(mvMatrix));
    gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);

    gl.uniform3fv(shaderProgram.lightPosUniform, lightPos);
}

// Apply camera lookAt matrix (https://www.songho.ca/opengl/gl_camera.html)
function lookAt(target) {
    // Forward vector
    vec3.subtract(cameraPos, target, cameraForward);
    vec3.normalize(cameraForward);
    // Left vector
    vec3.cross(cameraUp, cameraForward, cameraLeft);
    vec3.normalize(cameraLeft);
    // Recompute up vector
    vec3.cross(cameraForward, cameraLeft, cameraUp);

    // LookAt matrix
    var lookAtMat = mat4.create();
    // Block matrix for camera basis
    lookAtMat[0] = cameraLeft[0]; lookAtMat[4] = cameraLeft[1]; lookAtMat[8] = cameraLeft[2];
    lookAtMat[1] = cameraUp[0]; lookAtMat[5] = cameraUp[1]; lookAtMat[9] = cameraUp[2];
    lookAtMat[2] = cameraForward[0]; lookAtMat[6] = cameraForward[1]; lookAtMat[10] = cameraForward[2];
    // Translation component
    lookAtMat[12]= -cameraLeft[0] * cameraPos[0] - cameraLeft[1] * cameraPos[1] - cameraLeft[2] * cameraPos[2];
    lookAtMat[13]= -cameraUp[0] * cameraPos[0] - cameraUp[1] * cameraPos[1] - cameraUp[2] * cameraPos[2];
    lookAtMat[14]= -cameraForward[0] * cameraPos[0] - cameraForward[1] * cameraPos[1] - cameraForward[2] * cameraPos[2];
    lookAtMat[15] = 1.0;

    vec3.scale(cameraForward, -1.0, cameraForward);
    vec3.scale(cameraLeft, -1.0, cameraLeft);

    mat4.multiply(mvMatrix, lookAtMat);
}

var target = vec3.create();
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(fov, gl.viewportWidth/gl.viewportHeight, front, back, pMatrix);

    // Apply camera transformation and adjust camera basis if necessary
    mat4.identity(mvMatrix);
    vec3.add(cameraPos, cameraForward, target);
    lookAt(target);

    setUniforms();

    // Buffers

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);        
    gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
}

function tick() {
    requestAnimationFrame(tick); 
    drawScene();
    updateBuffers();
}

function generateTerrain() {
    perlinConfigure();
    generate();
}

function webGLStart() {
    var canvas = $("#canvas0")[0];

    initGL(canvas);
    initShaders();

    generateTerrain();

    initBuffers(true);

    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    document.getElementById("regen").onclick = function() { generateTerrain(); };

    var deltaAngle = 5;
    canvas.addEventListener('keydown', (e) => {
        // Move Up
        if (e.key == "ArrowUp") {
            vec3.add(cameraPos, cameraUp, cameraPos);
        }
        // Move Down
        else if (e.key == "ArrowDown") {
            vec3.subtract(cameraPos, cameraUp, cameraPos);
        }
        // Move Left
        else if (e.key == "ArrowLeft") {
            vec3.add(cameraPos, cameraLeft, cameraPos);
        }
        // Move Right
        else if (e.key == "ArrowRight") {
            vec3.subtract(cameraPos, cameraLeft, cameraPos);
        }
        // Move Forward
        else if (e.key == "z") {
            vec3.add(cameraPos, cameraForward, cameraPos);
        }
        // Move Down
        else if (e.key == "c") {
            vec3.subtract(cameraPos, cameraForward, cameraPos);
        }
        else {
            var c_val = Math.cos(deltaAngle * Math.PI / 180);
            var s_val = Math.sin(deltaAngle * Math.PI / 180);
            // Rotate Yaw Counter-Clockwise
            if (e.key == "a") {
                var oldCameraForward = [cameraForward[0], cameraForward[1], cameraForward[2]]
                for (var i = 0; i < 3; i++) cameraForward[i] = c_val * cameraForward[i] + s_val * cameraLeft[i];
                for (var i = 0; i < 3; i++) cameraLeft[i] = -s_val * oldCameraForward[i] + c_val * cameraLeft[i];
            }
            // Rotate Yaw Clockwise
            else if (e.key == "d") {
                var oldCameraForward = [cameraForward[0], cameraForward[1], cameraForward[2]]
                for (var i = 0; i < 3; i++) cameraForward[i] = c_val * cameraForward[i] - s_val * cameraLeft[i];
                for (var i = 0; i < 3; i++) cameraLeft[i] = s_val * oldCameraForward[i] + c_val * cameraLeft[i];
            }
            // Rotate Pitch Counter-Clockwise
            else if (e.key == "w") {
                var oldCameraForward = [cameraForward[0], cameraForward[1], cameraForward[2]]
                for (var i = 0; i < 3; i++) cameraForward[i] = c_val * cameraForward[i] - s_val * cameraUp[i];
                for (var i = 0; i < 3; i++) cameraUp[i] = s_val * oldCameraForward[i] + c_val * cameraUp[i];
            }
            // Rotate Pitch Clockwise
            else if (e.key == "s") {
                var oldCameraForward = [cameraForward[0], cameraForward[1], cameraForward[2]]
                for (var i = 0; i < 3; i++) cameraForward[i] = c_val * cameraForward[i] + s_val * cameraUp[i];
                for (var i = 0; i < 3; i++) cameraUp[i] = -s_val * oldCameraForward[i] + c_val * cameraUp[i];
            }
        }
    });

    tick();
}
