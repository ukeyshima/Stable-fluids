import WebGL2 from '/src/Assets/WebGL2';
import renderingFragmentShader from './renderingFragmentShader.glsl';

export default class RenderingProgram {
  constructor(canvas, _webgl2) {
    const renderingUniList = ['colorTexture'];
    const renderingAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'renderingProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: renderingFragmentShader,
        uniList: renderingUniList,
        attList: renderingAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.renderingVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.renderingProgram.attLocations).map((key) => webgl2.webglPrograms.renderingProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  update(webgl2, curColorFrameBuffer) {
    webgl2.gl.useProgram(webgl2.webglPrograms.renderingProgram.program);
    webgl2.gl.bindVertexArray(this.renderingVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, curColorFrameBuffer.t);
    webgl2.gl.uniform1i(webgl2.webglPrograms.renderingProgram.uniLocations.colorTexture, 0);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
  }
}
