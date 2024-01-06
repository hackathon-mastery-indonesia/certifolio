'use client'

import CreateCertificateNav from '../components/partials/create_certificate_navbar';
import Head from 'next/head';
import { RootState } from '@/util/redux/store/store';
import { useAppSelector } from '@/util/redux/hooks/hooks';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { IoMdAdd, IoMdContract, IoMdText } from 'react-icons/io';
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
import html2canvas from 'html2canvas';
import { LogoField } from '@/util/next_models/logo_field';
import { DraggableLogo } from '../components/draggable_logo';
import DrawingCanvas from '../components/canvas';
import { MdOutlinePreview } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { idlFactory } from "../../app/smartContractUtil/certifolio_backend.did.js";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AUTH_BASE_URL } from "../../util/base/base_url";
import { AuthClient } from '@dfinity/auth-client';







type BackgroundSize = {
    width: number;
    height: number;
  };

  const scrollbarStyle = {
    position: 'relative',
    width: '100%',
    height: '300px', // Sesuaikan dengan kebutuhan
    overflow: 'hidden',
  };

  const scrollContentStyle = {
    width: 'calc(100% + 17px)',
    height: '100%',
    paddingRight: '17px',
    boxSizing: 'content-box',
    overflowY: 'scroll',
  };

  const scrollbarThumbStyle = {
    width: '10px',
    backgroundColor: '#333', // Warna thumb pada mode gelap
    borderRadius: '4px',
  };

  const scrollbarTrackStyle = {
    backgroundColor: '#222', // Warna latar belakang track scrollbar
  };




  
