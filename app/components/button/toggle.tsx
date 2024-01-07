'use client'

import { useState } from "react"
interface FieldProps {
    name: string;
    callback: () => void;
  }
  
interface ToggleComponentProps {
    field1: FieldProps;
    field2: FieldProps;
}

const Toggle :  React.FC<ToggleComponentProps> = ({field1, field2}) => {
    const [activeField, setActiveField] = useState<string>(field1.name);
    return (
        <div className="p-2 bg-slate-800 flex space-x-2 rounded-md text-sm">
        <button onClick={()=>{
            field1.callback()
            setActiveField(field1.name)
        }} className={`px-3 py-1 w-1/2 rounded-md flex items-center justify-center
        text-center ${activeField == field1.name? 'bg-teal-900' : 'bg-gray-900'}`}><h1>{field1.name}</h1></button>
        <button onClick={()=> {
            field2.callback()
            setActiveField(field2.name)
        }} className={`px-3 py-1 w-1/2 rounded-md flex items-center justify-center
        text-center ${activeField == field2.name? 'bg-teal-900' : 'bg-gray-900'}`}><h1>{field2.name}</h1></button>
        </div>
    );

}

export {Toggle}