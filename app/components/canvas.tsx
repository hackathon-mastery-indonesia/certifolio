import React, { useRef, useEffect, useState } from 'react';

type props = {

    parentWidth : number,
    parentHeight : number,
    onSubmit: (str:string) => void
    
}

const DrawingCanvas: React.FC<props> = ({
    parentWidth,
    parentHeight,
    onSubmit

}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false); //


  useEffect(()=>{
    if(canvasRef.current){
        const canvas = canvasRef.current;
        canvas.width = 1/4 * parentWidth < 280 ? 280 : 1/4 * parentWidth;
        canvas.height = 1/4 * parentHeight < 250 ? 250 : 1/4 * parentHeight;

        const context = canvas.getContext("2d")
        if(context){
            context.lineCap = "round";
            context.strokeStyle = "black";
            context.lineWidth = 5;
            contextRef.current = context;
            contextRef.current.globalCompositeOperation = 'source-over';
        }
    }
  },[parentWidth, parentHeight])



  
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    if(canvasRef.current){
        const ctx =  canvasRef.current.getContext("2d");
        if(ctx){
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            setIsDrawing(true);
            console.log('kudanil')
        }
        
    }
    

    e.preventDefault();
    //DONE
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if(isDrawing && canvasRef.current != null){
        console.log('canvas badut')
        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;
        const ctx =  canvasRef.current.getContext("2d");
        if(ctx){
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            console.log('bangett')
        }
        e.preventDefault();
    }
  }

  const endDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) =>{
    if(canvasRef.current){
        const ctx =  canvasRef.current.getContext("2d");
        if(ctx){
            ctx.closePath()
        }
    }
    setIsDrawing(false);
  }
 




  return (
    
    <canvas 
                ref={canvasRef}
                className=' bg-white rounded-md'
                style={{ border: '1px solid #ccc' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}/>
   
  );
};

export default DrawingCanvas;