export default function Page() {

    const NOT_ALLOWED_KEYWORDS = [
        'title', 'name', 'publisher', 'id', 'attributes', 'lastPublished'
    ]
    const router = useRouter()
    const auth = useAppSelector((state: RootState)=> state.auth);
    const [title, setTitle] = useState('new-title')
    const [certificateFields, setCertificateFields] = useState<CertificateField[]>([])
    const [logoList, setLogoList] = useState<LogoField[]>([])
    const [selectedImage, setSelectedImage] = useState <string| null> (null)
    const [selectedSignatureColor, setSelectedSignatureColor] = useState <string> ('#000000')
    const [selectedSignatureBackgroundColor,setSelectedSignatureBackgroundColor ] = useState <string> ('#FFFFFF')
    const [isSignatureOpen ,setIsSignatureOpen] = useState(false)
    const [selectSignatureForeground, setSelectingSignatureForeground] = useState(false)
    const [selectSignatureBackground, setSelectingSignatureBackground] = useState(false)
    const [toggleSubmit, setToggleSubmit] = useState(false)
    const [preview, setPreview] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const certificateRef = useRef<HTMLDivElement>(null)
    
    const signatureRef = useRef<HTMLDivElement>(null)
    const [clearCanvas, setClearCanvas] = useState(false)
  
   
    const [selectedLogoField, setSelectedLogoField] = useState<LogoField|null>(null)

    const [backgroundSize, setBackgroundSize] = useState<BackgroundSize>({
        width: 100,
        height: 100
    })
    const [selectedCertificateField, setSelectedCertificateField] = useState<null|CertificateField>(null);

    const saveCertificate = async () : Promise<string> => {
        const certificateMap: Map<string, any> = new Map();
        const gambar = await captureDiv();
        console.log('OIIIIII');

        if(validate() && auth.authClient != null){

            certificateMap.set('image', gambar);
            certificateMap.set
            certificateMap.set('name', auth.username? auth.username : 'Unknown');
            certificateMap.set('publisher', 'Principal'); // NDAK TAU
            certificateMap.set('id', uuidv4()) // NDAK TAU
            const data : Map<string,string>[] = [];
            certificateFields.forEach((cer)=>{
                const map : Map<string,string> = new Map();
                map.set('key', cer.key)
                map.set('value', cer.value)
                data.push(map)
            })
            certificateMap.set('attributes', data)
            const lastPublished = new Date().toISOString();
            certificateMap.set('lastPublished', lastPublished);

            const certificateJSON = JSON.stringify(Object.fromEntries(certificateMap));

    // Lakukan sesuatu dengan certificateJSON (berupa string JSON)
            console.log(certificateJSON);
            //create authclient
            //const authClient = await AuthClient.create();
            //const identity = authClient.getIdentity();
            //const authClient = auth.authClient;
            const actor = auth.actor;
          

            const res = await actor?.whoami() as string;
            const a = await actor?.mint(certificateJSON, res, certificateMap.get("id")) as string;
            console.log(a + 'INI Adalah token');

            //ini cara get certif

            const idetityPrin = auth.identity.getPrincipal();
            const res2 = await actor?.getCertificateOwned(idetityPrin);
            //change res2 from array to string
            const xy = actor?.getMetadata(res2[0]);
            return 'SUCCESS'

        }
        toast.error('Anda tidak terautentikasi', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
          })
        console.log('NICEEEEE SALAH')
        return 'FAILED'
        
    }

    const validate = () : boolean => {
        if(title == 'new-title' || title.trim().length == 0){
            toast.error('Title tidak valid', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
              })
            return false;
        }
        if(selectedImage == null){
            toast.error('background atau gambar tidak boleh kosong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
              })
            return false;
        }
        const idSet = new Set();
        for (const field of certificateFields){
            if(field.key.trim().length == 0 && field.isData){
                toast.error('Key tidak boleh kosong', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
                  })
                return false;
            }
            else if(idSet.has(field.key)){
                toast.error('Terdapat key yang duplikat: '+ field.key, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
                  })
                return false;
            }
            else{
                 if(field.isData && !field.isValid){
                    toast.error('Terdapat key yang tidak valid: '+field.key, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
                      })
                    return false;
                 }

                 if(NOT_ALLOWED_KEYWORDS.includes(field.key)){
                    toast.error('Key tersebut tidak boleh digunakan: '+field.key, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
                      })
                    return false
                }

                if(field.isData){
                    idSet.add(field.key)
                }
            }
        }        
        return true;

    }


    
    const captureDiv = () : Promise<string>=> {
        return new Promise((resolve, reject) => {
          if (certificateRef.current) {
            html2canvas(certificateRef.current, {
              onclone: (clonedDoc) => {
                Array.from(clonedDoc.querySelectorAll('textarea')).forEach((textArea) => {
                  const div = clonedDoc.createElement('div');
                  div.innerText = textArea.value;
                  div.style.cssText = textArea.style.cssText;
                  div.className = textArea.className;
                  textArea.style.display = 'none';
                  div.style.whiteSpace = 'normal';
                  div.style.wordBreak = 'break-word';
                  textArea.parentElement?.appendChild(div);
                });
              },
            }).then((canvas) => {
              // Dapatkan URL gambar dari canvas yang dihasilkan
              const imageDataURL = canvas.toDataURL('image/png');
              setPreviewImage(imageDataURL);
              resolve(imageDataURL); // Kembalikan data yang dihasilkan
            }).catch((error) => {
              reject(error); // Tangani jika terjadi kesalahan
            });
          } else {
            toast.error('background atau gambar tidak boleh kosong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000, // Durasi pesan toast ditampilkan dalam milidetik (opsional)
              })
            reject('certificateRef tidak tersedia'); // Tangani jika certificateRef tidak tersedia
          }
        });
      };
      

      const findAndReplaceTextArea = (element: HTMLElement | null): void => {
        if (!element) return;
      
        // Cek apakah element merupakan tag <textarea>
        if (element.tagName.toLowerCase() === 'textarea') {
          // Lakukan modifikasi jika ditemukan <textarea>
          const contentEditableDiv = document.createElement('div');
          contentEditableDiv.contentEditable = 'true';
          contentEditableDiv.innerHTML = (element as HTMLTextAreaElement).value;
          element.parentNode?.replaceChild(contentEditableDiv, element);
          return; // Berhenti jika ditemukan dan diganti
        }
      
        // Cari di dalam child elements
        for (let i = 0; i < element.children.length; i++) {
          findAndReplaceTextArea(element.children[i] as HTMLElement);
        }
      };
   

    

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
        const handleClickOutside = (event: MouseEvent) => {
            if (signatureRef.current && !signatureRef.current.contains(event.target as Node)) {
                // Tutup popup di sini
                // Misalnya, panggil fungsi untuk menutup popup
                // handleClosePopup();
                setIsSignatureOpen(false)
                setClearCanvas(!clearCanvas);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [signatureRef])

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

    const handleAddField = (isData: boolean) => {
        const newCertificateField: CertificateField = {
            isData: isData,
            id: uuidv4(), // Gunakan library uuidv4 untuk membuat id unik
            key: '', // Nilai default untuk key
            value: '', // Nilai default untuk value
            xPos: 0.25, // Nilai default untuk xPos (sesuaikan jika diperlukan)
            yPos: 0.25, // Nilai default untuk yPos (sesuaikan jika diperlukan)
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
            height: calculateRelativePositionFromParent(100, backgroundSize.height)
        };

        
        setCertificateFields(prev => [newCertificateField,...prev]);
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
                xPos: 1/4,
                yPos: 1/4,
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

      const handleSignature = (event: ChangeEvent<HTMLInputElement>) => {
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
            setIsSignatureOpen(false)


           
          }
          
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      }

      

   

    let isEmpty = false;
    return (
        <main className="flex bg-gradient-to-b from-slate-950 to-slate-900 via-gray-950 min-h-screen flex-col items-center justify-center px-6 pt-20 md:pt-12 ">
            <style>
            {`
            ::-webkit-scrollbar {
                width: ${scrollbarThumbStyle.width};
            }
            ::-webkit-scrollbar-thumb {
                background-color: ${scrollbarThumbStyle.backgroundColor};
                border-radius: ${scrollbarThumbStyle.borderRadius};
            }
            ::-webkit-scrollbar-track {
                background-color: ${scrollbarTrackStyle.backgroundColor};
            }
            `}
        </style>

        <div ref={signatureRef} className={`fixed p-2 ${isSignatureOpen? '' : 'hidden'} rounded-lg flex flex-col items-center justify-center
         bg-slate-800 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30`}>
        <label className='w-full p-2 bg-slate-900 text-center mb-4 rounded-lg'> Upload Image
        <input id="upload-signature" type="file" className="hidden" onChange={handleSignature} accept="image/*" />
        </label>
        <h1 className='w-full text-center text-white mb-4'>OR</h1>

        <div  className='w-full flex items-center justify-end space-x-3 mb-2 '>

            <div onClick={()=>{
                setClearCanvas(!clearCanvas);
            }} className='p-3 aspect-square text-red-700 bg-white rounded-lg mr-auto'>
                <AiFillDelete/>
            </div>
            <ColorPicker onColorSelect={(str)=>{
                        setSelectedSignatureBackgroundColor(str)
                        setSelectingSignatureBackground(false)
                    }
                    }
                    defaultColor={selectedSignatureBackgroundColor}
            />
            <ColorPicker onColorSelect={(str)=>{
                        setSelectedSignatureColor(str)
                        setSelectingSignatureForeground(false)
                    }
                    }
                    defaultColor={selectedSignatureColor}
            />
            
        </div>
        <DrawingCanvas
        toggleSubmit={toggleSubmit}
        foregroundColor={selectedSignatureColor}
        backgroundColor={selectedSignatureBackgroundColor}
        isDelete=
        {clearCanvas} parentWidth={backgroundSize.width} parentHeight={backgroundSize.height} onSubmit={(str)=>{
            console.log('TOGGLE');
            setIsSignatureOpen(false);
            const data : LogoField = {
                id: uuidv4(),
                url: str ,
                xPos: 1/4,
                yPos: 1/4,
                width:1/5,
                height: 1/5
            }
            const lst = [...logoList]
            lst.push(data)
            setLogoList(lst)
            setClearCanvas(!clearCanvas);
            setToggleSubmit(false)
        }}/>
        <div className='flex mt-4 items-center w-full '>
        <button onClick={()=>{
            setIsSignatureOpen(false)
            setClearCanvas(!clearCanvas);
        }} className='grow p-2 mr-2 bg-slate-900 text-center  rounded-lg'> Back</button>
        <button onClick={()=>{
            setToggleSubmit(!toggleSubmit)

        }} className='grow p-2 bg-slate-900 text-center  rounded-lg'> Next</button>
        </div>
        </div>
            
            <CreateCertificateNav onSaveCertificate={()=>{
                saveCertificate().then((res)=>{
                    if(res == 'SUCCESS'){
                        router.push('/dashboard/')
                    }
                    else{

                    }
                })
            }} title={title} onSubmit={(newTitle)=>{
                setTitle(
                    newTitle
                )
            }} />
            <ToastContainer />
            <Head>
                <title>Create Certificate</title>
            </Head>
            
            <div className=" mb-auto grow max-w-7xl w-[90vw] items-stretch min-h-full  md:mt-6 pt-6 min-w-64 flex mx-auto  justify-start  md:px-4">
            <div className='flex grow bg-slate-900  rounded-lg mr-2 px-2 py-2'>
                    <div className='w-full grow-0  p-2 '>
                        
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
                                async ()=>{
                                    if(!preview){
                                        const res = await captureDiv();
                                        console.log(res);
                                        console.log('yoiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                                        setPreview(true)
                                    }
                                    else{
                                        setPreview(false)
                                    }
                                    //handleAddField(false)
                                }
                            }
                                className="flex  text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded"
                            >
                                <MdOutlinePreview className="mr-2"/>
                            {!preview? 'Open Preview' : 'Close Preview'}
                            </button>
                            <button

                            onClick={
                                ()=>{
                                    handleAddField(false)
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
                                    setIsSignatureOpen(true)
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
                    {selectedImage != null && !preview? <div ref={certificateRef} id='certificate-background-container' className='relative w-full aspect-[10/7] bg-slate-900' style={{ 
                        backgroundImage: `url(${selectedImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', // Opsional: mengatur posisi background
                    }}>
                        {/* Konten lainnya di dalam div ini */
                        
                        logoList.map((logo)=>{
                            console.log('ADODING')

                           
                            return <DraggableLogo
                            setDisable={()=>{
                                setSelectedLogoField(null)
                            }}
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
                    </div> : 
                    <div className='relative w-full aspect-[10/7] bg-slate-900' style={{ 
                        backgroundImage: `url(${previewImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center', // Opsional: mengatur posisi background
                    }}>

                    </div>}

                    

                    </div>
            </div>
            
            <div className='flex flex-col w-[20rem]   bg-slate-900 rounded-xl   p-2'>
                <div className='grow  overflow-y-auto max-h-screen p-2'>
                <div className='w-full flex flex-col items-end grow-0 justify-start mb-2 '>
                <button

                onClick={
                    ()=>{
                        handleAddField(true)
                    }
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
                    isSelected={selectedCertificateField != null && selectedCertificateField.id == certificateField.id}
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
            </div>
            
        </main>
    );
}