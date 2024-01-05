import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

type ColorPickerProps = {
  onColorSelect: (selectedColor: string) => void;
  defaultColor?: string;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, defaultColor }) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor ? defaultColor : '#7CB9E8');
  const [isPopupActive, setIsPopupActive] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    
    setSelectedColor( defaultColor ? defaultColor : '#7CB9E8')

  }, [defaultColor])

  const handleColorChange = (color: ColorResult) => {
    const newColor = color.hex;
    setSelectedColor(newColor);
    onColorSelect(newColor);
    console.log(newColor)
    //setIsPopupActive(false)
    
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
      setIsPopupActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={colorPickerRef} className="flex relative flex-col items-center justify-center bg-gray-900 text-white">
      <div
        
        className=" p-3 min-h-10 min-w-10 rounded-md cursor-pointer"
        style={{ backgroundColor: selectedColor }}
        onClick={() => setIsPopupActive(!isPopupActive)}
      ></div>
      {isPopupActive && (
        <div className="absolute z-20 top-16">
          <SketchPicker color={selectedColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

