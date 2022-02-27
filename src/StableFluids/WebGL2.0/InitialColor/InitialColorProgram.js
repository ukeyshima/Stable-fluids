import WebGL2 from '/src/Assets/WebGL2';
import initialColorFragmentShader from './initialColorFragmentShader.glsl';

export default class InitialColorProgram {
  constructor(canvas, _webgl2) {
    const initialColorUniList = ['resolution'];
    const initialColorAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'initialColorProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: initialColorFragmentShader,
        uniList: initialColorUniList,
        attList: initialColorAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.initialColorVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.initialColorProgram.attLocations).map((key) => webgl2.webglPrograms.initialColorProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.colorFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, resolution) {
    webgl2.gl.useProgram(webgl2.webglPrograms.initialColorProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.colorFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.initialColorVAO);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.initialColorProgram.uniLocations.resolution, resolution);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    return this.colorFrameBuffer;
  }
}
