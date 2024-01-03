'use client'
import Image from "next/image";
import { useState } from "react";
import { HiBars2 } from 'react-icons/hi2';
import {AiFillCloseCircle, AiFillDashboard, AiOutlineLogout} from 'react-icons/ai';
import { FaQuestionCircle, FaTag, FaArrowRight, FaHome} from 'react-icons/fa';
import { useAppSelector, useAppDispatch} from '../../../util/redux/hooks/hooks';
import { RootState, AppDispatch } from "../../../util/redux/store/store";

import { usePathname } from 'next/navigation';

import React from 'react';
type Route = {
    icon: React.ComponentType<any>;
    route: string;
};

const homeRoutes: Record<string, Route> = {
    'About': {
        'icon': FaQuestionCircle,
        'route': '/about/'
    },
    'Pricing': {
        'icon': FaTag,
        'route': '/pricing/'
    },
    'Login': {
        'icon': FaArrowRight,
        'route': '/login/'
    },
};
const pricingRoutes: Record<string, Route> = {
    'Home': {
        'icon': FaHome,
        'route': '/home/'
    },
    'About': {
        'icon': FaQuestionCircle,
        'route': '/about/'
    },
    'Login': {
        'icon': FaArrowRight,
        'route': '/login/'
    },
};

const loginRoutes: Record<string, Route> = {
    'Home': {
        'icon': FaHome,
        'route': '/'
    },
    'About': {
        'icon': FaQuestionCircle,
        'route': '/about/'
    },
    'Register': {
        'icon': FaArrowRight,
        'route': '/register/'
    },
};

const registerRoutes: Record<string, Route> = {
    'Home': {
        'icon': FaHome,
        'route': '/'
    },
    'About': {
        'icon': FaQuestionCircle,
        'route': '/about/'
    },
    'Login': {
        'icon': FaArrowRight,
        'route': '/login/'
    },
};

interface SituationalNavProps {
    selectedRoutes: Record<string, Route>;
  }
const SituationalNav: React.FC<SituationalNavProps> = ({selectedRoutes })=> {
    const [isBarActive, setBarActive] = useState(false);
    const toggleNavbar = () =>{
        setBarActive(!isBarActive)
    }
    return (
        <div className="fixed top-0 left-0 z-20 w-screen flex items-center bg-slate-950">
            <div className=" relative z-20 bg-slate-950 w-full max-w-5xl mx-auto px-4 flex flex-col  items-center">
                <div className="bg-slate-950 w-full z-20 relative flex items-center py-2 px-4">
                    <div className="relative h-12 w-36 md:w-40 flex items-center justify-center ">
                        <Image
                            alt='logo'
                            src='/logo.svg'
                            layout='fill'
                            objectFit='cover'
                        />
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
                            return (
                                <a key={key} href={route} className="ml-12 flex items-center space-x-2">
                                    <h1 className="text-sm text-gray-400 hover:text-white font-bold">{key}</h1>
                                </a>
                            );
                        })
                    }
                </div>
                </div>
                <div className={`absolute top-12 grid gap-2 w-screen max-w-5xl bg-slate-950 py-4 px-4 md:hidden transform transition-transform duration-300 ${isBarActive ? 'translate-y-0' : '-translate-y-[28rem]'}`}>
                    {
                        Object.keys(selectedRoutes).map((key)=>{
                            const { icon: Icon, route } = selectedRoutes[key];
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

const CustomizableNav = () => {

    const auth = useAppSelector((state: RootState)=> state.auth);
    console.log(auth);
    const pathname = usePathname();
    
    let routes: Record<string, Route> = 
    {
        'Home': {
            'icon': FaHome,
            'route': '/'
        },
        'About': {
            'icon': FaQuestionCircle,
            'route': '/about/'
        },
        'Pricing': {
            'icon': FaTag,
            'route': '/pricing/'
        },
        'Dashboard': {
            'icon': AiFillDashboard,
            'route': '/dashboard/'
        },
        'Logout': {
            'icon': AiOutlineLogout,
            'route': '/logout'
        },
        'Login': {
            'icon': FaArrowRight,
            'route': '/login/'
        }

    };
    /* HOME */
    if(pathname == '/'){
        if(auth.authClient != null){
            //delete routes['Logout']
            delete routes['Home']
            delete routes['Login']
            delete routes['Pricing']
        }
        else {
            delete routes['Dashboard']
            delete routes ['Logout']
            delete routes['Home']
        }
    }

    else if(pathname == '/login'){
        if(auth.authClient != null){
            //delete routes['Logout']
            delete routes['Logout']
            delete routes['Login']
            delete routes['Pricing']
        }
        else {
            delete routes['Logout']
            delete routes ['Login']
            delete routes['Dashboard']
        }
    }
    else if( /^\/dashboard(?:\?.*)?$/.test(pathname)){
        delete routes ['Login']
        delete routes['Dashboard']
        delete routes['Pricing']
    }
    return <SituationalNav selectedRoutes={routes}/>;
}



const LoginNav = () => {
    return <SituationalNav selectedRoutes={loginRoutes}/>
}
const HomeNav = () => {
    return <SituationalNav selectedRoutes={homeRoutes}/>
}


const RegisterNav = () => {
    return <SituationalNav selectedRoutes={registerRoutes}/>
}
const PricingNav = () => {
    return <SituationalNav selectedRoutes={pricingRoutes}/>
}

export {
    LoginNav,
    HomeNav,
    RegisterNav,
    CustomizableNav
}
