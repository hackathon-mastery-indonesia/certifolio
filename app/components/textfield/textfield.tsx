'use client'

import { useRef, useState } from "react";
import { RiFileCopy2Line } from 'react-icons/ri';
import { FaCircleCheck } from "react-icons/fa6";

interface TextFieldProps {
    strKey: string
    value: string
    onCopy?: () => void;
    placeholder?: string;

  }
const TextField : React.FC<TextFieldProps> = ({strKey, value, placeholder=''}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isCopied, setIsCopied] = useState(false)
    const handleCopyClick = () => {
        if (inputRef.current) {
          navigator.clipboard
            .writeText(value)
            .then(() => {
              setIsCopied(true);
              setTimeout(function () {
                setIsCopied(false)
              }, 3000);
            })
            .catch((err) => {
              console.log(err.message);
            });
        }
      };

    return (
        <div className="my-4 ">
        <label className='mb-1 text-white text-sm'>{strKey}</label>
        <div className="relative">
        <input
        required
        type="text"
        value={value}
        placeholder={placeholder}
        className="border border-neutral-700 rounded-md w-full text-white pl-3 py-3 mt-1 pr-8 bg-neutral-900"
        ref={inputRef}
      />
      <button
        onClick={handleCopyClick}
        className="absolute inset-y-0  right-0 flex  items-center px-3 text-neutral-400 hover:text-white focus:outline-none"
      >
        {isCopied? <FaCircleCheck/> : <RiFileCopy2Line /> }
      </button>
        </div>
        
    </div>
    )
}

export default TextField