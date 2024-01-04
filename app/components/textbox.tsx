import React, { useState } from 'react';

import { Rnd } from 'react-rnd';


interface ResizableDraggableTextboxProps {
  initialValue?: string;
  onChange?: (newValue: string) => void;
  onUpdatePosition: (newX: number, newY:number) => void;
  initialPosition: {
    x:number,
    y:number
  }
}

const ResizableDraggableTextbox: React.FC<ResizableDraggableTextboxProps> = ({
  initialValue = '',
  onChange,
  onUpdatePosition,
  initialPosition
}) => {


  const [width, setWidth] = useState<number>(200);
  const [height, setHeight] = useState<number>(100);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: initialPosition.x, y: initialPosition.y });
  const [isBorderActive, setIsBorderActive] = useState<boolean>(false);

  

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;

    if (onChange) {
      onChange(newText);
    }
  };

 

  return (
        <Rnd 
        
        position={
            {
                x: position.x,
                y: position.y
            }
        }

        onDrag={
            ()=>{
                setIsBorderActive(true)
            }
        }

        onMouseDown={
            ()=>{
                setIsBorderActive(true)
            }
        }
        onResize={()=>{
            setIsBorderActive(true)
        }}

        onMouseUp={()=>{
            setIsBorderActive(false)
        }}

        onDragStart={(e,d)=>{
            //todo: AKTIFKAN BORDER
            setIsBorderActive(true)
        }}
        onResizeStart={(e,d)=>{
            //todo: AKTIFKAN BORDER
            setIsBorderActive(true)

        }}
        onDragStop={(e, d) => { 
            setPosition({ x: d.x, y: d.y });
            onUpdatePosition(d.x, d.y)
            //todo: NONAKTIFKAN BORDER
            setIsBorderActive(false)

     }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(ref.offsetWidth);
            setHeight(ref.offsetHeight);
            setIsBorderActive(false)
            //todo: NONAKTIFKAN BORDER
          }}
        >
            <textarea
            style={{
                width: `${width}px`,
                height: `${height}px`,
                resize: 'none',
                overflow: 'auto',
                border: isBorderActive ? '2px solid #aec8f2' : 'none', //todo : STATE BORDER AKTIF ATAU TIDAK ATIF
                padding: '5px',
                transition: 'border-width 0.3s ease-in-out',
                boxSizing: 'border-box',
            }}
            className={`bg-transparent ${isBorderActive ? '2px solid #aec8f2' : 'none'} `}
            value={initialValue}
            onChange={handleTextChange}
            placeholder="Tulis sesuatu di sini..."
            />
        </Rnd>
  );
};

export default ResizableDraggableTextbox;


