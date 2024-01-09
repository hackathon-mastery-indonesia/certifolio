import React, { useState, ChangeEvent } from 'react';
import { RiArrowDownSLine, RiSearchLine } from 'react-icons/ri';

interface SearchBarProps {
  onSearchCertID: (value: string) => void;
  onSearchBundleID: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchCertID, onSearchBundleID }) => {
  const [certID, setCertID] = useState('');
  const [activeField, setActiveField] = useState<string>('Certificate ID') 

  const handleIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCertID(value);
  };
  const handleActiveFieldChange = (field: string) => {
    setActiveField(field);
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (activeField === 'Certificate ID') {
        onSearchCertID(certID);
      } else {
        onSearchBundleID(certID);
      }
    }
  };

  const handleSubmit = () =>{
    console.log('SUBMIT')
    if (activeField === 'Certificate ID') {
        onSearchCertID(certID);
      } else {
        onSearchBundleID(certID);
      }
    setCertID('')
  }



  return (
    <div className="rounded-md p-4 w-full max-w-xl text-white flex justify-center space-x-2">
      <div className="flex-1 relative flex items-center">
        <div className="relative border border-neutral-700  rounded-l-xl">
          <select
            className="text-white bg-slate-900  appearance-none border-none py-2 pl-3 pr-8 rounded-l-xl"
            value={activeField}
            onChange={(e) => handleActiveFieldChange(e.target.value)}
          >
            <option className="bg-slate-900 p-2 mt-2" value="Certificate ID">Certificate ID</option>
            <option className="bg-slate-900 p-2" value="Bundle ID">Bundle ID</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-gray-400 pr-2">
            <RiArrowDownSLine className="w-5 h-5" />
          </div>
        </div>
        <input
          type="text"
          id="certID"
          placeholder={`Search ${activeField}`}
          value={certID}
          onChange={handleIDChange}
          onKeyDown={handleEnterPress}
          className="border border-neutral-700 rounded-r-xl w-full text-white pl-3 py-2 pr-8 bg-neutral-900"
        />
        <div onClick={handleSubmit} className="absolute  inset-y-0 right-0 flex items-center pr-2 pointer-events-auto text-gray-400">
          <RiSearchLine  />
        </div>
      </div>
    </div>
  );

};

export default SearchBar;

