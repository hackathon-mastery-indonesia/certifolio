'use client'
import { useAppDispatch, useAppSelector } from '@/util/redux/hooks/hooks';
import {CustomizableNav} from './components/partials/navbar'
import Head from 'next/head'
import { RootState } from '@/util/redux/store/store';
import { useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { handleAuthenticated } from '@/util/function/auth_util';
import { login } from '@/util/redux/features/auth_slice';

export default function Home() {

  const auth = useAppSelector((state: RootState)=> state.auth);
  console.log('BISALAHHH')
  console.log(auth);
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
    <main className="  flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-between p-24">
      <CustomizableNav/>
      <Head>
            <title>Certifolio: Secure platform for creating and destributing NFT certificates</title>
        </Head>
      <div className=' my-auto max-w-5xl flex mx-auto'>
      <Header/>
      </div>
      
    </main>
  )
}

const Header = () => {
  return (
    <header className=" text-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center text-indigo-400">Blockchain Empowered Certificates Platform</h1>
        <p className="text-lg text-center">
        Certifolio provides a secure platform for creating and distributing NFT certificates,
        ensuring authenticity, and anti-counterfeiting measures.
        </p>
        <button className="bg-white text-blue-900 font-bold px-6 py-2 mt-6 rounded-md shadow-md hover:bg-indigo-300 transition duration-300">
          Create a New Certificate
        </button>
      </div>
    </header>
  );
};
