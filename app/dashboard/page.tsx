'use client'
import { CustomizableNav, LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa'
import Plan from '../components/plan/plan';
import { planProps } from '../components/plan/plan';
import Head from 'next/head';
import CertificateCard from '../components/certificate/certificate_card';
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
import { Toggle } from '../components/button/toggle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bundle } from '@/util/next_models/bundle';
import { v4 as uuidv4 } from 'uuid';
import BundleCard from '../components/bundle/bundle_card';

export default function Page() {

    
    const auth = useAppSelector((state: RootState)=> state.auth);
    const dispatch = useAppDispatch();
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [bundles, setBundles] = useState<Bundle[]>([])
    const [selectedSection, setSelectedSection] = useState<string>('Certificate')

    const handleCreateCertificate = () => {
        window.location.href = '/create-certificate/';
    }
    const handleCreateBundle = () => {
        window.location.href = '/add-bundle/';
    }
    const initialize = async () => {
        // Your initialization logic here
        
        if(auth.username != null){
            const authClientTemp = await AuthClient.create();
            //console.log(authClientTemp);
            if(await authClientTemp.isAuthenticated()){
                const user = await handleAuthenticated(authClientTemp, auth.username);
                dispatch(login(user))
            }
            else {
                window.location.href = '/login?sessionExpired=true'
            } 
        }
    };


    useEffect(()=>{
        initialize();

    }, [])

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const welcome = params.get('welcome');
        if(auth.username != null && welcome){
            toast.success(`Hi, Welcome ${auth.username}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
              });
        }
    },[])

    useEffect(()=>{
        const fetchBundle = async () => {
            try {
                if(auth.username != null){
                    const lst = await auth.actor?.getBundleOwned(auth.identity.getPrincipal()); //dapatkan list bundel milik saya
                    const bundleLst : Bundle[] = [] 
                    for(const key of lst){
                        const getBundleMetadata = await auth.actor?.getBundleMetadata(parseInt(key))
                        const getBundleName = await auth.actor?.getBundleName(parseInt(key))
                        const bundleObj : Bundle = {
                            name:getBundleName[0],
                            key:uuidv4(),
                            certificateList:[]
                        }
                        for(const data of getBundleMetadata){
                            const  bundleData = JSON.parse(data.uri);
                            const publisher = data.publisher;
                            const certificateId = data.certificateId
                            const name = data.name
                            const id = data.id
                            const certificate : Certificate = {
                                data: bundleData,
                                publisher: publisher,
                                certificateId: certificateId,
                                name: name,
                                id: id
                            }
                            bundleObj.certificateList.push(certificate)
                        }
                        bundleLst.push(bundleObj)
                    }
                    setBundles(bundleLst)

                }
            } catch (error) {
                initialize()
            }
        }
        fetchBundle()
    }, [auth])

    useEffect(()=>{
        const fetch = async () => {
            try {
                if(auth.username != null){
                    console.log('watashi ambil!')
                    const lst = await auth.actor?.getOwnedMetadata(auth.identity.getPrincipal());
                    const certificateLst : Certificate[] = []
                   // console.log(lst)
                    for(const key of lst){
                        const data = JSON.parse(key.uri)
                        const publisher = key.publisher
                        const certificateId = key.certificateId
                        const name = key.name
                        const id = key.id
                        const certificate : Certificate = {
                            data: data,
                            publisher: publisher,
                            certificateId: certificateId,
                            name: name,
                            id: id
                        }
                        certificateLst.push(certificate)
                      //  setCertificates(prev => [certificate,...prev])
                        console.log(key.id)
                    }
                    setCertificates(certificateLst)

                }
            } catch (error) {
               // console.log(error)
                initialize()

            }
        }
        fetch()

    },[auth])



    useEffect(()=>{
        if(auth.username == null){
            window.location.href = "/login/"
        }
    },[auth.username])

   

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <CustomizableNav />
            <ToastContainer />
            <Head>
                <title>Dashboard</title>
            </Head>
            
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-6  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">
            <div className='flex w-full items-center justify-center my-4'>
                <Toggle field1={{name: 'Certificate', callback: ()=>{
                    setSelectedSection('Certificate')
                }}} 
                field2={{name: 'Bundle', callback: ()=> {
                    setSelectedSection('Bundle')
                }}}/>
            </div>

            { selectedSection == 'Certificate' && <div className=" flex justify-between mt-4 w-full b items-center px-4 py-2">
                <h1 className="text-white text-xl font-semibold">Your Certificate</h1>
                <button
                onClick={handleCreateCertificate}
                className="flex text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
            >
                <IoMdAdd className="mr-2"/>
                Add certificate
            </button>
                </div>  }

            {
                selectedSection == 'Bundle' && <div className=" flex justify-between mt-4 w-full b items-center px-4 py-2">
                <h1 className="text-white text-xl font-semibold">Your Bundle</h1>
                <button
                onClick={handleCreateBundle}
                className="flex text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
            >
                <IoMdAdd className="mr-2"/>
                Add Bundle
            </button>
                </div>
            }
            
            
                {selectedSection == 'Certificate' && certificates.length == 0 && 
                <div className='flex items-center grow w-full '>
                    <h1 className='text-sm text-white font-semibold lg:text-base'>There are no certificates here</h1>
                </div>
                }
                {selectedSection == 'Certificate' && certificates.length != 0 &&
                    <div className='grid lg:grid-cols-3 w-full md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
                        {certificates.map((c)=>{
                            return <CertificateCard key={c.certificateId} onClick={()=>{}} name={c.data.title? c.data.title as string : 'No title'}  certificateId={c.certificateId} imageUrl={`${c.data.image}`}/>
                        })}
                    </div>
                }
                 {selectedSection == 'Bundle' && certificates.length == 0 && 
                <div className='flex items-center grow w-full '>
                    <h1 className='text-sm text-white font-semibold lg:text-base'>There are no certificates here</h1>
                </div>
                }
                {selectedSection == 'Bundle' && certificates.length != 0 &&
                    <div className='grid w-full lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
                        {bundles.map((c)=>{
                            return <BundleCard key={c.key} bundle={c} onClick={()=>{}} />
                        })}
                    </div>
                }
            </div>
        </main>
    );
}