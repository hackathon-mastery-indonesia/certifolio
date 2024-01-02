'use client'
import Head from 'next/head';
import { useState } from 'react';
import { RegisterNav } from '../components/partials/navbar';
import {FaWallet, FaArrowRight} from 'react-icons/fa';
import Plan from '../components/plan';
import { planProps } from '../components/plan';

export default function Page() {
    const [isUserBoxActive, setUserBoxActive] = useState(true);
    const [isSelectingPlan, setSelectingPlan] = useState(false);
    const [currentSelectedPlan,setCurrentSelectedPlan] = useState('');

    const toggleBox = () => {
        setUserBoxActive(!isUserBoxActive)
    }


    return (
        <main className={`relative flex bg-y-repeat bg-gradient-to-b from-slate-950  to-slate-900 via-gray-950 min-h-screen max-h-[100vh] flex-col items-center
         justify-between px-6 pt-6 pb-6 md:pb-36`}>
            <RegisterNav />
            <Head>
                <title>Register -- Certifolio</title>
            </Head>
            <div className="my-auto max-w-5xl flex mx-auto h-80  ">
                <div className='mb-6'>
                <div className=" flex flex-col items-center rounded-lg p-4 md:min-w-96">
                    <div className="mb-4 flex  justify-center items-center  max-w-96 mx-auto">
                            {/* Toggle switch untuk opsi "As Client" */}
                            <div className='p-2 w-full flex items-center justify-center space-x-2'>
                                <button onClick={()=>{
                                    setUserBoxActive(true);
                                    setSelectingPlan(false);
                                }} className={`grow flex-1 flex items-center justify-center text-center p-2 rounded-3xl ${isUserBoxActive? 'bg-indigo-900': 'bg-gray-900'}`}>
                                    <h1>Individual</h1>
                                </button>
                                <button onClick={()=>{
                                    setUserBoxActive(false);
                                }} className={`grow flex-1 flex items-center justify-center text-center p-2 rounded-3xl ${!isUserBoxActive? 'bg-indigo-900': 'bg-gray-900'}`}>
                                    <h1>Organization</h1>
                                </button>
                            </div>
                        </div>
                        
                    {isUserBoxActive && <form className='w-full ' method='POST' action={'/api/register/'}>
                        <div className='hidden'>
                                <input type="text" readOnly value={'user'} name='type' />
                        </div>
                        <div className="mb-4">
                            <input required type="text" id="username" name="username" placeholder='Pick an Username' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <div className="mb-4">
                            <input required type="email" id="email" name="email" placeholder='Your Email' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <div className="mb-4">
                            <input required type="text" id="fullname" name="fullname" placeholder='Your Fullname' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <button type="submit" className="bg-white w-full justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
                           
                            <h1 className='ml-3'>Register</h1>
                        </button>
                    </form>}
                    {!isUserBoxActive && !isSelectingPlan && <form className='w-full ' method='POST' action={'/api/register/'}>
                    <div className='hidden'>
                                <input type="text" readOnly value={'organization'} name='type' />
                        </div>
                        <div className="mb-4">
                            <input required type="text" id="username" name="username" placeholder='Pick an Username' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <div className="mb-4">
                            <input required type="email" id="email" name="email" placeholder='Your Organization Email' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <div className="mb-4">
                            <input required type="text" id="fullname" name="fullname" placeholder='Your Organization Name' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>
                        <button type='submit'  className="bg-white w-full justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
                           
                            <h1 className='ml-3'>Register</h1>
                        </button>
                    </form>}

                    {!isUserBoxActive && isSelectingPlan && 
                    <div className='w-full mt-6 z-0'>
                    <div className='grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-8'>
                        {planProps.map((plan, index)=>{
                            const {name, price, features, backgroundColor} = plan;
                            return <Plan key={index} name={name} ourPick={index == 1? true : false}
                             price={price} features={features} backgroundColor={backgroundColor}
                             currentSelectedPlan={currentSelectedPlan}
                             onSelect={()=>{
                                if(name == currentSelectedPlan){
                                    setCurrentSelectedPlan('')
                                }
                                else{
                                    setCurrentSelectedPlan(name)
                                }
                             }} />
                        })}
                    </div>
                    {
                        currentSelectedPlan != '' && <button  className="bg-white w-full max-w-96 mx-auto mt-6 justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
                        <h1 className='ml-3'>Register</h1>
                    </button>
                    }
                    </div>

                    }


                    
                </div>
                </div>
                
            </div>
            {!isSelectingPlan && <footer className="mt-auto pt-8 border-t border-gray-600 w-screen md:hidden">
            <div className="text-center">
                <p className="mb-4">{`Already Have an account?`} <a href="/login/" className="text-blue-500">Login</a></p>
            </div>
            </footer>}
            
        </main>
    );
}