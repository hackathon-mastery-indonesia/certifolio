import React from 'react';

interface PlanProps {
  name: string;
  price: string;
  features: string[];
  onSelect: () => void;
  backgroundColor: string;
  currentSelectedPlan: string;
  ourPick:boolean
}

const planProps = [
  {
    name: "Starter Package",
    price: "FREE",
    features: ['Get 10 NFT certificate slots'], // Mendapatkan 100 slot sertifikat NFT
    backgroundColor: "blue-950" 
  },
  {
    name: "Basic Package",
    price: "$1.99",
    features: ['Get 100 NFT certificate slots'], // Mendapatkan 100 slot sertifikat NFT
    backgroundColor: "indigo-950" 
  },
  {
    name: "Standard Package",
    price: "$4.99",
    features: ['Get 500 NFT certificate slots'], // Mendapatkan 500 slot sertifikat NFT
    backgroundColor: "violet-950" 
  },
  {
    name: "Premium Package",
    price: "$9.99",
    features: ['Get 1200 NFT certificate slots'], // Mendapatkan 1200 slot sertifikat NFT
    backgroundColor: "purple-950" 
  },
];

const Plan: React.FC<PlanProps> = ({
  name,
  price,
  features,
  onSelect,
  backgroundColor,
  currentSelectedPlan,
  ourPick=false
}) => {
  

  return (
    <div  className={`z-0 relative flex flex-col items-center h-64 p-4 border-white border-2 rounded-md bg-gradient-to-r  
    ${'from-'+backgroundColor}  to-yellow-900 via-slate-800`}>
      {ourPick && <div className='flex w-full items-center justify-center absolute -top-4 '>
       <button className='rounded-full border-white bg-white border text-black text-center px-2 py-1 text-xs font-bold'>Our Pick</button>
      </div> }
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-200 mt-2 mb-4">{price}</p>
      <ul className="list-disc ml-6">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-300">{feature}</li>
        ))}
      </ul>
      <div className='mt-auto'>
      <button
        onClick={onSelect}
        className={`${currentSelectedPlan == name? 'bg-white text-black' : 'text-white border-2 border-white '}   font-semibold px-4 py-2 rounded-md hover:bg-indigo-300`}
      >
        {currentSelectedPlan == name? 'Selected' : 'Select'}
      </button>
      </div>
    </div>
  );
};

export {planProps}
export default Plan;