import React, { useState } from 'react';
import { fonts } from '../../util/fonts/font'; // Sesuaikan path dengan lokasi file fonts.ts

type FontSelectorProps = {
  onFontSelect: (selectedFont: string) => void;
};

const FontSelector: React.FC<FontSelectorProps> = ({ onFontSelect }) => {
  const [selectedFont, setSelectedFont] = useState('');

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const font = event.target.value;
    setSelectedFont(font);
    onFontSelect(font);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <select
        value={selectedFont}
        onChange={handleFontChange}
        className="bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 focus:outline-none"
      >
        {Object.keys(fonts).map((font) => (
          <option key={font} value={fonts[font]}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
