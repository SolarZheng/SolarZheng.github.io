"use strict"
var canvas = document.getElementById("manCanvas");
var gl = WebGLUtils.setupWebGL(canvas);
var vertices = [];
var delay = 500;
var speed = 2;
var head = 1;

//window.onload = 
function initMan() {
	var slider = document.getElementById("slider");

	slider.onchange = function() {
		// 	if(slider.value>0)
		// 	console.log(slider.value);
		// 	else
		// 	console.log("value值为null");
		speed = slider.value;
		delay = 1000 / speed;
	}

	if (!gl) {
		alert("WebGL initialization failed. Your browser may not support it.");
	}
	// 初始化着色器程序
	var shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");

	if (!shaderProgram) {
		alert("Shader program initialization failed.");
	}

	gl.useProgram(shaderProgram);

	//脑壳
	var r = 0.05;
	for (var i = 0; i < 20; i++) {
		vertices.push(r * Math.cos(2 * Math.PI / 20 * i)); //x
		vertices.push(0.15 + r * Math.sin(2 * Math.PI / 20 * i)); //y 
		//x与y必须成对出现！注意vertices顶点数组的存储方式
	}
	//上肢
	vertices.push(0.15), vertices.push(-0.05);
	vertices.push(0.05), vertices.push(0.10);
	vertices.push(-0.05), vertices.push(0.10);
	vertices.push(-0.15), vertices.push(-0.05);
	//身板
	vertices.push(0.05), vertices.push(-0.10);
	vertices.push(0.05), vertices.push(0.10);
	vertices.push(-0.05), vertices.push(0.10);
	vertices.push(-0.05), vertices.push(-0.10);
	//jio杆
	vertices.push(0.05), vertices.push(-0.3);
	vertices.push(0), vertices.push(-0.10);
	vertices.push(-0.05), vertices.push(-0.3);

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	render();
	// for (var i = 0; i < vertices.length; i++)
	// 	console.log("目前坐标点 " + i + " " + vertices[i]);
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.drawArrays(gl.TRIANGLE_FAN, 0, 20);
	gl.drawArrays(gl.LINES, 20, 4);
	gl.drawArrays(gl.LINE_LOOP, 24, 4);
	gl.drawArrays(gl.LINES, 28, 2);
	gl.drawArrays(gl.LINES, 29, 2);

	for (var i = 0; i < 62; i++) {

		if (head == -1) {
			if (vertices[40] < 0.4)
				vertices[i * 2] += 0.08;
			else
				vertices[i * 2] -= 0.08;
		} else
			vertices[i * 2] += 0.01;
	}

	setTimeout(function() {
		requestAnimFrame(initMan);
	}, delay);
}

function headbang() {
	head = -head;
}

function refreshPage() {
	window.location.reload();
}
