import React, { useState } from 'react';
import { FaBold } from 'react-icons/fa';

type BoldIconProps = {
  initialValue: boolean;
  onChange: (value: boolean) => void;
};

const BoldIcon: React.FC<BoldIconProps> = ({ initialValue, onChange }) => {
  const [isBold, setIsBold] = useState(initialValue);

  const handleBoldChange = () => {
    const newValue = !isBold;
    setIsBold(newValue);
    onChange(newValue);
  };

  return (
    <div className={`cursor-pointer ${isBold ? 'text-indigo-500' : 'text-gray-500'}`} onClick={handleBoldChange}>
      <FaBold size={24} />
    </div>
  );
};

export default BoldIcon;
