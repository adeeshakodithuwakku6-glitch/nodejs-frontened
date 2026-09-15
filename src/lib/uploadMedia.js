// Create a Supabase client for storing uploaded product images.
import { createClient } from "@supabase/supabase-js"
const url = "https://fzigphjmphbuppeperso.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6aWdwaGptcGhidXBwZXBlcnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjU1NTQsImV4cCI6MjA5OTcwMTU1NH0.-F6i-64P0TDRiDWXI3N0se31B_XCczNfju03304n8zk"
const supabase = createClient(url, key)

export default function UploadMedia(file){
    // Return a promise so callers can wait for the public image URL.
    return new Promise(
        (resolve,reject)=>{
            // A missing file cannot be uploaded.
            if(file == null){
                return reject("File is null")
            }

            // Normalize the original name and add a unique prefix to avoid collisions.
            const timestamp = new Date().getTime();
            const safeName = file.name
                .normalize("NFKD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9._-]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^\.+|\.+$/g, "") || "file";
            const fileName = `${timestamp}-${Math.random().toString(36).slice(2, 10)}-${safeName}`;

            // Upload the file, then convert its storage path into a public URL.
            supabase.storage.from("images").upload(fileName, file).then(
                ()=>{
                    const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl
                    resolve(publicUrl)
                }
            ).catch((err)=>{
                reject(err)
            })
        }
    )
}