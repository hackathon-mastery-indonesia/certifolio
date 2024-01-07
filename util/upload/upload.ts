const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dskdlrjg6/upload';

export const toBlob = async (imageDataURL : string) : Promise<Blob> =>{
    const blob = await fetch(imageDataURL).then((res) => res.blob());
    return blob;
}

export const uploadToCloudinary = async (blob : Blob) : Promise<string> => {
    const fd = new FormData();
    fd.append('upload_preset', 'ml_default');
    fd.append('file', blob);
    const res= await fetch(CLOUDINARY_URL, {
        method:'POST',
        body: fd
    })
    //console.log(fd)
    const resJson = await res.json();
    //console.log(resJson)
    return resJson.secure_url;
}