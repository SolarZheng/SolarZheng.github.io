"use strict";
const {
	vec3,
	vec4,
	mat4
} = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];

var numVertices = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;

var theta = [0, 0, 0];
var dis = [0, 0, 0];
var scale = [1, 1, 1];
var thetaLoc;
var disLoc;
var scaLoc;
var rotationMatrix;
var rotationMatrixLoc;

var angle = 0.0;
var axis_ = [0, 0, 1];

var trackingMouse = false;
var trackballMove = false;
var lastPos = [0, 0, 0];
var curx, cury;
var startx, starty;

window.onload = function initCube() {
	canvas = document.getElementById("rtcb-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

	makeCube();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	// load shaders and initialize attribute buffer
	var program = initShaders(gl, "rtvshader", "rtfshader");
	gl.useProgram(program);

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	thetaLoc = gl.getUniformLocation(program, "theta");
	gl.uniform3fv(thetaLoc, theta);;
	// moveLoc = gl.getUniformLocation(program, "move");
	// gl.uniform3fv(moveLoc, move);
	disLoc = gl.getUniformLocation(program, "dis");
	gl.uniform3fv(disLoc, dis);
	// zoomLoc = gl.getUniformLocation(program, "zoom");
	// gl.uniform3fv(zoomLoc, zoom);
	scaLoc = gl.getUniformLocation(program, "scale");
	gl.uniform3fv(scaLoc, scale);

	//--------a--------
	document.getElementById("xbutton").onclick = function() {
		axis = xAxis;
	}
	document.getElementById("ybutton").onclick = function() {
		axis = yAxis;
	}
	document.getElementById("zbutton").onclick = function() {
		axis = zAxis;
	}
	//--------b-------
	document.getElementById("xTrans").onchange = function(event) {
		dis[0] = event.target.value;
	}

	document.getElementById("yTrans").onclick = function() {
		dis[1] = event.target.value;
	}

	document.getElementById("zTrans").onclick = function() {
		dis[2] = event.target.value;
	}
	//--------c----------
	document.getElementById("xScale").onchange = function(event) {
		scale[0] = event.target.value;
	}
	document.getElementById("yScale").onchange = function(event) {
		scale[1] = event.target.value;
	}
	document.getElementById("zScale").onchange = function(event) {
		scale[2] = event.target.value;
	}
	//-------d----------
	rotationMatrix = mat4.create();
	rotationMatrixLoc = gl.getUniformLocation(program, "rmat");
	gl.uniformMatrix4fv(rotationMatrixLoc, false, new Float32Array(rotationMatrix));
	
	canvas.addEventListener("mousedown", function(event) {
		var x = 2 * event.clientX / canvas.width - 1;
		var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
		startMotion(x, y);
	});

	canvas.addEventListener("mouseup", function(event) {
		var x = 2 * event.clientX / canvas.width - 1;
		var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
		stopMotion(x, y);
	});

	canvas.addEventListener("mousemove", function(event) {
		var x = 2 * event.clientX / canvas.width - 1;
		var y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
		moveMotion(x, y);
	});

	render();
}

function trackballView(x, y) {
	var d, a;
	var v = [];

	v[0] = x;
	v[1] = y;

	d = v[0] * v[0] + v[1] * v[1];
	if (d < 1.0)
		v[2] = Math.sqrt(1.0 - d);
	else {
		v[2] = 0.0;
		a = 1.0 / Math.sqrt(d);
		v[0] *= a;
		v[1] *= a;
	}
	return v;
}

function startMotion(x, y) {
	trackingMouse = true;
	startx = x;
	starty = y;
	curx = x;
	cury = y;

	lastPos = trackballView(x, y);
	trackballMove = true;
}

function moveMotion(x, y) {
	var dx, dy, dz;

	var curPos = trackballView(x, y);
	if (trackingMouse) {
		dx = curPos[0] - lastPos[0];
		dy = curPos[1] - lastPos[1];
		dz = curPos[2] - lastPos[2];

		if (dx || dy || dz) {
			angle = -1.0 * Math.sqrt(dx * dx + dy * dy + dz * dz);

			axis_[0] = lastPos[1] * curPos[2] - lastPos[2] * curPos[1];
			axis_[1] = lastPos[2] * curPos[0] - lastPos[0] * curPos[2];
			axis_[2] = lastPos[0] * curPos[1] - lastPos[1] * curPos[0];

			lastPos[0] = curPos[0];
			lastPos[1] = curPos[1];
			lastPos[2] = curPos[2];
		}
	}
	render();
}

function stopMotion(x, y) {
	trackingMouse = false;
	if (startx != x || starty != y) {} else {
		angle = 0.0;
		trackballMove = false;
	}
}

function makeCube() {
	var vertices = [
		glMatrix.vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
		glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0),
		glMatrix.vec4.fromValues(0.5, -0.5, 0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues(0.5, 0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues(0.5, -0.5, -0.5, 1.0),
	];

	var vertexColors = [
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
		glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)
	];

	var faces = [
		1, 0, 3, 1, 3, 2, //正
		2, 3, 7, 2, 7, 6, //右
		3, 0, 4, 3, 4, 7, //底
		6, 5, 1, 6, 1, 2, //顶
		4, 5, 6, 4, 6, 7, //背
		5, 4, 0, 5, 0, 1 //左
	];

	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);

		colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i /
			6)][2], vertexColors[Math.floor(i / 6)][3], );
	}
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	if (trackballMove) {
		vec3.normalize(axis_, axis_); //axis = normalize( axis );
		//rotationMatrix = multiply( rotationaMatrix, rotate(angle, axis) );
		var rmat = mat4.create();
		mat4.fromRotation(rmat, angle, axis_);
		mat4.multiply(rotationMatrix, rotationMatrix, rmat);
		gl.uniformMatrix4fv(rotationMatrixLoc, false, new Float32Array(rotationMatrix));
	}

	theta[axis] += 0.1;
	gl.uniform3fv(thetaLoc, theta);
	gl.uniform3fv(disLoc, dis);
	gl.uniform3fv(scaLoc, scale);

	gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

	requestAnimFrame(render);
}

//能跑分界线！
