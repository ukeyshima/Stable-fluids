import WebGL2 from '/src/Assets/WebGL2';
import initialVelocityFragmentShader from './initialVelocityFragmentShader.glsl';

export default class InitialVelocityProgram {
  constructor(canvas, _webgl2) {
    const initialVelocityUniList = ['resolution'];
    const initialVelocityAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'initialVelocityProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: initialVelocityFragmentShader,
        uniList: initialVelocityUniList,
        attList: initialVelocityAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.initialVelocityVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.initialVelocityProgram.attLocations).map((key) => webgl2.webglPrograms.initialVelocityProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.velocityFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, resolution) {
    webgl2.gl.useProgram(webgl2.webglPrograms.initialVelocityProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.velocityFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.initialVelocityVAO);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.initialVelocityProgram.uniLocations.resolution, resolution);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    return this.velocityFrameBuffer;
  }
}
