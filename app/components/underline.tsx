import React, { useEffect, useState } from 'react';
import { FaUnderline } from 'react-icons/fa';

type UnderlineIconProps = {
  initialValue: boolean;
  onChange: (value: boolean) => void;
};

const UnderlineIcon: React.FC<UnderlineIconProps> = ({ initialValue, onChange }) => {
  const [isUnderline, setIsUnderline] = useState(initialValue);

  useEffect(()=>{
    setIsUnderline(initialValue)
  }, [initialValue])
  const handleUnderlineChange = () => {
    const newValue = !isUnderline;
    setIsUnderline(newValue);
    onChange(newValue);
  };

  return (
    <div className={`cursor-pointer ${isUnderline ? 'text-indigo-500' : 'text-gray-500'}`} onClick={handleUnderlineChange}>
      <FaUnderline size={24} />
    </div>
  );
};

export default UnderlineIcon;
