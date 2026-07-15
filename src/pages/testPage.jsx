import {useState} from "react"
import UploadMedia from "../lib/uploadMedia.js"
import toast, { Toaster } from "react-hot-toast"

export default function TestPage(){
    const[file,setfile]=useState(null)
    function Uploadfile(file){
        UploadMedia(file).then((publicUrl)=>{
            console.log(publicUrl)
            toast.success("File uploaded successfully!")
        }).catch((err)=>{
            console.log(err)
            toast.error("Error uploading file!")
        })
    }
 return( 
    
    <div className="w-full h-full flex items-center justify-center m-6">
      <input type="file" onChange={
        (e)=>{
            setfile(e.target.files[0])
            console.log(e.target.files[0])
        }
      }
      >


      </input>
      <button onClick={Uploadfile} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
        Upload
      </button>
    </div>
 )
    
}

