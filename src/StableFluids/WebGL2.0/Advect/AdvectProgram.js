import WebGL2 from '/src/Assets/WebGL2';
import advectFragmentShader from './advectFragmentShader.glsl';

export default class AdvectProgram {
  constructor(canvas, _webgl2) {
    const advectUniList = ['resolution', 'dt', 'velocityTexture'];
    const advectAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'advectProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: advectFragmentShader,
        uniList: advectUniList,
        attList: advectAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.advectVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.advectProgram.attLocations).map((key) => webgl2.webglPrograms.advectProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.advectFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, velocityFrameBuffer, resolution, dt) {
    webgl2.gl.useProgram(webgl2.webglPrograms.advectProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.advectFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.advectVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    webgl2.gl.uniform1i(webgl2.webglPrograms.advectProgram.uniLocations.velocityTexture, 0);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.advectProgram.uniLocations.resolution, resolution);
    webgl2.gl.uniform1f(webgl2.webglPrograms.advectProgram.uniLocations.dt, dt);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    const temp = velocityFrameBuffer;
    velocityFrameBuffer = this.advectFrameBuffer;
    this.advectFrameBuffer = temp;

    return velocityFrameBuffer;
  }
}
