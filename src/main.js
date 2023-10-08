//  Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewMatrix;
uniform mat4 u_RotationMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_ViewMatrix * u_RotationMatrix * a_Position;
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

  const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Error finding location of u_ViewMatrix');
  }

  const u_RotationMatrix = gl.getUniformLocation(gl.program, 'u_RotationMatrix');
  if (!u_RotationMatrix) {
    console.log('Error finding location of u_RotationMatrix');
  }

  const viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.5, 0.5, 0.0, 0, 0, -1, 0, 1, 0);

  const rotationMatrix = new Matrix4();
  rotationMatrix.setRotate(20, 0, 0, 1);

  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

  gl.uniformMatrix4fv(u_RotationMatrix, false, rotationMatrix.elements)

  // Set the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw Point
  gl.drawArrays(gl.TRIANGLES, 0, n);
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

  return n
}