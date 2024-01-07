import { CertificateField } from '@/util/next_models/certificate_field';
import React, { useRef, useState } from 'react';
import DynamicTextArea from './dynamic_textarea';
import ResizableDraggableTextbox from './textbox';

type DraggableTextProps = {
  field: CertificateField;
  onDragEnd: (id: string, xPos: number, yPos: number) => void;
  onTextEdit: (id: string, newText: string) => void;
  onUpdateSize: (id: string, newWidth: number, newHeight: number) => void;
  parentWidth: number;
  parentHeight: number;
  onTap: (field:CertificateField) => void

};

const DraggableWrapper: React.FC<DraggableTextProps> = ({ field, onDragEnd,onTextEdit, parentWidth, parentHeight , onUpdateSize, onTap }) => {
  return (
    <div
    >
      {
        < ResizableDraggableTextbox field={field} onChange={(str) => {
          onTextEdit(field.id, str);
        } }
        onTap={(field)=>{
          onTap(field)
        }}
        onUpdateSize={(newWidth, newHeight)=>{
          onUpdateSize(field.id, newWidth, newHeight)
        }}  
        onUpdatePosition={(newX, newY) => {
          onDragEnd(field.id, newX, newY);
        } } parentWidth={parentWidth} parentHeight={parentHeight}/>
      }
    </div>
  );
}  

export default DraggableWrapper;


