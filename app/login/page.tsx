"use client";
import Head from 'next/head';
import { CustomizableNav} from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa';
import { loginUser } from '../../util/function/auth_util';

import React, {  } from 'react';
import User from '../../util/next_models/user';
import {  useAppDispatch} from '../../util/redux/hooks/hooks';
import { login } from '../../util/redux/features/auth_slice';
import { useRouter } from 'next/navigation';

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const setupLogin = async () => {
        try {
            const res = await loginUser(
                 (user: User) => {
                    console.log(user)
                    console.log('HEREEE')
                    dispatch(login(user))
                }
            );
            if(res == "SUCCESS"){
                console.log('Sign In Confirmed');
               // router.push('/');
            }
            else {
                throw Error('LOGIN FAILED DUE TO CANISTER ERROR');
            }
            

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-between p-6">
            <CustomizableNav />
            <Head>
                <title>Login -- Certifolio</title>
            </Head>
            <div className="my-auto max-w-5xl flex mx-auto   ">
                <div className=" rounded-lg p-8 md:min-w-96">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">Login to Certifolio</h2>
                    <div className="mb-4">
                            <input required type="text" id="username" name="username" placeholder='Pick an Username' className="border border-neutral-700 rounded-md w-full text-white px-3 py-3 mt-1 bg-neutral-900" />
                        </div>

                    <button onClick={setupLogin} className="bg-white w-full justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
                        <FaWallet size={24} />
                        <h1 className='ml-3'>Add as sudo</h1>
                    </button>
                </div>
            </div>
            <footer className="mt-auto pt-8 border-t border-gray-600 w-screen md:hidden">
            <div className="text-center">
                <p className="mb-4">{`Don't have an account?`} <a href="/register/" className="text-blue-500">Register</a></p>
            </div>
            </footer>
        </main>
        
    );
}
