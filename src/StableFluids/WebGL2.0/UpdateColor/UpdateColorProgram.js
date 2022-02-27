import WebGL2 from '/src/Assets/WebGL2';
import updateColorFragmentShader from './updateColorFragmentShader.glsl';

export default class UpdateColorProgram {
  constructor(canvas, _webgl2) {
    const updateColorUniList = ['resolution', 'dt', 'colorTexture', 'velocityTexture'];
    const updateColorAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'updateColorProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: updateColorFragmentShader,
        uniList: updateColorUniList,
        attList: updateColorAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.updateColorVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.updateColorProgram.attLocations).map((key) => webgl2.webglPrograms.updateColorProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.colorFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, velocityFrameBuffer, preColorFrameBuffer, resolution, dt) {
    webgl2.gl.useProgram(webgl2.webglPrograms.updateColorProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.colorFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.updateColorVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, preColorFrameBuffer.t);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE1);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    webgl2.gl.uniform1i(webgl2.webglPrograms.updateColorProgram.uniLocations.colorTexture, 0);
    webgl2.gl.uniform1i(webgl2.webglPrograms.updateColorProgram.uniLocations.velocityTexture, 1);
    webgl2.gl.uniform1f(webgl2.webglPrograms.updateColorProgram.uniLocations.dt, dt);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.updateColorProgram.uniLocations.resolution, resolution);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    const temp = preColorFrameBuffer;
    preColorFrameBuffer = this.colorFrameBuffer;
    this.colorFrameBuffer = temp;

    return preColorFrameBuffer;
  }
}
