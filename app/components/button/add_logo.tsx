import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaEraser, FaIcons, FaImage } from "react-icons/fa";


type AddLogoProps = {
   
    onUpload: (mode: string, url: string) => void
    
};
const AddLogoButton : React.FC<AddLogoProps>  = ({onUpload}) => {
    const [isActive, setIsActive] = useState(false)
    const ref = useRef<HTMLDivElement>(null);
   
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsActive(false);
        }
        console.log('ANAK KONTOL GA JELAS NEXTJS GOBLOK')
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const handleAddLogo = (event: ChangeEvent<HTMLInputElement>) => {
        try {
          console.log('BANGSATTTTTTTTTTTTTTTTTTTTT')
        const file: File | null = event.target.files && event.target.files[0];
        console.log('NEXT BABI GOBLOK')
        } catch (error) {
          console.log('ASUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU')
        }
    }



    return (
        <div
        ref={ref}
        onClick={
            ()=>{
                setIsActive(!isActive)
            }
        }
            className="flex relative text-xs md:text-sm items-center bg-slate-700 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded"
        >
            <FaIcons className="mr-2"/>
           Add Logo
           { isActive && (
            <div className="absolute z-20 top-12 -left-1/4 space-y-2 p-4 rounded-lg d bg-slate-800 flex flex-col items-center">

                <label
                    className="flex w-full  text-center text-xs md:text-sm items-center   text-white  py-2 px-4 rounded"
                >
                    
                Upload Logo
                <input id="add-logo" type="file" className="hidden" onChange={(e)=>{
                  console.log('ASUUUUUUUUUUUUUUUUUUUU!!!')
                  handleAddLogo(e)
                }} accept="image/*" />
                </label>


                <button
                onClick={
                    ()=>{
                        
                    }
                }
                    className="flex text-center  text-xs md:text-sm items-center   text-white  py-2 px-4 rounded"
                >
                    
                Upload Logo with Background Removal
                </button>
            </div>
           )}
        </div>
    )
}

export {AddLogoButton}