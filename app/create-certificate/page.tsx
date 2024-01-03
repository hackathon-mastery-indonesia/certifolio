'use client'

import CreateCertificateNav from '../components/partials/create_certificate_navbar';
import Head from 'next/head';
import { RootState } from '@/util/redux/store/store';
import { useAppSelector } from '@/util/redux/hooks/hooks';
import { ChangeEvent, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { CertificateField } from '@/util/next_models/certificate_field';
import { v4 as uuidv4 } from 'uuid';
import CertificateFieldComponent from '../components/certificate_field_component';
import DraggableTextComponent from '../components/draggable_text';
import { AiFillDelete, AiFillFileImage } from 'react-icons/ai';
import { FaImage, FaRegFileImage } from 'react-icons/fa';
import { fonts } from '@/util/fonts/font';




export default function Page() {

    const NOT_ALLOWED_KEYWORDS = [
        'title',
    ]
    const auth = useAppSelector((state: RootState)=> state.auth);
    const [title, setTitle] = useState('new-title')
    const [certificateFields, setCertificateFields] = useState<CertificateField[]>([])
    const [selectedImage, setSelectedImage] = useState <string| null> (null)
    const [selectedFont, setSelectedFont] = useState(fonts['roboto']);
    const handleAddField = () => {
        const newCertificateField: CertificateField = {
            id: uuidv4(), // Gunakan library uuidv4 untuk membuat id unik
            key: '', // Nilai default untuk key
            value: '', // Nilai default untuk value
            xPos: 0, // Nilai default untuk xPos (sesuaikan jika diperlukan)
            yPos: 0, // Nilai default untuk yPos (sesuaikan jika diperlukan)
            isValid: false, // Atur validitas ke false jika ingin menampilkan status invalid secara default
            isVisible: true,
            font: selectedFont
        };
        setCertificateFields(prev => [...prev, newCertificateField]);
    }
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('handle image dipencet')
        const file: File | null = event.target.files && event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };

   

    let isEmpty = false;
    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <CreateCertificateNav title={title} onSubmit={(newTitle)=>{
                setTitle(
                    newTitle
                )
            }} />
            <Head>
                <title>Create Certificate</title>
            </Head>
            
            <div className=" mb-auto grow max-w-7xl w-[90vw] items-stretch min-h-full  md:mt-6 pt-6 min-w-64 flex mx-auto  justify-start  md:px-4">
            <div className='flex grow bg-slate-900  rounded-lg mr-2 px-2 py-2'>
                    <div className='w-full grow-0 '>
                        
                        {
                            selectedImage == null  &&
                            <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Add your existing certificate or just a background for your new certificate</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>  
                        }
                    {
                        selectedImage != null && 
                        <div className='w-full flex  items-center grow-0 justify-end mb-2 '>
                              <label htmlFor="image-change-dropzone-file" className="flex mr-2  text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded">
                                <FaImage className="mr-2" />
                                Change Image
                                <input id="image-change-dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                                <button

                                onClick={
                                    ()=>{
                                        setSelectedImage(null)
                                    }
                                }
                                    className="flex  text-xs md:text-sm items-center bg-red-500 hover:bg-red-950 text-white font-bold py-2 px-4 rounded"
                                >
                                    <AiFillDelete className="mr-2"/>
                                    Remove Image 
                                </button>
                </div>
                    }
                    {selectedImage != null && <div className='relative w-full aspect-[10/7] bg-slate-900' style={{ 
                        backgroundImage: `url(${selectedImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', // Opsional: mengatur posisi background
                    }}>
                        {/* Konten lainnya di dalam div ini */}
                        {
                            certificateFields.map((certificateField)=>{
                                if(!certificateField.isVisible) return <div></div>
                                return <DraggableTextComponent key={'draggable-'+certificateField.id} 
                                field={certificateField} onDragEnd={(
                                    id, endX, endY
                                )=>{
                                    const arr = [...certificateFields]
                                    const ele = arr.find((field)=>field.id == id);
                                    if(ele){
                                        ele.xPos = endX;
                                        ele.yPos = endY
                                    }
                                    setCertificateFields(arr);
                                }}
                                onTextEdit={(id, newText)=>{
                                    const arr = [...certificateFields]
                                    const ele = arr.find((field)=>field.id == id);
                                    
                                    if(ele){
                                        ele.value = newText.split('').reverse().join('')
                                    }
                                    setCertificateFields(arr);
                                }}
                                
                                />
                            })
                        }
                    </div>}

                    

                    </div>
            </div>
            
            <div className='flex flex-col w-[20rem]  p-4 bg-slate-900 rounded-xl'>
                <div className='w-full flex flex-col items-end grow-0 justify-start mb-2 '>
                <button

                onClick={
                    handleAddField
                }
                    className="flex  text-xs md:text-sm items-center bg-slate-800 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
                >
                    <IoMdAdd className="mr-2"/>
                    Add field
                </button>
                </div>
            {
                certificateFields.map((certificateField)=>{
                    return <CertificateFieldComponent 
                    key={certificateField.id}
                    field={certificateField}
                    onVisible={(id, isVisible)=>{
                        const arr = [...certificateFields]
                        console.log('AKU MAU ', isVisible)
                        const field = arr.find((certificateField)=>(certificateField.id == id));
                        if(field){
                            field.isVisible = isVisible;
                        }
                        setCertificateFields(arr)
                    }}
                    onDelete={(id) => {
                        setCertificateFields(prevFields => (
                          prevFields.filter((field) => field.id !== id)
                        ));
                      }}
                    onEditKey={(id, newKey)=>{
                        const arr = [...certificateFields]
                        const field = arr.find((certificateField)=>(certificateField.id == id));
                        if(field){
                            field.key = newKey;
                        }
                        setCertificateFields(arr)
                    }}
                    onEditValue={(id, newValue)=>{
                        const arr = [...certificateFields]
                        const field = arr.find((certificateField)=>(certificateField.id == id));
                        if(field){
                            field.value = newValue;
                        }
                        setCertificateFields(arr)
                    }}
                    setValidity={(id, status)=>{
                        const arr = [...certificateFields]
                        const field = arr.find((certificateField)=>(certificateField.id == id));
                        if(field){
                            field.isValid = status;
                        }
                        setCertificateFields(arr)
                    }}
                    
                    /> 
                })
            }
                
            </div>
            </div>
            
        </main>
    );
}