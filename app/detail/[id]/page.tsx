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
import 'react-toastify/dist/ReactToastify.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import TransferPopUp from '@/app/components/popup/transfer_popup';

type Information =  {
    key: string,
    information: string
}
const options : Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZoneName: 'short' 
  };
const DetailPage = ({ params }: { params: { id: string } }) => {

    const auth = useAppSelector((state: RootState)=> state.auth);
    const certificateNumId = params.id
    
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState<Certificate |null>(null);
    const [publisherName, setPublisherName] = useState<string>('Unknown');
    const [information, setInformation] = useState<Information[]>( []
    )
    /////////////////////////////////////////////////////////////////////////
    const [principal, setPrincipal] = useState<string>('');
    const [isTransferPopUpActive, setIsTransferPopUpActive] = useState(false);
    ///////////////////////////////////////////////////////////////////////

    useEffect(()=>{
        if(auth.username != null){
            try {
                setPrincipal(auth.identity.getPrincipal())
            } catch (error) {
                
            }
        }
    },[auth.identity])



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
                    publisher: publisher, // DI METHOD Fahrul, yang direturn id publisher
                    certificateId: certificateId,
                    name: name,
                    id: id
                }
                console.log('DATA')
                console.log(bundleData)
                
                const publisherData = await auth.actor?.getPublisherName(publisher)
                if(publisherData.length != 0){
                    setPublisherName(publisherData[0])
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
    
    useEffect(()=>{
        initialize();
    }, [])

    useEffect(()=>{
        setLoading(true)
        fetch()
        
    },[auth])

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
           
           <ToastContainer />

        {isTransferPopUpActive && <TransferPopUp
            onSuccess={() => {
                toast.success('Successfully transferred the certificate to the receiver')
                setIsTransferPopUpActive(false);
                fetch();
            } }
            onError={(err)=>{
                toast.error(err);
                setIsTransferPopUpActive(false);
            }}
            onCancel={() => {
                setIsTransferPopUpActive(false);
            } }
            senderIdentity={principal} certificateId={parseInt(certificateNumId)} user={auth}            />}

            <div className='fixed top-0 w-[100vw] bg-slate-950 z-20 p-4  flex'>
                <div className='max-w-6xl w-full  mx-auto my-auto'>
                <div className='text-white' onClick={()=>{
                    window.history.back()
                }}>
                    <IoMdArrowRoundBack size={28}/>
                </div>
                </div>
            </div>
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-4 pt-4  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">

            {
                loading  && <LoadingSpinner/>
            }
            { !loading && certificate != null &&  
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 grow w-full '>
                    <div className='col-span-1 lg:col-span-2 md: background  p-2'>
                        <div className='w-full flex flex-col items-center mb-4'>
                            <img src={certificate.data.image} className='w-full aspect-[10/7] rounded-lg'></img>
                        </div>
                        <TextField onCopy={()=>{}} strKey={'Title'} value= {!certificate.data.title? 'No title' : certificate.data.title}/>
                        <TextField onCopy={()=>{}} strKey={'Certificate Id'} value= {certificate.certificateId}/>
                        <div className='grid grid-cols-2 gap-4 mt-8'>
                        <a href={certificate.data.image} className='w-full flex items-center justify-center ' download="certificate_image.png">
                            <button className='text-white w-full flex items-center justify-center px-2 py-2 rounded-md bg-slate-800'>
                                <h1>Download</h1>
                            </button>
                        </a>
                            <button onClick={()=>{
                                setIsTransferPopUpActive(true)
                            }} className='text-white flex items-center justify-center px-2 py-2 rounded-md bg-teal-800'>
                                <h1>Transfer</h1>
                            </button>
                        </div>
                    </div>
                    <div className='col-span-1 lg:col-span-3 rounded-lg pb-6 pt-1 bg-slate-900 bg-opacity-65 items-center flex flex-col p-2'>
                        <h1 className='w-full text-left px-2   my-1 text-2xl font-bold'> Certificate Information</h1>
                        <div className='grid grid-cols-2 gap-x-4 mt-4'>
                            <TextField onCopy={()=>{}} strKey={'Publisher'} value= {publisherName}/>
                            <TextField onCopy={()=>{}} strKey={'Published Time'} value= {new Date(certificate.data.lastPublished).toLocaleDateString('en-US', options)}/>
                            <TextField onCopy={()=>{}} strKey={'Certificate Recipient'} value= {certificate.name}/>
                            {
                                certificate.data.attributes.filter((dt: any)=> dt.key != undefined && dt.key != null && dt.key != '').map((data : any)=>{
                                    const key = data.key;
                                    const value = data.value;
                                    console.log(certificate.data.attributes)
                                    console.log(typeof key)
                                    return <div key={certificate.certificateId+key}>
                                        <TextField onCopy={()=>{}} strKey={key} value= {value}/>
                                    </div>

                                })
                            }
                        </div>

                    </div>
                </div>
            }

                
               
            </div>
        </main>
    )
    
}

export default DetailPage