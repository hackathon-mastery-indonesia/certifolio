import { CertificateField } from '@/util/next_models/certificate_field';
import React, { useRef, useState } from 'react';

type DraggableTextProps = {
  field: CertificateField;
  onDragEnd: (id: string, xPos: number, yPos: number) => void;
  onTextEdit: (id: string, newText: string) => void
};

const DraggableTextComponent: React.FC<DraggableTextProps> = ({ field, onDragEnd,onTextEdit  }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: field.xPos, y: field.yPos });
  const textRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const offsetX = event.clientX - position.x;
    const offsetY = event.clientY - position.y;
    setStartPosition({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;

    const x = event.clientX - startPosition.x;
    const y = event.clientY - startPosition.y;
    onDragEnd(field.id, position.x, position.y);
    console.log(field.id)
    setPosition({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
     onDragEnd(field.id, position.x, position.y);
    }
  };

  React.useEffect(() => {
    textRef.current?.addEventListener('mousemove', handleMouseMove);
    textRef.current?.addEventListener('mouseup', handleMouseUp);

    return () => {
      textRef.current?.removeEventListener('mousemove', handleMouseMove);
      textRef.current?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, textRef]);

  const handleTextChange = (e: React.FormEvent<HTMLSpanElement>) => {
    const selection = window.getSelection();
    const selectedNode = selection?.anchorNode;

    if (selectedNode && selectedNode.nodeType === Node.TEXT_NODE) {
      const text = selectedNode.textContent || '';
      const startPosition = selection?.getRangeAt(0).startOffset;
      const newText = `${text.slice(0, startPosition)}${field.value}${text.slice(startPosition)}`;
      selectedNode.textContent = newText;
    }

    onTextEdit(field.id, e.currentTarget.textContent || '');
  };

  return (
    <div
      ref={textRef}
      className="absolute p-2 cursor-move"
      style={{
        left: position.x + 'px',
        top: position.y + 'px',
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => {
        setIsEditing(true);
      }}
    >
      {isEditing ? (
        <span
        contentEditable={true}
        onInput={handleTextChange}
        onBlur={() => {
          // Jika contentEditable kehilangan fokus, atur isEditing ke false
          setIsEditing(false);
        }}
        className="border border-gray-300 bg-transparent rounded px-2 py-1"
        suppressContentEditableWarning={true}
      >
        {field.value}
      </span>
      ) : (
        <p className='rounded px-2 py-1'>{field.value}</p>
      )}
    </div>
  );
}  

export default DraggableTextComponent;


