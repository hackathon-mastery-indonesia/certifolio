'use client'
import { Bundle } from '@/util/next_models/bundle';
import React from 'react';

interface BundleCardProps {
  bundle: Bundle
  onClick?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle,  onClick }) => {
  return (
    <div className="bg-slate-900 shadow-lg rounded-lg bg-opacity-40 overflow-hidden m-4 min-w-sm min-w-md min-w-xl" onClick={onClick}>
      <div className="px-4 py-2 flex flex-col w-full h-full">
        <h2 className="text-white text-base font-bold mb-2 xbg-black mr-2 xbg-opacity-75 px-2 py-1 rounded line-clamp-2">{bundle.name}</h2>
        
        <p className="text-gray-400 text-sm mt-4">{bundle.certificateList.length} {bundle.certificateList.length == 1? 'certificate' : 'certificates'}</p>
      </div>
    </div>
  );
};

export default BundleCard;