import { LogoField } from "@/util/next_models/logo_field";
import { calculateRelativePositionFromParent, parseRelativePositionToFixed } from "@/util/responsive/calculate";
import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Rnd } from 'react-rnd';

type DraggableLogoProps = {
    field: LogoField;
    onDragEnd: (id: string, xPos: number, yPos: number) => void;
    onUpdateSize: (id: string, newWidth: number, newHeight: number) => void;
    parentWidth: number;
    parentHeight: number;
    onTap: (field:LogoField) => void,
    isActive: boolean,
    onDelete: (id: string)=> void,
    setDisable: () => void
  };

const DraggableLogo: React.FC<DraggableLogoProps> = (
 {field, onDragEnd, onUpdateSize, parentWidth, parentHeight, onTap, isActive, onDelete, setDisable}
) => {
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: field.xPos, y: field.yPos });
    const [width, setWidth] = useState<number>(field.width);
    const [height, setHeight] = useState<number>(field.height);
    const ref = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                // Tutup popup di sini
                // Misalnya, panggil fungsi untuk menutup popup
                // handleClosePopup();
                setDisable()
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [ref])
    
    return( 
    
    <div ref={ref}  onClick={()=>{
        onTap(field)
    }} onMouseDown={
        ()=>{
            onTap(field)
        }
    }>
        <Rnd position={
            {
                x: parseRelativePositionToFixed(field.xPos, parentWidth),
                y: parseRelativePositionToFixed(field.yPos, parentHeight)
            }
        }
        scale={
            1.2
        }

        onDragStop={
            (e, d)=>{
                const newX = calculateRelativePositionFromParent(d.x, parentWidth)
                const newY = calculateRelativePositionFromParent(d.y, parentHeight)
                setPosition({ x: newX, y: newY});
                onDragEnd(field.id, newX, newY) // FIX , kan ambil persentasenya
            }
        }
        onResizeStop={(e, direction, ref, delta, position) => {
            const newWidth = calculateRelativePositionFromParent(ref.offsetWidth, parentWidth);
            const newHeight = calculateRelativePositionFromParent(ref.offsetHeight, parentHeight)
            setWidth(newWidth);
            setHeight(newHeight);
            onUpdateSize(field.id,newWidth,newHeight)
          }}
        >  
        <div
        style={
            {
                width: `${parseRelativePositionToFixed(width, parentWidth)}px`,
                height:`${parseRelativePositionToFixed(height, parentHeight)}px`,
            }
        }
        className={`${isActive? 'flex items-center justify-center  relative rounded-lg p-2 border-2 border-blue-700 border-dashed' : 'flex items-center justify-center  relative rounded-lg p-2'}`}
        >
            <div onClick={()=>{
                onDelete(field.id)
            }} className={`${isActive? '' : 'hidden'} absolute top-2 right-2`}>
                <AiFillCloseCircle className="text-blue-700 text-xl"/>
            </div>
            <div className="w-full h-full" style={{ 
                        backgroundImage: `url(${field.url})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center', // Opsional: mengatur posisi background
                        
                        backgroundRepeat: 'no-repeat'

                    }}>

            </div>
        </div>
            

        </Rnd>

    </div>
    
    )
}

export {DraggableLogo}