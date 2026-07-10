import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import api from "../lib/api.js";
export default function RegisterPage(){

    const [email, setEmail] = useState("");
    const[firstname, setfirstname] = useState("");
    const[lastname, setlastname] = useState("");
    const [password, setPassword] = useState("");
    const[confirmpassword, setconfirmpassword] = useState("");

    const navigate = useNavigate(); 

    function handleRegister(){
        api.post("/users/login", {
            email: email,
            password: password
        }).then((res) => {
                toast.success("Login successful!");
                console.log(res.data.token);
                console.log(res.data.isadmin);
                localStorage.setItem("token", res.data.token);
                if(res.data.isadmin){
                  navigate("/admin");  
                }
                else{
                  navigate("/");
                }
            
            })
            .catch((err) => {
                toast.error("Invalid email or password");
                console.error(err);
            });
    }
    return(
        <div className="w-full h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center">
              <div className="w-112.5 h-140 backdrop-blur-md shadow-2xl rounded-lg p-2 flex flex-col items-center">
                <img src="/logologin.png" className="w-25 h-17.5 object-cover m-1 rounded-lg"/>
                <h1 className="text-2xl font-bold text-white">Login</h1>
                <label className="text-black mt-4 w-full font-semibold">Email</label>
                <input 
                      value={email}
                      onChange={
                        (e)=>{
                             setEmail(e.target.value)
                        }
                      }
                      type="email" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="example@gmail.com"/>
                <div className="w-full h-12 flex">
                    
                </div>
                <label className="text-black mt-4 w-full font-semibold">First Name</label>
                <input 
                      value={firstname}
                      onChange={
                        (e)=>{
                             setfirstname(e.target.value)
                        }
                      }
                      type="text" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="Enter your first name"/>
                <label className="text-black mt-4 w-full font-semibold">Last Name</label>
                <input 
                      value={lastname}
                      onChange={
                        (e)=>{
                             setlastname(e.target.value)
                        }
                      }
                      type="text" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="Enter your last name"/>
                         
                <label className="text-black mt-4 w-full font-semibold">Password</label>
                <input 
                      value={password}
                      onChange={
                        (e)=>{
                             setPassword(e.target.value)
                        }
                      }
                      type="password" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="Enter your password"/>
                
                
                <button onClick={handleRegister} className="w-full h-14 bg-blue-700 text-white rounded-md mt-4 hover:bg-blue-600 transition-colors">Register</button>
                <p className="text-black mt-4 ">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link></p>
                <button className="w-full h-14 bg-blue-700 text-white rounded-md mt-4 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"><FcGoogle />Register with Google</button>
                
              </div>
        </div>
    )
}
