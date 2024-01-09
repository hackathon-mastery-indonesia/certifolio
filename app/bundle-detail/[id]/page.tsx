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
import { Bundle } from '@/util/next_models/bundle';
import { v4 as uuidv4 } from 'uuid';
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
    const bundleNumId = params.id
    ///////////////////////////////////////////////////////////////////////////////////
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    const [principal, setPrincipal] = useState<string>('');
    const [selectedCertificateId, setSelectedCertificateId] = useState<number>(-1) 
    //////////////////////////////////////////////////////////////////////
    const [bundle, setBundle] = useState<Bundle|null>(null);
    /////////////////////////////////////////////////////////////////////
    const [publisherName, setPublisherName] = useState<Record<string,string>>({});
    //////////////////////////////////////////////////////////////////////////////////////
    const [isTransferPopUpActive, setIsTransferPopUpActive] = useState(false);



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
        if(auth.username != null){
            try {
                setPrincipal(auth.identity.getPrincipal())
            } catch (error) {
                
            }
        }
    },[auth.identity])

    useEffect(()=>{
        setLoading(true)
        const fetch = async () => {
            try {
                if(auth.username != null){
                    //////////////////////////////////////////////////
                    ///////////////////////////////////////////////
                    //////////////////////////////////////////
                    const getBundleMetadata = await auth.actor?.getBundleMetadata(parseInt(bundleNumId as string))
                    const getBundleName = await auth.actor?.getBundleName(parseInt(bundleNumId as string))
                    const bundleObj : Bundle = {
                        name:getBundleName[0],
                        key:uuidv4(),
                        id:bundleNumId,
                        certificateList:[]
                    }

                    let newPublisherName : Record<string,string> = {...publisherName}
                    for(const data of getBundleMetadata){
                        const  bundleData = JSON.parse(data.uri);
                        const publisher = data.publisher;
                        const certificateId = data.certificateId
                        const name = data.name
                        const id = data.id
                        console.log(typeof data.id)
                        const certificate : Certificate = {
                            data: bundleData,
                            publisher: publisher,
                            certificateId: certificateId,
                            name: name,
                            id: id
                        }
                        const pname = await auth.actor?.getPublisherName(publisher)
                        ///// CEK ////////////////////////////////////////////////
                        console.log(pname)
                        ///////////////////////////////////////////////////////////
                        newPublisherName = {...newPublisherName, [certificateId]:pname[0]};
                        console.log(newPublisherName)
                        
                        bundleObj.certificateList.push(certificate)
                    }
                    setPublisherName(newPublisherName)
                    setBundle(bundleObj)
                    ///////////////////////////////////////////////////////////////////////////////////////////
                    
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

            {isTransferPopUpActive && <TransferPopUp
                onSuccess={() => {
                    toast.success('Successfully transferred the certificate to the receiver')
                    setIsTransferPopUpActive(false);
                } }
                onError={(err)=>{
                    toast.error(err);
                    setIsTransferPopUpActive(false);
                }}
                onCancel={() => {
                    setIsTransferPopUpActive(false);
                } }
                senderIdentity={principal} certificateId={selectedCertificateId} user={auth}            />}

            <div className='fixed top-0 w-[100vw] bg-slate-950 z-20 p-4  flex'>
                <div className='max-w-6xl w-full  mx-auto my-auto'>
                <div className='text-white' onClick={()=>{
                    window.history.back()
                }}>
                    <IoMdArrowRoundBack size={28}/>
                </div>
                </div>
            </div>
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-4 pt-4   min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">

            {
                loading  && <LoadingSpinner/>
            }

            {
                !loading && bundle != null &&
                <div className='w-full mb-4 flex flex-col '>
                    <h1 className='text-white text-2xl text-bold'>{bundle.name}</h1>
                    <p className='text-blue-500 mt-2 text-lg'> {bundle.certificateList.length}
                     {bundle.certificateList.length > 1? ' Certificates' : ' Certificate'}</p>
                </div>
            }

            {
                !loading && bundle != null && 
                <div className='w-full flex flex-col grow  space-y-4'>
                    {
                        bundle.certificateList.map((certificate)=>{
                            return (
                                <div key={certificate.certificateId} className='flex bg-slate-900 p-4 rounded-lg bg-opacity-40'>
                                    <div className='w-full min-h-64 grid grid-cols-1 
                                md:grid-cols-2 lg:grid-cols-5 grow gap-x-4'>
                                    <div className=' col-span-1 lg:col-span-2 flex w-full'>
                                    <div className='mt-5'>
                                        <img src={certificate.data.image}  className=' w-full aspect-[10/7] rounded-lg'></img>
                                    <div className='w-full flex items-center my-4 space-x-4 '>
                                    <button onClick={()=>{
                                        window.location.href = `/bundle-detail/${certificate.id}`
                                    }} className='text-white text-sm flex items-center justify-center px-4 py-2 rounded-md bg-slate-800'>
                                    <h1>Certificate Detail</h1>
                                    </button>
                                    <button onClick={()=>{
                                        setSelectedCertificateId(certificate.id)
                                        setIsTransferPopUpActive(true)
                                    }} className='text-white text-sm flex items-center justify-center px-4 py-2 rounded-md bg-teal-800'>
                                    <h1>Transfer Certificate</h1>
                                    </button>
                                    </div>
                                    
                                    </div>
                                    </div>
                                    <div className='col-span-1 lg:col-span-3  '
                                    >
                                        <TextField strKey={'Title'} value={certificate.data.title}/>
                                        <TextField onCopy={()=>{}} strKey={'Certificate Id'} value= {certificate.certificateId}/>
                                        <TextField onCopy={()=>{}} strKey={'Certificate Recipient'} value= {certificate.name}/>
                                        <TextField onCopy={()=>{}} strKey={'Publisher'} value= {!publisherName[certificate.certificateId] ? 
                                        'Unknown' : publisherName[certificate.certificateId] }/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
            

                
               
            </div>
        </main>
    )
    
}

export default DetailPage