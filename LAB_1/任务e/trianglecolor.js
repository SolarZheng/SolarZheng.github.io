"use strict";

var gl;
var points;
var triangleSize = 1.0; // 初始三角形大小
var bufferId; // 声明bufferId为全局变量

window.onload = function init() {
    var canvas = document.getElementById("triangle-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Three Vertices
    var vertices = [
        -1.0 * triangleSize, -1.0 * triangleSize,
        1.0 * triangleSize, -1.0 * triangleSize,
        0.0, 1.0 * triangleSize
    ];

    var vertcolors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ];
    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    bufferId = gl.createBuffer(); // 分配bufferId
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Associate external shader variables with data buffer
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    var cbufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertcolors), gl.STATIC_DRAW);

    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    // 监听滑动条的值变化
    var triangleSizeSlider = document.getElementById("triangle-size-slider");
    var triangleSizeValue = document.getElementById("triangle-size-value");

    triangleSizeSlider.addEventListener("input", function () {
        triangleSize = parseFloat(triangleSizeSlider.value);
        triangleSizeValue.textContent = triangleSize.toFixed(1);
        updateTriangleSize(vertices);
        render();
    });

    render();
};

// 更新三角形的大小
function updateTriangleSize(vertices) {
    vertices[0] = -1.0 * triangleSize;
    vertices[1] = -1.0 * triangleSize;
    vertices[2] = 1.0 * triangleSize;
    vertices[3] = -1.0 * triangleSize;
    vertices[4] = 0.0;
    vertices[5] = 1.0 * triangleSize;

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
