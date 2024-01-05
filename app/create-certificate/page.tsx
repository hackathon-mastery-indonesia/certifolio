'use client'

import CreateCertificateNav from '../components/partials/create_certificate_navbar';
import Head from 'next/head';
import { RootState } from '@/util/redux/store/store';
import { useAppSelector } from '@/util/redux/hooks/hooks';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoMdAdd, IoMdText } from 'react-icons/io';
import { CertificateField } from '@/util/next_models/certificate_field';
import { v4 as uuidv4 } from 'uuid';
import CertificateFieldComponent from '../components/certificate_field_component';
import DraggableWrapper from '../components/draggable_text';
import { AiFillDelete, AiFillFileImage } from 'react-icons/ai';
import { FaAlignCenter, FaIcons, FaImage, FaRegFileImage, FaSignature, FaSms } from 'react-icons/fa';
import { fonts } from '@/util/fonts/font';
import FontSelector from '../components/font_selector';
import FontSizeSelector from '../components/font_size_selector';
import TextAlignSelector from '../components/text_align_selector';
import ColorPicker from '../components/font_color_selector';
import BoldIcon from '../components/bold';
import ItalicIcon from '../components/italic';
import UnderlineIcon from '../components/underline';
import { calculateFontSize, calculateRelativePositionFromParent } from '@/util/responsive/calculate';
import { AddLogoButton } from '../components/add_logo';
import { LogoField } from '@/util/next_models/logo_field';
import { DraggableLogo } from '../components/draggable_logo';




type BackgroundSize = {
    width: number;
    height: number;
  };




  
