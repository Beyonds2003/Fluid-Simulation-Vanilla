import GUI from "lil-gui";

const canvasEl = document.querySelector("canvas");
const gl = canvasEl.getContext("webgl");
gl.getExtension("OES_texture_float"); // needed for more precise simulation

const textureEl = document.createElement("canvas");
const textureCtx = textureEl.getContext("2d");

const fontOptions = {
  Arial: "Arial, sans-serif",
  Verdana: "Verdana, sans-serif",
  Tahoma: "Tahoma, sans-serif",
  "Times New Roman": "Times New Roman, serif",
  Georgia: "Georgia, serif",
  Garamond: "Garamond, serif",
  "Courier New": "Courier New, monospace",
  "Brush Script MT": "Brush Script MT, cursive",
};

const params = {
  fontName: "Verdana",
  isBold: false,
  fontSize: 120,
  text: "ADDY",
  pointerSize: null,
  color: { r: 1, g: 0.0, b: 0.5 },
};

const pointer = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  moved: false,
};

let outputColor, velocity, divergence, pressure, canvasTexture;
let isPreview = true;

const vertexShader = createShader(
  document.getElementById("vertexShader").innerHTML,
  gl.VERTEX_SHADER
);

const splatProgram = createProgram("fragmentShaderPoint");

function createProgram(elId) {
  const shader = createShader(
    document.getElementById(elId).innerHTML,
    gl.FRAGMENT_SHADER
  );
  const program = createShaderProgram(vertexShader, shader);
  const uniforms = getUniforms(program);
  return {
    program,
    uniforms,
  };
}

function createShaderProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    return null;
  }

  return program;
}

function getUniforms(program) {
  let uniforms = [];

  let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    let uniform = gl.getActiveUniform(program, i);
    uniforms[uniform.name] = gl.getUniformLocation(program, uniform.name);
  }

  return uniforms;
}

function createShader(sourceCode, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, sourceCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
