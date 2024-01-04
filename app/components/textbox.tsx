import { CertificateField } from '@/util/next_models/certificate_field';
import { calculateFontSize, calculateRelativePositionFromParent, parseRelativePositionToFixed } from '@/util/responsive/calculate';
import React, { useState } from 'react';

import { Rnd } from 'react-rnd';


interface ResizableDraggableTextboxProps {
  onChange?: (newValue: string) => void;
  onUpdatePosition: (newX: number, newY:number) => void;
  parentWidth: number
  parentHeight: number,
  field:  CertificateField,
  onUpdateSize: (newWidth: number, newHeight: number) => void
  onTap: (field:CertificateField) => void
  
}

const ResizableDraggableTextbox: React.FC<ResizableDraggableTextboxProps> = ({
  onChange,
  onUpdatePosition,
  parentWidth,
  parentHeight,
  field,
  onUpdateSize,
  onTap
}) => {


  const [width, setWidth] = useState<number>(field.width);
  const [height, setHeight] = useState<number>(field.height);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: field.xPos, y: field.yPos });
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
                x: parseRelativePositionToFixed(position.x, parentWidth), // FIX KAN bener soalnya dia persenan dari parent widthnya, jadi masuk akal 
                y: parseRelativePositionToFixed(position.y, parentHeight) // FIX KAN bener soalnya dia persenan dari parent heightnya, jadi masuk akal
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
            const newX = calculateRelativePositionFromParent(d.x, parentWidth)
            const newY = calculateRelativePositionFromParent(d.y, parentHeight)
            setPosition({ x: newX, y: newY}); // FIX , kan ambil persentasenya
            onUpdatePosition(newX, newY); // FIX, kan ambil persentasenya
    
            setIsBorderActive(false)

     }}
        onResizeStop={(e, direction, ref, delta, position) => {
            const newWidth = calculateRelativePositionFromParent(ref.offsetWidth, parentWidth);
            const newHeight = calculateRelativePositionFromParent(ref.offsetHeight, parentHeight)
            setWidth(newWidth);
            setHeight(newHeight);
            onUpdateSize(newWidth,newHeight)
            setIsBorderActive(false)
            
          }}
        >
            <textarea
            onClick={()=>{
                onTap(field)
            }}
            style={{
                width: `${parseRelativePositionToFixed(width, parentWidth)}px`, 
                height: `${parseRelativePositionToFixed(height, parentHeight)}px`, 
                resize: 'none',
                overflow: 'hidden',
                border: isBorderActive ? '2px solid #aec8f2' : 'none', 
                padding: '5px',
                transition: 'border-width 0.3s ease-in-out',
                boxSizing: 'border-box',
                fontFamily: field.font,
                color: field.fontColor,
                fontSize: `${calculateFontSize(field.fontSize, parentWidth)}px`,
                fontStyle: field.isItalic? 'italic' : 'normal',
                fontWeight: field.isBold? 'bold' : 'normal',
                textDecoration: field.isUnderline? 'underline' :'none'
                
            }}
            className={`bg-transparent ${isBorderActive ? '2px solid #aec8f2' : 'none'}   text-${field.textAlign}`}
            value={field.value}
            onChange={handleTextChange}
            placeholder="Tulis sesuatu di sini..."
            />
        </Rnd>
  );
};

export default ResizableDraggableTextbox;