export default function Page() {

    const NOT_ALLOWED_KEYWORDS = [
        'title',
    ]
    const auth = useAppSelector((state: RootState)=> state.auth);
    const [title, setTitle] = useState('new-title')
    const [certificateFields, setCertificateFields] = useState<CertificateField[]>([])
    const [logoList, setLogoList] = useState<LogoField[]>([])
    const [selectedImage, setSelectedImage] = useState <string| null> (null)
  
   
    const [selectedLogoField, setSelectedLogoField] = useState<LogoField|null>(null)

    const [backgroundSize, setBackgroundSize] = useState<BackgroundSize>({
        width: 100,
        height: 100
    })
    const [selectedCertificateField, setSelectedCertificateField] = useState<null|CertificateField>(null);

    

   

      useEffect(()=>{
        
       /* preload(config).then(() => {
            console.log("Asset preloading succeeded")
          })

          */
        
      },[])

    useEffect(() => {
        if (selectedCertificateField != null) {
          setCertificateFields(prevFields => {
            const updatedFields = prevFields.map(field => {
              if (field.id === selectedCertificateField.id) {
                // Lakukan perubahan yang diinginkan pada field tertentu di sini
                // Contoh: Mengubah properti `name` pada field yang memiliki id yang sesuai
                return selectedCertificateField// Ganti dengan perubahan yang diperlukan
              }
              return field;
            });
            return updatedFields;
          });
          setSelectedLogoField(null)
        }
      }, [selectedCertificateField]);

    useEffect(()=>{

        if(selectedLogoField != null){
            setLogoList(prevFields => {
                const updatedFields = prevFields.map(field => {
                  if (field.id === selectedLogoField.id) {
                    // Lakukan perubahan yang diinginkan pada field tertentu di sini
                    // Contoh: Mengubah properti `name` pada field yang memiliki id yang sesuai
                    return selectedLogoField// Ganti dengan perubahan yang diperlukan
                  }
                  return field;
                });
                return updatedFields;
              });
            setSelectedCertificateField(null)
        }

    },[selectedLogoField])

    useEffect(()=>{

    }, [])

    useEffect(() => {
        const handleResize = () => {
          const element = document.getElementById('certificate-background-container');
          if (element) {
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            setBackgroundSize({
                width: width,
                height: height
            })
          }
        };

        handleResize();
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [selectedImage]);

    const handleAddField = () => {
        const newCertificateField: CertificateField = {
            id: uuidv4(), // Gunakan library uuidv4 untuk membuat id unik
            key: '', // Nilai default untuk key
            value: '', // Nilai default untuk value
            xPos: 0.5, // Nilai default untuk xPos (sesuaikan jika diperlukan)
            yPos: 0.5, // Nilai default untuk yPos (sesuaikan jika diperlukan)
            isValid: false, // Atur validitas ke false jika ingin menampilkan status invalid secara default
            isVisible: true,
            font:  selectedCertificateField? selectedCertificateField.font : 'quicksand',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontSize: selectedCertificateField? selectedCertificateField.fontSize : 24, //todo
            textAlign: 'left',
            fontColor: selectedCertificateField? selectedCertificateField.fontColor : '#7CB9E8',
            width: calculateRelativePositionFromParent(200, backgroundSize.width),
            height: calculateRelativePositionFromParent(200, backgroundSize.height)
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

      const handleLogo =  (event: ChangeEvent<HTMLInputElement>) => {
        console.log('handle logo dipencet')
        const file: File | null = event.target.files && event.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
          //setSelectedImage(reader.result as string);
          console.log('yellow')
          if(file){
            const data : LogoField = {
                id: uuidv4(),
                url: reader.result as string ,
                xPos: 1/2,
                yPos: 1/2,
                width:1/5,
                height: 1/5
            }
            const lst = [...logoList]
            lst.push(data)
            setLogoList(lst)

           
          }
          
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
                        <div className='w-full flex  items-center grow-0 justify-end mb-2 flex-wrap space-x-3 space-y-2'>
                            <div>

                            </div>


                            
                            <button

                            onClick={
                                ()=>{
                                    
                                }
                            }
                                className="flex  text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded"
                            >
                                <IoMdText className="mr-2"/>
                               Add Text
                            </button>


                            <label
                                
                            className="flex relative text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded"
                        >
                            <FaIcons className="mr-2"/>
                        Add Logo
                        <input id="raw-logo" type="file" className="hidden" onChange={(e)=>{
                                    handleLogo(e)
                                }} accept="image/*" />
                            </label>

                            <button

                            onClick={
                                ()=>{
                                    
                                }
                            }
                                className="flex  text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded"
                            >
                                <FaSignature className="mr-2"/>
                               Add Signature
                            </button>
                            

                            <div className='p-2 flex items-center rounded-md bg-slate-800'>
                            <div className='flex items-center mr-2'>
                            <BoldIcon initialValue={selectedCertificateField? selectedCertificateField.isBold : false}
                             onChange={(newStatus)=>{
                               // if(!selectedCertificateField) return;
                                const update = {...selectedCertificateField} as CertificateField
                                update.isBold = newStatus;
                                setSelectedCertificateField(prev => update)
                             }}/>
                            </div>
                            <div className='flex items-center mr-2'>
                            <ItalicIcon initialValue={selectedCertificateField? selectedCertificateField.isItalic : false} 
                            onChange={(newStatus)=>{
                                const update = {...selectedCertificateField} as CertificateField
                                update.isItalic = newStatus;
                                setSelectedCertificateField(prev => update)
                            }}/>
                            </div>
                            <div className='flex items-center'>
                            <UnderlineIcon initialValue={selectedCertificateField? selectedCertificateField.isUnderline : false} 
                            onChange={(newStatus)=>{
                                const update = {...selectedCertificateField} as CertificateField
                                update.isUnderline = newStatus;
                                setSelectedCertificateField(prev => update)
                            }}/>
                            </div>
                            </div>

                            <div className='flex items-center'>
                            <TextAlignSelector initialTextAlignValue={
                                selectedCertificateField?.textAlign
                            } onTextAlignSelect={(str)=>{
                                //if(!selectedCertificateField) return;
                                const update = {...selectedCertificateField} as CertificateField
                                update.textAlign = str;
                                setSelectedCertificateField(prev => update)
                                
                            }}/>
                            </div>
                            <div className='flex items-center '>
                            <ColorPicker defaultColor={selectedCertificateField?.fontColor} onColorSelect={(color)=>{
                                // if(!selectedCertificateField) return;
                                const update = {...selectedCertificateField} as CertificateField
                                console.log(update.id)
                                update.fontColor = color;
                                setSelectedCertificateField(prev => update)
                            }}/>
                            </div>
                            <div className='flex items-center'>
                            <FontSelector initialFont={selectedCertificateField?.font} onFontSelect={(str)=>{
                                const update = {...selectedCertificateField} as CertificateField
                                update.font = str;
                                setSelectedCertificateField(prev => update)
                            }}/>
                            </div>
                            <div className='flex '>
                            <FontSizeSelector initialFontSize={selectedCertificateField?.fontSize} onFontSizeSelect={(selectedFontSize)=>{
                                console.log(selectedFontSize)
                                const update = {...selectedCertificateField} as CertificateField
                                update.fontSize = selectedFontSize;
                                setSelectedCertificateField(prev => update)
                            }}/>
                            </div>
                              <label htmlFor="image-change-dropzone-file" className="flex   text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded">
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
                    {selectedImage != null && <div id='certificate-background-container' className='relative w-full aspect-[10/7] bg-slate-900' style={{ 
                        backgroundImage: `url(${selectedImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', // Opsional: mengatur posisi background
                    }}>
                        {/* Konten lainnya di dalam div ini */
                        
                        logoList.map((logo)=>{
                            console.log('ADODING')

                           
                            return <DraggableLogo
                            onDelete={(id)=>{
                                if(id == selectedLogoField?.id){
                                    setSelectedLogoField(null);
                                }
                                setLogoList(logoList.filter((l)=> l.id != id))
                            }}
                            isActive={selectedLogoField != null && selectedLogoField.id == logo.id}
                            field={logo}
                            key={logo.id}
                            onDragEnd={
                                (id, newX, newY)=>{
                                    const lst = [...logoList]
                                    const selected = lst.find((l)=>l.id == id)
                                    if(selected){
                                        selected.xPos = newX;
                                        selected.yPos = newY;
                                    }
                                    setLogoList(lst)
                                }
                            }
                            onUpdateSize={(id, newWidth, newHeight)=>{
                                const lst = [...logoList]
                                    const selected = lst.find((l)=>l.id == id)
                                    if(selected){
                                        selected.width = newWidth;
                                        selected.height = newHeight;
                                    }
                                    setLogoList(lst)
                            }}

                            onTap={(field)=>{
                                //todo
                                setSelectedLogoField(field);
                                
                            }}
                            
                            parentWidth={backgroundSize.width}
                            parentHeight={backgroundSize.height}
                            
                            />
                        })
                        }
                        {

                            
                            certificateFields.map((certificateField)=>{
                                if(!certificateField.isVisible) return <div></div>
                                return <DraggableWrapper 
                                onTap={(field)=>{
                                   console.log('WOI')
                                   // alert('LO MENEKAN SESUATU')
                                 //  alert('HARUSNYA ENTE GANTI')
                                   setSelectedCertificateField(field)
                                }}
                                key={'draggable-'+certificateField.id} 
                                parentHeight={backgroundSize.height} parentWidth={backgroundSize.width}
                                field={certificateField} 
                                onUpdateSize={(id, nw, nh)=>{
                                    const arr = [...certificateFields]
                                    const ele = arr.find((field)=>field.id == id);
                                    if(ele){
                                        ele.width = nw
                                        ele.height = nh
                                    }
                                    setCertificateFields(arr);

                                }}
                                onDragEnd={(
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
                                        ele.value = newText
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
                        if(selectedCertificateField?.id == id){
                            setSelectedCertificateField(null)
                        }
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