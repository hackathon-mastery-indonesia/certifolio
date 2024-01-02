"use client";
import Head from 'next/head';
import { LoginNav } from './partials/navbar';
import {FaWallet} from 'react-icons/fa';
import { AuthProvider, AuthContext } from '../context/authContext';
import React, { createContext, useState, useContext, useEffect } from 'react';

export default function LoginButton() {
    
    const konteks = useContext(AuthContext);
    
    const handleLogin = async () => {
        console.log(konteks);
        await konteks?.login();
        console.log(konteks?.identity.getPrincipal().toString());
    }
    return (
        <button onClick={handleLogin} className="bg-white w-full justify-center flex items-center text-blue-900 font-bold rounded-md px-4 py-3 hover:bg-indigo-300 transition duration-300">
            <FaWallet size={24} />
            <h1 className='ml-3'>Login with Your Wallet</h1>
        </button>
    );
}
