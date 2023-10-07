//  Vertex shader program
const VSHADER_SOURCE = `
void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
}
`

// Fragment Shader program
const FSHADER_SOURCE = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

function main() {
  // Get Canvas Element
  const canvas = document.getElementById('webgl')
  if (!canvas) {
    console.log('Failed to retrieve canvas element')
    return
  }
  // Get the WebGL context
  const gl = getWebGLContext(canvas)

  // Initialise the shader
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialise shaders')
  }

  // Set the clear color
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Draw Point
  gl.drawArrays(gl.POINTS, 0, 1)
}