import React, { useEffect, useState } from 'react';
import { FaItalic } from 'react-icons/fa';

type ItalicIconProps = {
  initialValue: boolean;
  onChange: (value: boolean) => void;
};

const ItalicIcon: React.FC<ItalicIconProps> = ({ initialValue, onChange }) => {
  const [isItalic, setIsItalic] = useState(initialValue);
  useEffect(()=>{
    setIsItalic(initialValue)
  }, [initialValue])
  const handleItalicChange = () => {
    const newValue = !isItalic;
    setIsItalic(newValue);
    onChange(newValue);
  };

  return (
    <div className={`cursor-pointer ${isItalic ? 'text-indigo-500' : 'text-gray-500'}`} onClick={handleItalicChange}>
      <FaItalic size={24} />
    </div>
  );
};

export default ItalicIcon;
