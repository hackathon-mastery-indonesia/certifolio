'use client'
import { LoginNav } from '../components/partials/navbar';
import {FaWallet} from 'react-icons/fa'
import Plan from '../components/plan';
import { planProps } from '../components/plan';
import Head from 'next/head';
import CertificateCard from '../components/certificate_card';
import {IMG_LINK_DUMMY, IMG_LINK_DUMMY_2} from '../dummy/img_link';
import { IoMdAdd } from "react-icons/io";
import { Alert, Snackbar, sna } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import { RootState } from '@/util/redux/store/store';
import { useAppSelector } from '@/util/redux/hooks/hooks';



export default function Page() {

    const params = new URLSearchParams(window.location.search);
    const welcome = params.get('welcome');
    const auth = useAppSelector((state: RootState)=> state.auth);

    
    const [open, setOpen] = useState(false);

    useEffect(()=> {
        if(!welcome){
            return;
        }
        setOpen(true)



    }, [welcome]);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };

    let isEmpty = false;
    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <LoginNav />
            <Head>
                <title>Dashboard</title>
            </Head>
            <Snackbar open={open} autoHideDuration={6000}  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity="success" onClose={handleClose}>
          Hello, {auth.username || 'Anonim'}
        </Alert>
      </Snackbar>
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-6  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">
            <div className=" flex justify-between mt-4 w-full b items-center px-4 py-2">
                <h1 className="text-white text-xl font-semibold">Your Certificate</h1>
                <button
                className="flex text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
            >
                <IoMdAdd className="mr-2"/>
                Buat Sertifikat
            </button>
                </div>
                {isEmpty && 
                <div className='flex items-center grow '>
                    <h1 className='text-sm text-white font-semibold lg:text-base'>Create a new one</h1>
                </div>
                }
                { !isEmpty &&
                    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
                    <CertificateCard name={'ORIGINAL KING OF DESTRUCTION DEMON KING CERTIFICATE'} imageUrl={`${IMG_LINK_DUMMY}`} 
                    certificateId={'65489201838921'} />
                    <CertificateCard name={'DEMON KING CERTIFICATE'} imageUrl={`${IMG_LINK_DUMMY_2}`} 
                    certificateId={'65489201838921'} />
                    <CertificateCard name={'DEMON KING CERTIFICATE'} imageUrl={`${IMG_LINK_DUMMY}`} 
                    certificateId={'65489201838921'} />
                    <CertificateCard name={'DEMON KING CERTIFICATE'} imageUrl={`${IMG_LINK_DUMMY}`} 
                    certificateId={'65489201838921'} />
                    </div>
                }
            </div>
            
        </main>
    );
}