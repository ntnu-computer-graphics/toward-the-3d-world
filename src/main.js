//  Vertex shader program
const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
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

  const modelMatrix = new Matrix4();
  const viewMatrix = new Matrix4();
  const projectionMatrix = new Matrix4();
  const mvPMatrix = new Matrix4();

  const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
  if(!u_MvpMatrix) {
    console.log("error Retrieving location of u_MvpMatrix");
    return;
  }

  // TODO: Pass in Matrices to corresponding functions
  document.onkeydown = function(ev) { keydown(ev, gl, canvas, n, modelMatrix, viewMatrix, projectionMatrix, mvPMatrix, u_MvpMatrix) }
  
  draw(gl, canvas, n, modelMatrix, viewMatrix, projectionMatrix, mvPMatrix, u_MvpMatrix)
}

function initVertexBuffers(gl) {
  var verticesColor = new Float32Array([
     0.0,  0.5, -4,  0.4,  1.0,  0.4,
    -0.5, -0.5, -4,  0.4,  1.0,  0.4,
     0.5, -0.5, -4,  1.0,  0.4,  0.4,

     0.0,  0.5, -2,  1.0,  0.4,  0.4,
    -0.5, -0.5, -2,  1.0,  1.0,  0.4,
     0.5, -0.5, -2,  1.0,  1.0,  0.4,

     0.0,  0.5,  0.0,  0.4,  0.4,  1.0,
    -0.5, -0.5,  0.0,  0.4,  0.4,  1.0,
     0.5, -0.5,  0.0,  1.0,  0.4,  0.4,
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

  return n;
}

let g_eyeX = 0; angle = 0; projection = "o";

function keydown(ev, gl, canvas, n, modelMatrix, viewMatrix, projectionMatrix, mvPMatrix, u_MvpMatrix) {
  if (ev.keyCode == 39) { // Right
    g_eyeX -= 0.01;
  } else if (ev.keyCode == 37) { // Left
    g_eyeX += 0.01;
  } else if (ev.keyCode == 81) { // q
    angle += 1;
  } else if (ev.keyCode == 69) { // e
    angle -= 1;
  } else if (ev.keyCode == 79) { // o
    projection = 'o';
  } else if (ev.keyCode == 80) { // p
    projection = 'p';
  } 
  else { return; }
  draw(gl, canvas, n, modelMatrix, viewMatrix, projectionMatrix, mvPMatrix, u_MvpMatrix)
}

function draw(gl, canvas, n, modelMatrix, viewMatrix, projectionMatrix, mvPMatrix, u_MvpMatrix) {
    // TODO: Update the angles and eye point
    modelMatrix.setRotate(angle, 0, 0, 1);
    
    switch(projection) {
      case 'o':
        viewMatrix.setLookAt(g_eyeX, 0, 5, 0, 0, 0, 0, 1, 0);
        projectionMatrix.setOrtho(-1.0,1.0,-1.0,1.0,0.0,16.0);
        break;
      case 'p':
        viewMatrix.setLookAt(g_eyeX, 0, 3.725, 0, 0, -100, 0, 1, 0);
        projectionMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100)
        break;
    }

    mvPMatrix.set(projectionMatrix).multiply(viewMatrix).multiply(modelMatrix)

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvPMatrix.elements)

    // Set the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    // Draw Point
    gl.drawArrays(gl.TRIANGLES, 0, n);

}