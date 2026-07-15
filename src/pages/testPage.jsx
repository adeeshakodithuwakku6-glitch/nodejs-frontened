import { useState } from "react"
import UploadMedia from "../lib/uploadMedia.js"

export default function TestPage(){
    const [file, setFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    function handleFileSelect(selectedFile){
        if(selectedFile){
            setFile(selectedFile)
        }
    }

    function Uploadfile(selectedFile){
        if(!selectedFile){
            return
        }

        UploadMedia(selectedFile).then((publicUrl)=>{
            console.log(publicUrl)
        }).catch((err)=>{
            console.log(err)
        })
    }

    function handleDrop(event){
        event.preventDefault()
        setDragActive(false)
        const droppedFile = event.dataTransfer.files?.[0]
        handleFileSelect(droppedFile)
    }

 return( 
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <label
          className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <span className="text-sm font-semibold text-gray-700">Drag and drop image here</span>
          <span className="mt-2 text-sm text-gray-500">or click to choose a file</span>
        </label>

        {file && (
          <p className="mt-3 text-sm text-gray-600">Selected: {file.name}</p>
        )}

        <button onClick={() => Uploadfile(file)} className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600">
          Submit
        </button>
      </div>
    </div>
 )
    
}

