import React, { useEffect, useState } from 'react';

type FontSizeSelectorProps = {
  onFontSizeSelect: (selectedFontSize: number) => void;
  initialFontSize: number|undefined|null
};

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ onFontSizeSelect, initialFontSize=12 }) => {
  const fontSizes = Array.from({ length: 64 }, (_, i) => (i + 1).toString()); // Daftar ukuran font dari 1 hingga 64

  const [selectedFontSize, setSelectedFontSize] = useState(initialFontSize? initialFontSize : 12); // Ukuran font default

  useEffect(()=>{
    setSelectedFontSize(initialFontSize? initialFontSize : 12)
  },[initialFontSize])

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fontSize = event.target.value;
    setSelectedFontSize(Number.parseFloat(fontSize));
    onFontSizeSelect(Number.parseFloat(fontSize)); // Menambahkan satuan "px" sebelum mengirim ukuran font yang dipilih
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white">
      <select
        value={selectedFontSize}
        onChange={handleFontSizeChange}
        className="bg-gray-800 text-base border border-gray-700 rounded-md p-2 focus:outline-none"
      >
        {fontSizes.map((fontSize) => (
          <option key={fontSize} value={fontSize}>
            {fontSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FontSizeSelector;

