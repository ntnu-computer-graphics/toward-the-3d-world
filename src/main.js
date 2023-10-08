//  Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
}`;

// Fragment Shader program
const FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}`;

function main() {
  // Get Canvas Element
  const canvas = document.getElementById('webgl');
  if (!canvas) {
    console.log('Failed to retrieve canvas element');
    return;
  }
  // Get the WebGL context
  const gl = getWebGLContext(canvas);

  // Initialise the shader
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialise shaders');
  }

  const n = initVertexBuffers(gl);
  
  draw(gl, n)
}

function initVertexBuffers(gl) {
  var verticesColor = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
  ]);
  const n = 9;

  const FSIZE = verticesColor.BYTES_PER_ELEMENT;

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Error finding location of a_Position');
  }

  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.log('Error finding location of a_Color');
  }

  const buffer = gl.createBuffer()
  if(!buffer){
    console.log("Error creating buffer object");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColor, gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*6, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
  gl.enableVertexAttribArray(a_Color);

  // TODO: Define Matrices


  // TODO: Pass in Matrices to corresponding functions
  document.onkeydown = function(ev) { keydown(ev, gl, n) }

  return n;

}

let g_eyeX = 0; angle = 0;

function keydown(ev, gl, n) {
  if (ev.keyCode == 39) { // Right
    g_eyeX += 0.1;
  } else if (ev.keyCode == 37) { // Left
    g_eyeX -= 0.01;
  } else if (ev.keyCode == 81) { // q
    angle -= 1;
  } else if (ev.keyCode == 69) { // q
    angle += 1;
  } else { return; }
  draw(ev, gl, n)
}

function draw(gl, n) {

    // TODO: Update the angles and eye point

    // Set the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw Point
    gl.drawArrays(gl.TRIANGLES, 0, n);

}