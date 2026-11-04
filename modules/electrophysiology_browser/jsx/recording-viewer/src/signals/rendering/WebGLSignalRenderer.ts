import {SignalRenderModel} from './SignalRenderModel';

/* eslint-disable jsdoc/require-jsdoc */

const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 segmentStart;
in vec2 segmentEnd;
uniform vec2 viewportSize;
uniform float lineWidth;
uniform float feather;
out float edgeDistance;
void main() {
  vec2 directionPixels = (segmentEnd - segmentStart) * viewportSize * 0.5;
  vec2 normalPixels = length(directionPixels) > 0.0
    ? normalize(vec2(-directionPixels.y, directionPixels.x))
    : vec2(0.0, 1.0);
  bool atEnd = gl_VertexID >= 2;
  float side = gl_VertexID % 2 == 0 ? -1.0 : 1.0;
  float extent = lineWidth * 0.5 + feather;
  vec2 point = atEnd ? segmentEnd : segmentStart;
  vec2 offset = normalPixels * side * extent * 2.0 / viewportSize;
  edgeDistance = side * extent;
  gl_Position = vec4(point + offset, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec4 color;
uniform float lineWidth;
uniform float feather;
in float edgeDistance;
out vec4 outputColor;
void main() {
  float coverage = 1.0 - smoothstep(
    lineWidth * 0.5 - feather,
    lineWidth * 0.5 + feather,
    abs(edgeDistance)
  );
  outputColor = vec4(color.rgb, color.a * coverage);
}`;

export type SignalRenderStyle = {
  hoveredChannels: number[],
  stackedView: boolean,
  singleMode: boolean,
  colors: Map<number, [number, number, number, number]>,
};

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (shader === null) throw new Error('Could not create WebGL shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader error';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

/** Minimal WebGL2 backend for densely sampled line signals. */
export default class WebGLSignalRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly vertexArray: WebGLVertexArrayObject;
  private readonly colorLocation: WebGLUniformLocation;
  private readonly viewportSizeLocation: WebGLUniformLocation;
  private readonly lineWidthLocation: WebGLUniformLocation;
  private readonly featherLocation: WebGLUniformLocation;
  private readonly segmentStartLocation: number;
  private readonly segmentEndLocation: number;
  private model: SignalRenderModel | null = null;
  private pixelRatio = 1;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      depth: false,
      preserveDrawingBuffer: false,
    });
    if (gl === null) throw new Error('WebGL2 is not available');
    this.gl = gl;
    const program = gl.createProgram();
    if (program === null) throw new Error('Could not create WebGL program');
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'Could not link WebGL program');
    }
    this.program = program;
    const buffer = gl.createBuffer();
    const vertexArray = gl.createVertexArray();
    const colorLocation = gl.getUniformLocation(program, 'color');
    const viewportSizeLocation = gl.getUniformLocation(program, 'viewportSize');
    const lineWidthLocation = gl.getUniformLocation(program, 'lineWidth');
    const featherLocation = gl.getUniformLocation(program, 'feather');
    if (buffer === null || vertexArray === null || colorLocation === null
      || viewportSizeLocation === null || lineWidthLocation === null
      || featherLocation === null) {
      throw new Error('Could not allocate WebGL signal resources');
    }
    this.buffer = buffer;
    this.vertexArray = vertexArray;
    this.colorLocation = colorLocation;
    this.viewportSizeLocation = viewportSizeLocation;
    this.lineWidthLocation = lineWidthLocation;
    this.featherLocation = featherLocation;
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const segmentStart = gl.getAttribLocation(program, 'segmentStart');
    const segmentEnd = gl.getAttribLocation(program, 'segmentEnd');
    if (segmentStart < 0 || segmentEnd < 0) {
      throw new Error('Could not locate WebGL signal attributes');
    }
    this.segmentStartLocation = segmentStart;
    this.segmentEndLocation = segmentEnd;
    gl.enableVertexAttribArray(segmentStart);
    gl.enableVertexAttribArray(segmentEnd);
    gl.vertexAttribDivisor(segmentStart, 1);
    gl.vertexAttribDivisor(segmentEnd, 1);
    gl.bindVertexArray(null);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  resize(width: number, height: number, pixelRatio: number) {
    this.pixelRatio = pixelRatio;
    const renderWidth = Math.max(1, Math.round(width * pixelRatio));
    const renderHeight = Math.max(1, Math.round(height * pixelRatio));
    if (this.canvas.width !== renderWidth) this.canvas.width = renderWidth;
    if (this.canvas.height !== renderHeight) this.canvas.height = renderHeight;
    this.gl.viewport(0, 0, renderWidth, renderHeight);
  }

  setModel(model: SignalRenderModel) {
    if (this.model === model) return;
    this.model = model;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, model.vertices, this.gl.STREAM_DRAW);
  }

  render(style: SignalRenderStyle) {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.model === null) return;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.uniform2f(
      this.viewportSizeLocation,
      this.canvas.width,
      this.canvas.height
    );
    gl.uniform1f(this.featherLocation, 0.75);
    const isolated = style.stackedView && style.singleMode
      && style.hoveredChannels.length > 0;
    this.model.draws.forEach((draw) => {
      const hovered = style.hoveredChannels.includes(draw.channelIndex);
      if (isolated && !hovered) return;
      const color = style.stackedView || hovered
        ? style.colors.get(draw.channelIndex) ?? [0.2, 0.2, 0.2, 1]
        : [0.6, 0.6, 0.6, 1] as [number, number, number, number];
      gl.uniform4fv(this.colorLocation, color);
      gl.uniform1f(
        this.lineWidthLocation,
        (hovered ? 2.5 : 1.5) * this.pixelRatio
      );
      gl.vertexAttribPointer(
        this.segmentStartLocation,
        2,
        gl.FLOAT,
        false,
        0,
        draw.firstVertex * 2 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.vertexAttribPointer(
        this.segmentEndLocation,
        2,
        gl.FLOAT,
        false,
        0,
        (draw.firstVertex + 1) * 2 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.drawArraysInstanced(
        gl.TRIANGLE_STRIP,
        0,
        4,
        draw.vertexCount - 1
      );
    });
    gl.bindVertexArray(null);
  }

  dispose() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteVertexArray(this.vertexArray);
    this.gl.deleteProgram(this.program);
    this.model = null;
  }
}
