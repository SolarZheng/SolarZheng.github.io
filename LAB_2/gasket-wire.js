"use strict";

var {
	vec3
} = glMatrix;
var rotationAngle = 0; // 初始旋转角度

var canvas;
var gl;

var points = [];
var numTimesToSubdivide;

var theta = 0;
var theta_ = 0;
var radius = 0.6;

function initTrianglesWire() {

	points = [];
	canvas = document.getElementById("gl-canvas");
	var slider_1 = document.getElementById("slider_1");
	var slider_2 = document.getElementById("slider_2");
	var slider_3 = document.getElementById("slider_3");

	gl = WebGLUtils.setupWebGL(canvas);

	if (!gl) {
		alert("WebGL isn't available");
	}

	var vertices = [
		radius * Math.cos(90 * Math.PI / 180.0), radius * Math.sin(90 * Math.PI / 180.0), 0,
		radius * Math.cos(210 * Math.PI / 180.0), radius * Math.sin(210 * Math.PI / 180.0), 0,
		radius * Math.cos(-30 * Math.PI / 180.0), radius * Math.sin(-30 * Math.PI / 180.0), 0
	];
	//如果需要普通旋转theta
	//x'=x⋅cos(θ)−y⋅sin(θ)
	//y'=x⋅sin(θ)+y⋅cos(θ)
	//z'=z （因为只涉及二维平面，所以 z 值保持不变）
	//console.log(theta);
	var u, v, w;
	if (theta != 0 && theta_ == 0) {
		theta = theta * Math.PI / 180.0;
		var vertices = [
			radius * Math.cos(90 * Math.PI / 180.0) * Math.cos(theta) - radius * Math.sin(90 * Math.PI / 180.0) *
			Math.sin(theta),
			radius * Math.cos(90 * Math.PI / 180.0) * Math.sin(theta) + radius * Math.sin(90 * Math.PI / 180.0) *
			Math.cos(theta),
			0,

			radius * Math.cos(210 * Math.PI / 180.0) * Math.cos(theta) - radius * Math.sin(210 * Math.PI / 180.0) *
			Math.sin(theta),
			radius * Math.cos(210 * Math.PI / 180.0) * Math.sin(theta) + radius * Math.sin(210 * Math.PI / 180.0) *
			Math.cos(theta),
			0,

			radius * Math.cos(-30 * Math.PI / 180.0) * Math.cos(theta) - radius * Math.sin(-30 * Math.PI / 180.0) *
			Math.sin(theta),
			radius * Math.cos(-30 * Math.PI / 180.0) * Math.sin(theta) + radius * Math.sin(-30 * Math.PI / 180.0) *
			Math.cos(theta),
			0,
		]
		u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
		v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
		w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

		divideTriangleWire(u, v, w, numTimesToSubdivide);
	} else if (theta == 0 && theta_ != 0) {
		u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
		v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
		w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

		divideTriangleWireT(u, v, w, numTimesToSubdivide);
	} else if (theta == 0 && theta_ == 0) {
		u = vec3.fromValues(vertices[0], vertices[1], vertices[2]);
		v = vec3.fromValues(vertices[3], vertices[4], vertices[5]);
		w = vec3.fromValues(vertices[6], vertices[7], vertices[8]);

		divideTriangleWire(u, v, w, numTimesToSubdivide);
	}

	//如果需要特殊旋转theta_
	//x'=x⋅cos(d⋅θ)−y⋅sin(d⋅θ)
	//y'=x⋅sin(d⋅θ)+y⋅cos(d⋅θ)
	//d = sqrt{x^2 + y^2}
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	var program = initShaders(gl, "vertex-shader-wire", "fragment-shader-wire");
	gl.useProgram(program);

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	renderWire();


	slider_1.onmouseup = function() {
		points = [];
		numTimesToSubdivide = slider_1.value;
		initTrianglesWire();
	}

	slider_2.onmouseup = function() {
		points = [];
		theta = slider_2.value;
		initTrianglesWire();
	}

	slider_3.onmouseup = function() {
		points = [];
		theta_ = slider_3.value;
		initTrianglesWire();
	}
}

function triangleWire(a, b, c) {
	points.push(a[0], a[1], a[2]);
	points.push(b[0], b[1], b[2]);
	points.push(b[0], b[1], b[2]);
	points.push(c[0], c[1], c[2]);
	points.push(a[0], a[1], a[2]);
	points.push(c[0], c[1], c[2]);
}

function tessellaTriangle(a, b, c) {
	//var k;
	
	var zerovec3 = vec3.create();
	vec3.zero(zerovec3);
	var radian = theta_ * Math.PI / 180.0;

	var a_new = vec3.create();
	var b_new = vec3.create();
	var c_new = vec3.create();

	var d_a = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
	var d_b = Math.sqrt(b[0] * b[0] + b[1] * b[1]);
	var d_c = Math.sqrt(c[0] * c[0] + c[1] * c[1]);

	vec3.set(a_new, a[0] * Math.cos(d_a * radian) - a[1] * Math.sin(d_a * radian),
		a[0] * Math.sin(d_a * radian) + a[1] * Math.cos(d_a * radian), 0);
	vec3.set(b_new, b[0] * Math.cos(d_b * radian) - b[1] * Math.sin(d_b * radian),
		b[0] * Math.sin(d_b * radian) + b[1] * Math.cos(d_b * radian), 0);
	vec3.set(c_new, c[0] * Math.cos(d_c * radian) - c[1] * Math.sin(d_c * radian),
		c[0] * Math.sin(d_c * radian) + c[1] * Math.cos(d_c * radian), 0);

	points.push(a_new[0], a_new[1], a_new[2]);
	points.push(b_new[0], b_new[1], b_new[2]);
	points.push(b_new[0], b_new[1], b_new[2]);
	points.push(c_new[0], c_new[1], c_new[2]);
	points.push(c_new[0], c_new[1], c_new[2]);
	points.push(a_new[0], a_new[1], a_new[2]);

}

function divideTriangleWire(a, b, c, count) {

	if (count == 0) {
		triangleWire(a, b, c);
		// if (theta_ != 0 && theta == 0) {
		// 	tessellaTriangle(a, b, c);
		// }
	} else {
		var ab = vec3.create();
		vec3.lerp(ab, a, b, 0.5);
		var bc = vec3.create();
		vec3.lerp(bc, b, c, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);
		--count;
		divideTriangleWire(ab, bc, ca, count);
		divideTriangleWire(a, ab, ca, count);
		divideTriangleWire(b, bc, ab, count);
		divideTriangleWire(c, ca, bc, count);
	}
}

function divideTriangleWireT(a, b, c, count) {
	if (count == 0) {
		// triangleWire(a, b, c);
		tessellaTriangle(a, b, c);
	} else {
		var ab = vec3.create();
		vec3.lerp(ab, a, b, 0.5);
		var bc = vec3.create();
		vec3.lerp(bc, b, c, 0.5);
		var ca = vec3.create();
		vec3.lerp(ca, c, a, 0.5);
		--count;
		divideTriangleWireT(ab, bc, ca, count);
		divideTriangleWireT(a, ab, ca, count);
		divideTriangleWireT(b, bc, ab, count);
		divideTriangleWireT(c, ca, bc, count);
	}
}

function renderWire() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.LINES, 0, points.length / 2);
}
