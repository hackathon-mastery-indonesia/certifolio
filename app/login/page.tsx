"use client";
import Head from 'next/head';
import { LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa';
import { AuthProvider, AuthContext } from '../context/authContext';
import React, { createContext, useState, useContext, useEffect } from 'react';
import LoginButton  from '../components/loginButton';

export default function Page() {

    return (
        
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-between p-6">
            <LoginNav />
            <Head>
                <title>Login -- Certifolio</title>
            </Head>
            <div className="my-auto max-w-5xl flex mx-auto   ">
                <div className=" rounded-lg p-8 md:min-w-96">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">Login to Certifolio</h2>
                    <AuthProvider>
                        <LoginButton />
                    </AuthProvider>
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
