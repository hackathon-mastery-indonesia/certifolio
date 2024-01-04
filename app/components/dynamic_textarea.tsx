import React, { useState, useRef, useEffect, ChangeEvent, CSSProperties } from 'react';

interface DynamicTextAreaProps {
  value: string;
  onChange?: (value: string) => void;
}

const DynamicTextArea: React.FC<DynamicTextAreaProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  const [textareaWidth, setTextareaWidth] = useState('auto');

  useEffect(() => {
    if (textareaRef.current) {
      setTextareaHeight(`${textareaRef.current.scrollHeight}px`);
      setTextareaWidth(`${textareaRef.current.scrollWidth}px`)
    }
  }, [value]);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  let textareaStyle: CSSProperties = {
    width: textareaWidth,
    height: textareaHeight,
  };

  return (
    <div 
    className='text-neutral-200 bg-neutral-800 
    p-2 rounded flex flex-col space-y-2'>
      <span>Input text</span>
      <textarea name="" style={
        textareaStyle
      }
      ref={textareaRef} placeholder='type something here'
       onChange={handleTextareaChange} className='p1 bg-neutral-700 
      active:outline-none rounded' >{value}</textarea>
    </div>
  );
};

export default DynamicTextArea;

