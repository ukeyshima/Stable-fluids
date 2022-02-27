import WebGL2 from '/src/Assets/WebGL2';
import divergenceFragmentShader from './divergenceFragmentShader.glsl';
import poissonFragmentShader from './poissonFragmentShader.glsl';
import pressureFragmentShader from './pressureFragmentShader.glsl';

export default class PressureProgram {
  constructor(canvas, _webgl2) {
    const divergenceUniList = ['dt', 'velocityTexture'];
    const divergenceAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const poissonUniList = ['resolution', 'poissonTexture', 'divergenceTexture'];
    const poissonAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const pressureUniList = ['resolution', 'dt', 'poissonTexture', 'velocityTexture'];
    const pressureAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'divergenceProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: divergenceFragmentShader,
        uniList: divergenceUniList,
        attList: divergenceAttList,
      },
      {
        name: 'poissonProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: poissonFragmentShader,
        uniList: poissonUniList,
        attList: poissonAttList,
      },
      {
        name: 'pressureProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: pressureFragmentShader,
        uniList: pressureUniList,
        attList: pressureAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.divergenceVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.divergenceProgram.attLocations).map((key) => webgl2.webglPrograms.divergenceProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.poissonVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.poissonProgram.attLocations).map((key) => webgl2.webglPrograms.poissonProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.pressureVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.pressureProgram.attLocations).map((key) => webgl2.webglPrograms.pressureProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.divergenceFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
    this.prePoissonFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
    this.curPoissonFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
    this.pressureFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, velocityFrameBuffer, resolution, dt, poissonIteration) {
    webgl2.gl.useProgram(webgl2.webglPrograms.divergenceProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.divergenceFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.divergenceVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    webgl2.gl.uniform1f(webgl2.webglPrograms.divergenceProgram.uniLocations.dt, dt);
    webgl2.gl.uniform1i(webgl2.webglPrograms.divergenceProgram.uniLocations.velocityTexture, 0);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    for (var i = 0; i < poissonIteration; i++) {
      const temp = this.prePoissonFrameBuffer;
      this.prePoissonFrameBuffer = this.curPoissonFrameBuffer;
      this.curPoissonFrameBuffer = temp;

      webgl2.gl.useProgram(webgl2.webglPrograms.poissonProgram.program);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.curPoissonFrameBuffer.f);
      webgl2.gl.bindVertexArray(this.poissonVAO);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, this.divergenceFrameBuffer.t);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE1);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, this.prePoissonFrameBuffer.t);
      webgl2.gl.uniform1i(webgl2.webglPrograms.poissonProgram.uniLocations.divergenceTexture, 0);
      webgl2.gl.uniform1i(webgl2.webglPrograms.poissonProgram.uniLocations.poissonTexture, 1);
      webgl2.gl.uniform2fv(webgl2.webglPrograms.poissonProgram.uniLocations.resolution, resolution);
      webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);
    }

    webgl2.gl.useProgram(webgl2.webglPrograms.pressureProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.pressureFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.pressureVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE1);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, this.curPoissonFrameBuffer.t);
    webgl2.gl.uniform1i(webgl2.webglPrograms.pressureProgram.uniLocations.velocityTexture, 0);
    webgl2.gl.uniform1i(webgl2.webglPrograms.pressureProgram.uniLocations.poissonTexture, 1);
    webgl2.gl.uniform1f(webgl2.webglPrograms.pressureProgram.uniLocations.dt, dt);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.pressureProgram.uniLocations.resolution, resolution);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    const temp = this.pressureFrameBuffer;
    this.pressureFrameBuffer = velocityFrameBuffer;
    velocityFrameBuffer = temp;

    return velocityFrameBuffer;
  }
}
