'use client'
import Head from 'next/head';
import { LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa'
import Plan from '../components/plan';
import { planProps } from '../components/plan';
import { useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useAppDispatch, useAppSelector } from '@/util/redux/hooks/hooks';
import { RootState } from '@/util/redux/store/store';
import { handleAuthenticated } from '@/util/function/auth_util';
import { login } from '@/util/redux/features/auth_slice';

export default function Page() {
    const auth = useAppSelector((state: RootState)=> state.auth);
    const dispatch = useAppDispatch();

    useEffect(()=>{
        const initialize = async () => {
            // Your initialization logic here
            
            if(auth.username != null){
                console.log('HERE')
                const authClientTemp = await AuthClient.create();

                //console.log(authClientTemp);
                if(await authClientTemp.isAuthenticated()){
                    const user = await handleAuthenticated(authClientTemp, auth.username);
                    dispatch(login(user))

                }  
            }
        };
        initialize();

    }, [])
    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-between px-6 pt-20 md:pt-12 ">
            <LoginNav />
            <Head>
                <title>Pricing</title>
            </Head>
            <div className="my-auto max-w-5xl flex mx-auto flex-col items-center  ">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-white text-center">Certificates Pricing</h2>
                {
                    <div className='grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-8'>
                    {planProps.map((plan, index)=>{
                        const {name, price, features, backgroundColor} = plan;
                        return <Plan key={index} name={name} ourPick={index == 1? true : false}
                         price={price} features={features} backgroundColor={backgroundColor}
                         currentSelectedPlan={''}
                         onSelect={()=>{
                            
                         }} />
                    })}
                </div>
                }
            </div>
            
        </main>
    );
}