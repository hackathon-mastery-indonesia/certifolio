'use client'
import LoadingSpinner from '@/app/components/loading/loading';
import TextField from '@/app/components/textfield/textfield';
import { handleAuthenticated } from '@/util/function/auth_util';
import { Certificate } from '@/util/next_models/certificate';
import { login } from '@/util/redux/features/auth_slice';
import { useAppDispatch, useAppSelector } from '@/util/redux/hooks/hooks';
import { RootState } from '@/util/redux/store/store';
import { AuthClient } from '@dfinity/auth-client';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const DetailPage = ({ params }: { params: { id: string } }) => {

    const auth = useAppSelector((state: RootState)=> state.auth);
    const certificateNumId = params.id
    
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState<Certificate |null>(null);



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
        else{
            window.location.href = '/login'
        }
    };
    
    useEffect(()=>{
        initialize();
    }, [])

    useEffect(()=>{
        setLoading(true)
        const fetch = async () => {
            try {
                if(auth.username != null){
                    const res = await auth.actor?.getMetadata(parseInt(certificateNumId as string));
                    console.log(res, '--------HEHEHEHE----------------------')
                    const  bundleData = JSON.parse(res.uri);
                    const publisher = res.publisher;
                    const certificateId = res.certificateId
                    const name = res.name
                    const id = res.id
                    const certificate : Certificate = {
                        data: bundleData,
                        publisher: publisher,
                        certificateId: certificateId,
                        name: name,
                        id: id
                    }
                    setCertificate(certificate)
                    setLoading(false)

                }
                else {
                    window.location.href = '/login'
                }
            } catch (error) {
                initialize()
            }
        }
        fetch()
        
    },[auth])

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
           
            <ToastContainer />

            
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-6  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">

            {
                loading  && <LoadingSpinner/>
            }
            { !loading && certificate != null &&  
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grow w-full '>
                    <div className='col-span-1 lg:col-span-2 md: background  p-2'>
                        <div className='w-full flex flex-col items-center'>
                            <img src={certificate.data.image} className='w-full aspect-[10/7] rounded-lg'></img>
                        </div>
                        <TextField onCopy={()=>{}} strKey={'Title'} value= {!certificate.data.title? 'No title' : certificate.data.title}/>
                        <TextField onCopy={()=>{}} strKey={'Certificate Id'} value= {certificate.certificateId}/>
                        <TextField onCopy={()=>{}} strKey={'Publisher'} value= {certificate.publisher}/>
                    </div>
                    <div className='col-span-1 lg:col-span-3 xbg-green-500'>
                    </div>
                </div>
            }

                
               
            </div>
        </main>
    )
    
}

export default DetailPage