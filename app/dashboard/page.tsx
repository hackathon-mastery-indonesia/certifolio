'use client'
import { CustomizableNav, LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa'
import Plan from '../components/plan';
import { planProps } from '../components/plan';
import Head from 'next/head';
import CertificateCard from '../components/certificate_card';
import {IMG_LINK_DUMMY, IMG_LINK_DUMMY_2} from '../dummy/img_link';
import { IoMdAdd } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import { RootState } from '@/util/redux/store/store';
import { useAppSelector, useAppDispatch } from '@/util/redux/hooks/hooks';
import { AuthClient } from '@dfinity/auth-client';
import { handleAuthenticated } from '@/util/function/auth_util';
import { login } from '../../util/redux/features/auth_slice';
import { Certificate } from '@/util/next_models/certificate';

export default function Page() {

    const params = new URLSearchParams(window.location.search);
    const welcome = params.get('welcome');
    const auth = useAppSelector((state: RootState)=> state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter()
    const [certificates, setCertificates] = useState<Certificate[]>([])

    const handleCreateCertificate = () => {
        window.location.href = '/create-certificate/';
    }
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

    useEffect(()=>{
        const fetch = async () => {
            try {
                if(auth.username){
                    console.log('watashi ambil!')
                    const lst = await auth.actor?.getOwnedMetadata(auth.identity.getPrincipal());
                    const certificateLst : Certificate[] = []
                   // console.log(lst)
                    for(const key of lst){
                        const data = JSON.parse(key.uri)
                        const publisher = key.publisher
                        const certificateId = key.certificateId
                        const name = key.name
                        const certificate : Certificate = {
                            data: data,
                            publisher: publisher,
                            certificateId: certificateId,
                            name: name
                        }
                        certificateLst.push(certificate)
                      //  setCertificates(prev => [certificate,...prev])
                        console.log(data)
                    }
                    setCertificates(certificateLst)

                }
            } catch (error) {
                console.log(error)
                initialize()

            }
        }
        fetch()

    },[])



    useEffect(()=>{
        if(auth.username == null){
            window.location.href = "/login/"
        }
    },[auth.username])

   

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <CustomizableNav />
            <Head>
                <title>Dashboard</title>
            </Head>
            
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-6  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">
            <div className=" flex justify-between mt-4 w-full b items-center px-4 py-2">
                <h1 className="text-white text-xl font-semibold">Your Certificate</h1>
                <button
                onClick={handleCreateCertificate}
                className="flex text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
            >
                <IoMdAdd className="mr-2"/>
                Add certificate
            </button>
                </div>
                {certificates.length == 0 && 
                <div className='flex items-center grow '>
                    <h1 className='text-sm text-white font-semibold lg:text-base'>There are no certificates here</h1>
                </div>
                }
                { certificates.length != 0 &&
                    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
                        {certificates.map((c)=>{
                            return <CertificateCard key={c.certificateId} name={c.data.title? c.data.title as string : 'No title'}  certificateId={c.certificateId} imageUrl={`${c.data.image}`}/>
                        })}
                    </div>
                }
            </div>
            
        </main>
    );
}