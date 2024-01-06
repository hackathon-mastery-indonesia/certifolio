import React, { useRef, useEffect, useState } from 'react';

type props = {

    parentWidth : number,
    parentHeight : number,
    onSubmit: (str:string) => void,
    isDelete : boolean,
    foregroundColor: string,
    backgroundColor: string,
    toggleSubmit: boolean

    
}

const DrawingCanvas: React.FC<props> = ({
    parentWidth,
    parentHeight,
    onSubmit,
    isDelete,
    foregroundColor,
    backgroundColor,
    toggleSubmit
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false); //


  useEffect(()=>{
    if(canvasRef.current){
        const canvas = canvasRef.current;
        canvas.width = 3/7 * parentWidth < 280 ? 280 : 3/7 * parentWidth;
        canvas.height = 3/7 * parentHeight < 250 ? 250 : 3/7 * parentHeight;

        const context = canvas.getContext("2d")
        if(context){
            context.lineCap = "round";
            context.strokeStyle = foregroundColor;
            context.lineWidth = 8;
            contextRef.current = context;
            contextRef.current.globalCompositeOperation = 'source-over';
        }
    }
  },[isDelete])

  useEffect(()=>{
    if(toggleSubmit == true){
      saveDrawing()
    }
    
  }, [toggleSubmit])

  useEffect(()=>{
    if(canvasRef.current){
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")
      if(context){
        context.strokeStyle = foregroundColor;
      }

    }
  }, 
  [foregroundColor])




  
  
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



  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png'); // Mendapatkan gambar dalam bentuk URL
      // Sekarang Anda dapat menggunakan dataURL untuk menyimpan gambar atau mengirimnya ke server
      onSubmit(dataURL);
    }
  };

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
    <div style={{ border: '1px solid #ccc',
    backgroundColor: backgroundColor
  }}>
        <canvas 
                ref={canvasRef}
                className=' rounded-md'
                
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}/>
    </div>
    
   
  );
};

export default DrawingCanvas;








