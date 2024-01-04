import React, { useEffect, useRef, useState } from 'react';
import { FaAlignCenter, FaAlignJustify, FaAlignLeft, FaAlignRight, FaImage } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi2';


type TextAlignSelectorProps = {
  onTextAlignSelect: (selectedTextAlign: string) => void;
  initialTextAlignValue:  string | null | undefined
};

const TextAlignSelector: React.FC<TextAlignSelectorProps> = ({ onTextAlignSelect, initialTextAlignValue = 'left'  }) => {
  const alignments = [
    { value: 'left', label: 'Align Left', icon: <FaAlignLeft/> },
    { value: 'center', label: 'Align Center', icon: <FaAlignCenter /> },
    { value: 'right', label: 'Align Right', icon: <FaAlignRight /> },
    { value: 'justify', label: 'Justify', icon: <FaAlignJustify /> },
  ]; // Daftar penataan teks

  
  const [selectedTextAlign, setSelectedTextAlign] = useState(initialTextAlignValue ? initialTextAlignValue : 'left'); // Penataan teks default
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk menentukan apakah dropdown dibuka atau tidak
  const dropdownRef = useRef<HTMLDivElement>(null); // Referensi ke div dropdown

  useEffect(()=>{
    setSelectedTextAlign(initialTextAlignValue ? initialTextAlignValue : 'left')
  }, [initialTextAlignValue])

  const handleTextAlignChange = (alignment: string) => {
    setSelectedTextAlign(alignment);
    onTextAlignSelect(alignment);
    setIsDropdownOpen(false); // Menutup dropdown setelah memilih opsi
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative flex flex-col items-center -mr-2 justify-center text-white">
      <div className='p-2'>
      <div className="selected-option p-3 bg-gray-800 rounded-md" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {alignments.find((align) => align.value === selectedTextAlign)?.icon}
      </div>
      </div>
      {isDropdownOpen && (
        <div  className="absolute top-12 z-20 p-3 rounded-lg flex flex-col w-full bg-slate-800 mt-2">
          {alignments.map((align) => {
            console.log(align.value)
            
            return (
            <div
              key={align.value}
              onClick={() => handleTextAlignChange(align.value)}
              className={`cursor-pointer p-2 ${selectedTextAlign === align.value ? 'bg-gray-700' : 'bg-gray-800'} mb-2`}
            >
              {align.icon}
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default TextAlignSelector;
