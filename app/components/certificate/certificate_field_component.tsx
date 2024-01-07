import { CertificateField } from '@/util/next_models/certificate_field';
import React, { useEffect } from 'react';
import { FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';

type CertificateFieldProps = {
    field: CertificateField;
    isSelected: boolean
    onVisible: (id: string, isVisible: boolean) => void;
    onDelete: (id: string) => void;
    onEditKey: (id: string, newKey: string) => void;
    onEditValue: (id: string, newValue: string) => void;
    setValidity: (id: string, isValid: boolean) => void; // Menambahkan properti setValidity
};

const CertificateFieldComponent: React.FC<CertificateFieldProps> = ({
    field,
    isSelected,
    onVisible,
    onDelete,
    onEditKey,
    onEditValue,
    setValidity
}) => {
    const handleVisibleClick = () => {
        onVisible(field.id, !field.isVisible);
    };

    const handleDeleteClick = () => {
        onDelete(field.id);
    };

    const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onEditKey(field.id, event.target.value);
        
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onEditValue(field.id, event.target.value);
        
    };

    useEffect(()=>{
        if(field.key.trim().length == 0){
            setValidity(field.id, false)
        }
        else if(field.value.trim().length == 0){
            setValidity(field.id, false)
        }
        else {
            setValidity(field.id, true)
        }

    },[field.key, field.value])

    return (
        <div className={`my-2 flex flex-col items-start mb-2 bg-black text-white py-2 px-4 rounded-md ${field.isValid || !field.isData ? '' : 'border-2 border-red-500'}`}>
            <div className='w-full flex items-center justify-end p-2'>
                <div className='px-2 py-1 flex items-center justify-center rounded-md bg-blue-700'>
                    <h1 className='text-xs text-white'>
                        {field.isData? 'Data' : 'Non Data'}
                    </h1>
                </div>
            </div>
            {
                field.isData && <div className="flex flex-col mb-2 w-full">
                <label className="mb-1 text-xs">Key</label>
                <input
                    type="text"
                    placeholder='Enter a key'
                    value={field.key}
                    onChange={handleKeyChange}
                    className={`bg-gray-800 text-white rounded-md py-2 text-sm px-2 focus:outline-none`}
                />
            </div>
            }
            
            <div className="flex flex-col mb-2 w-full">
                <label className="mb-1 text-xs">Value</label>
                <input
                    type="text"
                    placeholder='Enter a value'
                    value={field.value}
                    onChange={handleValueChange}
                    className={`bg-gray-800 text-white rounded-md py-2 text-sm px-2 focus:outline-none`}
                />
            </div>
            {/* Menampilkan ikon mata (eye) atau mata tertutup (eye-slash) berdasarkan isVisible */}
            <div className='flex w-full items-center space-x-4 mt-2'>
                {field.isVisible ? (
                    <FaEye onClick={handleVisibleClick} className="text-white cursor-pointer hover:text-blue-600" />
                ) : (
                    <FaEyeSlash onClick={handleVisibleClick} className="text-white cursor-pointer hover:text-blue-600" />
                )}
                <FaTrash onClick={handleDeleteClick} className="text-red-500 cursor-pointer hover:text-red-600" />
            </div>
        </div>
    );
};

export default CertificateFieldComponent;
