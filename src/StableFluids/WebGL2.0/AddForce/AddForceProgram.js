import WebGL2 from '/src/Assets/WebGL2';
import addForceFragmentShader from './addForceFragmentShader.glsl';

export default class AddForceProgram {
  constructor(canvas, _webgl2) {
    const addForceUniList = ['resolution', 'mouseDirection', 'mouseDown', 'mousePosition', 'velocityTexture'];
    const addForceAttList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    const webgl2 = new WebGL2(canvas, [
      {
        name: 'addForceProgram',
        vsText: WebGL2.defaulVertexShader,
        fsText: addForceFragmentShader,
        uniList: addForceUniList,
        attList: addForceAttList,
      },
    ]);
    _webgl2.webglPrograms = { ..._webgl2.webglPrograms, ...webgl2.webglPrograms };

    this.addForceVAO = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.addForceProgram.attLocations).map((key) => webgl2.webglPrograms.addForceProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );

    this.addForceFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height);
  }

  update(webgl2, velocityFrameBuffer, resolution, mouseDown, mousePosition, mouseDirection) {
    webgl2.gl.useProgram(webgl2.webglPrograms.addForceProgram.program);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, this.addForceFrameBuffer.f);
    webgl2.gl.bindVertexArray(this.addForceVAO);
    webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
    webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    webgl2.gl.uniform1i(webgl2.webglPrograms.addForceProgram.uniLocations.velocityTexture, 0);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.addForceProgram.uniLocations.resolution, resolution);
    webgl2.gl.uniform1i(webgl2.webglPrograms.addForceProgram.uniLocations.mouseDown, mouseDown);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.addForceProgram.uniLocations.mousePosition, mousePosition);
    webgl2.gl.uniform2fv(webgl2.webglPrograms.addForceProgram.uniLocations.mouseDirection, mouseDirection);
    webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
    webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

    const temp = velocityFrameBuffer;
    velocityFrameBuffer = this.addForceFrameBuffer;
    this.addForceFrameBuffer = temp;

    return velocityFrameBuffer;
  }
}
