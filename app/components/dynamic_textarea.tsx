import React, { useState, useRef, useEffect, ChangeEvent } from 'react';

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
      setTextareaWidth(`${textareaRef.current.scrollWidth}px`);
    }
  }, [value]);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleTextareaChange}
      style={{ height: textareaHeight, width: textareaWidth }}
    />
  );
};

export default DynamicTextArea;

