"use strict";

var {
	vec3
} = glMatrix;

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 4;

//===
var colors = [];

//window.onload = 
function initTriangles2D() {
	canvas = document.getElementById("gl-canvas");
	var slider_1 = document.getElementById("slider_1");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-0.817, -0.817, 0,
		0, 0.817, 0,
		0.817, -0.817, 0
	];


	var u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
	var v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);;
	var w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

	divideTriangle2d(u, v, w, numTimesToSubdivide);

	// configure webgl
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// load shaders and initialise attribute buffers
	var program = initShaders(gl, "vertex-shader-2d", "fragment-shader-2d");
	gl.useProgram(program);

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	render2d();

	//层次调节
	slider_1.onmouseup = function() {
		points = [];
		numTimesToSubdivide = slider_1.value;
		initTriangles2D();
		//document.write(slider_1.value);
	}
};

function triangle2d(a, b, c) {
	//var k;
	points.push(a[0], a[1], a[2]);
	points.push(b[0], b[1], b[2]);
	points.push(c[0], c[1], c[2]);
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

function divideTriangle2d(a, b, c, count) {
	// check for end of recursion
	if (count == 0) {
		triangle2d(a, b, c);
	} else {
		var ab = vec3.create();
		vec3.lerp(ab, a, b, 0.5);
		var bc = vec3.create();
		vec3.lerp(bc, b, c, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);

		--count;

		// three new triangles
		divideTriangle2d(a, ab, ca, count);
		divideTriangle2d(b, bc, ab, count);
		divideTriangle2d(c, ca, bc, count);
	}
}

function render2d() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
}

function refreshPage() {
    location.reload(); // 或者使用 window.location.reload();
}