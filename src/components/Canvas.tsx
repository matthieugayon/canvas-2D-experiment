import React, { useCallback, useEffect, useRef } from 'react';
import { useSceneApi } from '../Scene';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // This function updates the canvas size based on its parent's dimensions
  const resizeCanvas = useCallback(() => {
    const scene = useSceneApi.getState();
    if (canvasRef?.current) {
      const canvas = canvasRef.current;

      // get 2D context
      // we don't need alpha channel for this application
      const context = canvas.getContext('2d', { alpha: false });
      if (context) {
        // store context in scene store
        scene.setContext(context);
      }

      // Set canvas dimensions to fit window inner size, minus the right sidebar
      canvas.width = window.innerWidth - 300;
      canvas.height = window.innerHeight;

      // Draw scene
      scene.draw();
    }
  }, [canvasRef]);

  useEffect(() => {
    // Call resizeCanvas on initial render
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  return <canvas onClick={useSceneApi.getState().handleCanvasClick} ref={canvasRef} />;
};

export default Canvas;