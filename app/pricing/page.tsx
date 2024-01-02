'use client'
import Head from 'next/head';
import { LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa'
import Plan from '../components/plan';
import { planProps } from '../components/plan';

export default function Page() {
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