'use client'

import { useState } from "react";
import { AiFillCloseCircle, AiFillDashboard, AiFillEdit, AiFillSave, AiOutlineLogout } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { HiBars2 } from "react-icons/hi2";
import { IoIosAdd, IoIosCheckmarkCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

type Route = {
    icon: React.ComponentType<any>;
    route: string;
};

interface createCertificateNavProps {
    title: string,
    onSubmit: (currentTitle : string) => void;
    onSaveCertificate: () => void;

  }
const CreateCertificateNav: React.FC<createCertificateNavProps> = ({title, onSubmit, onSaveCertificate })=> {
    let selectedRoutes: Record<string, Route> = 
    {
        
        
        'Back to Dashboard': {
            'icon': AiFillDashboard,
            'route': '/dashboard/'
        },

        'Create': {
            'icon': AiFillSave,
            'route': '/save'
        },
        

    };
    const [isBarActive, setBarActive] = useState(false);
    const [inputValue, setInputValue] = useState(title);
    const toggleNavbar = () =>{
        setBarActive(!isBarActive)
    }

    const [isEdit, setIsEdit] = useState(false)

    return (
        <div className="fixed top-0 left-0 z-20 w-screen flex items-center bg-slate-950">
            <div className=" relative z-20 bg-slate-950 w-full max-w-7xl mx-auto px-4 flex flex-col  items-center">
                <div className="bg-slate-950 w-full z-20 relative flex items-center py-6 px-4">
                    <div className="relative  flex items-center justify-center mr-2">
                        {
                            !isEdit? <h1 className="text-lg text-white font-semibold mr-2 line-clamp-1 py-2">{title}</h1> : 
                            <input
                                type="text"
                                name=""
                                value={inputValue}
                                onChange={(event)=>{
                                    setInputValue(event.target.value)
                                }}
                                className="bg-black text-lg text-white rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Teks Keren Gaya Dark"
                            />
                        }
                        {!isEdit ? (
                            <AiFillEdit size={20} onClick={() => 
                            setIsEdit(true)
                            } className="cursor-pointer text-white ml-4" />
                        ) : (
                            <IoIosCheckmarkCircle size={20} onClick={() => {
                                onSubmit(inputValue)
                                setIsEdit(false)
                            }} className="cursor-pointer text-white ml-2" />
                        )}
                
                    </div>
                    <div
                        className="ml-auto h-8 w-8 flex items-center justify-center cursor-pointer md:hidden"
                        onClick={toggleNavbar}
                    >
                        {!isBarActive?  <HiBars2 onClick={toggleNavbar} size={24} className="ml-2" color="white" /> : <AiFillCloseCircle onClick={toggleNavbar} size={24} className="ml-2" color="white" /> }
                    </div>
                    <div className="ml-auto md:flex items-center  hidden">
                    {
                        Object.keys(selectedRoutes).map(key => {
                            const { icon: Icon, route } = selectedRoutes[key];
                            if(route == '/save'){
                                return <button key={key} onClick={()=>{
                                    onSaveCertificate()
                                }} className="ml-12 flex items-center space-x-2">
                                    <h1 className="text-sm text-gray-400 hover:text-white font-bold">{key}</h1>
                                </button>
                            }
                            return (
                                <a key={key} href={route} className="ml-12 flex items-center space-x-2">
                                    <h1 className="text-sm text-gray-400 hover:text-white font-bold">{key}</h1>
                                </a>
                            );
                        })
                    }
                </div>
                </div>
                <div className={`absolute top-20 grid gap-2 w-screen max-w-5xl bg-slate-950 py-4 px-4 md:hidden transform transition-transform duration-300 ${isBarActive ? 'translate-y-0' : '-translate-y-[28rem]'}`}>
                    {
                        Object.keys(selectedRoutes).map((key)=>{
                            const { icon: Icon, route } = selectedRoutes[key];
                            if(route == '/save'){
                                return (
                                    <div
                                    key={route}
                                    className="mt-2 w-full p-[0.08rem] rounded-xl bg-gradient-to-tr from-slate-800 via-slate-950 to-slate-700"
                                    >
                                        <button
                                            className={
                                            "flex items-center justify-between w-full p-5 rounded-xl hover:bg-slate-900 bg-slate-950"
                                            }
                                            onClick={()=>{
                                                onSaveCertificate();
                                            }}
                                        >
                                            <span className="flex gap-1 text-base">{key}</span>
                                            <Icon className="text-lg" />
                                        </button>
                                </div>
                                )
                            }
                            return (
                                <div
                                    key={route}
                                    className="mt-2 w-full p-[0.08rem] rounded-xl bg-gradient-to-tr from-slate-800 via-slate-950 to-slate-700"
                                    >
                                        <a
                                            className={
                                            "flex items-center justify-between w-full p-5 rounded-xl hover:bg-slate-900 bg-slate-950"
                                            }
                                            href={route}
                                        >
                                            <span className="flex gap-1 text-base">{key}</span>
                                            <Icon className="text-lg" />
                                        </a>
                                </div>
                            )
                        })
                    }
                    
                </div>
                
            </div>
        </div>   
    );
}

export default CreateCertificateNav