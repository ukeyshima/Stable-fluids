import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import WebGL2 from '/src/Assets/WebGL2';
import state from '/src/stateManager';
import { useRecoilValue } from 'recoil';

import InitialColorProgram from './InitialColor/InitialColorProgram';
import InitialVelocityProgram from './InitialVelocity/InitialVelocityProgram';
import AddForceProgram from './AddForce/AddForceProgram';
import AdvectProgram from './Advect/AdvectProgram';
import DiffuseProgram from './Diffuse/DiffuseProgram';
import PressureProgram from './Pressure/PressureProgram';
import UpdateColorProgram from './UpdateColor/UpdateColorProgram';
import RenderingProgram from './Rendering/RenderingProgram';

const useStyles = makeStyles({
  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
});

export default function Canvas() {
  const classes = useStyles();
  const canvasRef = useRef();
  const stateData = useRecoilValue(state);

  let mousePosition = [0, 0];
  let mouseDirection = [0, 0];
  let mouseDown = false;
  let resolution = [0, 0];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const webgl2 = new WebGL2(canvas, []);

    const initialColorProgram = new InitialColorProgram(canvas, webgl2);
    const initialVelocityProgram = new InitialVelocityProgram(canvas, webgl2);
    const addForceProgram = new AddForceProgram(canvas, webgl2);
    const advectProgram = new AdvectProgram(canvas, webgl2);
    const diffuseProgram = new DiffuseProgram(canvas, webgl2);
    const pressureProgram = new PressureProgram(canvas, webgl2);
    const updateColorProgram = new UpdateColorProgram(canvas, webgl2);
    const renderingProgram = new RenderingProgram(canvas, webgl2);

    resolution = [canvas.width, canvas.height];

    let colorFrameBuffer = initialColorProgram.update(webgl2, resolution);
    let velocityFrameBuffer = initialVelocityProgram.update(webgl2, resolution);

    let time = new Date().getTime();
    let dt = (new Date().getTime() - time) / 1000;
    let animationID;
    const loop = () => {
      dt = (new Date().getTime() - time) / 1000;
      time = new Date().getTime();

      webgl2.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      webgl2.gl.clear(webgl2.gl.COLOR_BUFFER_BIT);

      velocityFrameBuffer = addForceProgram.update(webgl2, velocityFrameBuffer, resolution, mouseDown, mousePosition, mouseDirection);

      velocityFrameBuffer = advectProgram.update(webgl2, velocityFrameBuffer, resolution, dt);

      velocityFrameBuffer = diffuseProgram.update(webgl2, velocityFrameBuffer, resolution, dt, stateData.v, stateData.diffuseIteration);

      velocityFrameBuffer = pressureProgram.update(webgl2, velocityFrameBuffer, resolution, dt, stateData.poissonIteration);

      colorFrameBuffer = updateColorProgram.update(webgl2, velocityFrameBuffer, colorFrameBuffer, resolution, dt);

      renderingProgram.update(webgl2, colorFrameBuffer);

      webgl2.gl.flush();

      animationID = requestAnimationFrame(loop);
    };
    loop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      webgl2.gl.viewport(0, 0, canvas.width, canvas.height);
      resolution = [canvas.width, canvas.height];
    };

    window.addEventListener('resize', handleResize);

    const handleMouseDown = (e) => (mouseDown = 1);

    window.addEventListener(`mousedown`, handleMouseDown);

    const handleMouseMove = (e) => {
      mousePosition = [e.clientX, e.target.height - e.clientY];
      mouseDirection = [e.movementX, e.movementY];
    };
    window.addEventListener(`mousemove`, handleMouseMove);

    const handleMouseUp = (e) => (mouseDown = 0);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationID);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [stateData]);

  return <canvas className={clsx(classes.canvas)} ref={canvasRef}></canvas>;
}
