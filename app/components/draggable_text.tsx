import { CertificateField } from '@/util/next_models/certificate_field';
import React, { useRef, useState } from 'react';
import DynamicTextArea from './dynamic_textarea';
import ResizableDraggableTextbox from './textbox';

type DraggableTextProps = {
  field: CertificateField;
  onDragEnd: (id: string, xPos: number, yPos: number) => void;
  onTextEdit: (id: string, newText: string) => void
};

const DraggableWrapper: React.FC<DraggableTextProps> = ({ field, onDragEnd,onTextEdit  }) => {
  return (
    <div
    >
      {
        < ResizableDraggableTextbox initialPosition={{
          x: field.xPos, y: field.yPos
        }} initialValue={field.value} onChange={(str)=>{
          onTextEdit(field.id, str)
        }}
        onUpdatePosition={(newX, newY)=>{
          onDragEnd(field.id, newX, newY )
        }}/>
      }
    </div>
  );
}  

export default DraggableWrapper;


