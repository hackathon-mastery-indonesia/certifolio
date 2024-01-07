'use client'
import React from 'react';

interface CertificateCardProps {
  name: string;
  imageUrl: string;
  certificateId: string;
  onClick?: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ name, imageUrl, certificateId, onClick }) => {
  return (
    <div className="bg-slate-900 shadow-lg rounded-lg bg-opacity-40 overflow-hidden m-4 min-w-sm min-w-md min-w-xl" onClick={onClick}>
      <div className="px-4 py-2 flex flex-col w-full h-full">
        <h2 className="text-white text-base font-bold mb-2 xbg-black xbg-opacity-75 px-2 py-1 rounded line-clamp-2">{name}</h2>
        <div className="mt-auto w-full rounded-lg mb-4 overflow-hidden">
          <img className='w-full h-auto bg-blue-400 rounded-lg' src={imageUrl}/>
          
        </div>
        <p className="text-gray-400 text-sm ">ID: {certificateId}</p>
      </div>
    </div>
  );
};

export default CertificateCard;


