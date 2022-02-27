import WebGL2 from '/src/Assets/WebGL2';
import diffuseFragmentShader from './diffuseFragmentShader.glsl';

export default class DiffuseProgram {
  constructor(canvas, _webgl2) {
    const diffuseUniList = ['resolution', 'dt', 'diffuse', 'velocityTexture', 'diffuseTexture'];
    const diffuseAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'diffuseProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: diffuseFragmentShader,
        uniList: diffuseUniList,
        attList: diffuseAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.diffuseVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.diffuseProgram.attLocations).map((key) => webgl2.webglPrograms.diffuseProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.preDiffuseFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
    this.curDiffuseFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, velocityFrameBuffer, resolution, dt, v, diffuseIteration) {
    for (var i = 0; i < diffuseIteration; i++) {
      const temp = this.preDiffuseFrameBuffer;
      this.preDiffuseFrameBuffer = this.curDiffuseFrameBuffer;
      this.curDiffuseFrameBuffer = temp;

      webgl2.gl.useProgram(webgl2.webglPrograms.diffuseProgram.program);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.curDiffuseFrameBuffer.f);
      webgl2.gl.bindVertexArray(this.diffuseVAO);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
      webgl2.gl.activeTexture(webgl2.gl.TEXTURE1);
      webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, this.preDiffuseFrameBuffer.t);
      webgl2.gl.uniform1i(webgl2.webglPrograms.diffuseProgram.uniLocations.velocityTexture, 0);
      webgl2.gl.uniform1i(webgl2.webglPrograms.diffuseProgram.uniLocations.diffuseTexture, 1);
      webgl2.gl.uniform1f(webgl2.webglPrograms.diffuseProgram.uniLocations.diffuse, v);
      webgl2.gl.uniform1f(webgl2.webglPrograms.diffuseProgram.uniLocations.dt, dt);
      webgl2.gl.uniform2fv(webgl2.webglPrograms.diffuseProgram.uniLocations.resolution, resolution);
      webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
      webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);
    }

    const temp = velocityFrameBuffer;
    velocityFrameBuffer = this.curDiffuseFrameBuffer;
    this.curDiffuseFrameBuffer = temp;

    return velocityFrameBuffer;
  }
}
