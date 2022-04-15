
export const CloudImage=async(form_data:FormData)=>{
    const cloudinary_url = process.env.NEXT_PUBLIC_CLOUDINARY_URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDNAME
    try{
        const imgUpload = await fetch(`${cloudinary_url}/${cloudName}/image/upload`,{
            method:"POST",
            body:form_data
        })
         const data = await imgUpload.json()
    
         if(data){
             return data.secure_url
         }

     }catch(err){

     }

     
}