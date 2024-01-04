import React, { useEffect, useState } from 'react';
import { fonts } from '../../util/fonts/font'; // Sesuaikan path dengan lokasi file fonts.ts
import { Ubuntu } from 'next/font/google';

type FontSelectorProps = {
  onFontSelect: (selectedFont: string) => void;
  initialFont: string | null | undefined
};

const FontSelector: React.FC<FontSelectorProps> = ({ onFontSelect, initialFont  }) => {
  const [selectedFont, setSelectedFont] = useState(initialFont? initialFont :fonts['quicksand']);
  useEffect(()=>{
    setSelectedFont(initialFont? initialFont :fonts['quicksand'])
  },[initialFont])


  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const font = event.target.value;
    setSelectedFont(font);
    onFontSelect(font);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white">
      <select
        value={selectedFont}
        onChange={handleFontChange}
        style={{fontFamily: selectedFont}}
        className="bg-gray-800 text-base  border border-gray-700 rounded-md p-2  focus:outline-none"
      >
        {Object.keys(fonts).map((font) => (
          <option key={font} style={{fontFamily: font}} value={fonts[font]}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSelector;
