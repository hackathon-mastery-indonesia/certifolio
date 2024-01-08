'use client'
import { handleAuthenticated } from "@/util/function/auth_util";
import { Certificate } from "@/util/next_models/certificate";
import { login } from "@/util/redux/features/auth_slice";
import { useAppDispatch, useAppSelector } from "@/util/redux/hooks/hooks";
import { RootState } from "@/util/redux/store/store";
import { AuthClient } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { CustomizableNav } from "../components/partials/navbar";
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline, IoMdAdd } from "react-icons/io";
import CertificateCard from "../components/certificate/certificate_card";
import Head from 'next/head';
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { toast } from "react-toastify";

export default function Page(){
    
    const auth = useAppSelector((state: RootState)=> state.auth);
    const dispatch = useAppDispatch();
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [title, setTitle] = useState<string>('')
    const [isEdit, setIsEdit] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
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
        const fetch = async () => {
            try {
                if(auth.username != null){
                    console.log('watashi ambil!')
                    const lst = await auth.actor?.getOwnedMetadata(auth.identity.getPrincipal());
                    const certificateLst : Certificate[] = []
                    console.log(lst)
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

    },[auth]);

    const onSubmit = async ()=> {
        if(title.trim().length == 0){
            toast.error(`Title can't be empty`);
            return;
        }
        else if(selectedIds.length == 0){
            toast.error('Failed to create bundle. At least one certificate must be included in the bundle.');
            return;
        }
        await auth.actor.createBundle(selectedIds, title) // selectedIds -> lst of str
        toast.success('Certificate bundle creation successful.')
        window.location.href = '/dashboard'
        
    }

    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <CustomizableNav />
            <Head>
                <title>Add Bundle</title>
            </Head>
            
            <div className="mb-auto grow max-w-5xl w-[90vw] md:mt-6  min-w-64 flex mx-auto flex-col items-center justify-start  md:px-4">
            

            { <div className=" flex justify-between mt-4 w-full b items-center px-4 py-2">
                <div className="flex items-center justify-center mr-2">
                {
                            !isEdit? <h1 className="text-lg text-white font-semibold mr-2 line-clamp-1 py-2">{title.trim().length == 0? 'Enter title' : title}</h1> : 
                            <input
                                type="text"
                                name=""
                                value={title}
                                onChange={(event)=>{
                                    setTitle(event.target.value)
                                }}
                                className="bg-black text-lg text-white rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="Enter title"
                            />
                        }
                        {!isEdit ? (
                            <AiFillEdit size={20} onClick={() => 
                            setIsEdit(true)
                            } className="cursor-pointer text-white ml-4" />
                        ) : (
                            <IoIosCheckmarkCircle size={20} onClick={() => {
                                setIsEdit(false)
                            }} className="cursor-pointer text-white ml-2" />
                        )}
                
                </div>
                <button
                onClick={()=>{
                    onSubmit();
                }}
                className="flex text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
            >
                <IoMdAdd className="mr-2"/>
                Create Bundle
            </button>
                </div>  }

                { 
                    <div className="w-full flex px-3 h-6 my-2">
                        {selectedIds.length > 0  && <h1 className="text-white">{selectedIds.length} Selected</h1>}
                    </div>
                }
            
            
                {certificates.length == 0 && 
                <div className='flex items-center grow '>
                    <h1 className='text-sm text-white font-semibold lg:text-base'>There are no certificates here</h1>
                </div>
                }
                { certificates.length != 0 &&
                    <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
                        {certificates.map((c)=>{
                            return <div key={c.certificateId} className="relative  ">
                                <div className="absolute top-8 right-8">
                                    {
                                        selectedIds.includes(c.id) ? 
                                        <IoIosCheckmarkCircle size={20} onClick={() => {
                                            setSelectedIds(prev => prev.filter(s => s !=c.id ))
                                        }} className="cursor-pointer text-white ml-2" /> :
                                        <MdOutlineRadioButtonUnchecked size={20}  
                                        onClick={() => {
                                            setSelectedIds(prev => [...prev, c.id])
                                        }} 
                                        className="cursor-pointer text-white ml-2" />
                                    }
                                </div>
                                
                                <CertificateCard  name={c.data.title? c.data.title as string : 'No title'}  certificateId={c.certificateId} imageUrl={`${c.data.image}`}/></div>
                        })}
                    </div>
                }
            </div>
        </main>
    );
}