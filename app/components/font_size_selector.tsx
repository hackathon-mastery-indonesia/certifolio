import React, { useState } from 'react';

type FontSizeSelectorProps = {
  onFontSizeSelect: (selectedFontSize: string) => void;
};

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ onFontSizeSelect }) => {
  const fontSizes = Array.from({ length: 96 }, (_, i) => (i + 1).toString()); // Daftar ukuran font dari 1 hingga 64

  const [selectedFontSize, setSelectedFontSize] = useState(fontSizes[11]); // Ukuran font default

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fontSize = event.target.value;
    setSelectedFontSize(fontSize);
    onFontSizeSelect(fontSize + 'px'); // Menambahkan satuan "px" sebelum mengirim ukuran font yang dipilih
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

