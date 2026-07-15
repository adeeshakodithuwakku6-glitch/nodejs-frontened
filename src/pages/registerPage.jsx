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
       if(!password || !confirmpassword){
          toast.error("Please enter both password fields");
          return;
        }

        if(password !== confirmpassword){
          toast.error("Passwords do not match");
          return;
        }
        api.post("/users/", {
            email: email,
            password: password,
            firstName: firstname,
            lastName: lastname
        }).then((res) => {
                toast.success("Registration successful!");
                
                navigate("/login");
            
            })
            .catch((err) => {
                toast.error("Registration failed. Please try again.");
                console.error(err);
            });
    }
    return(
        <div className="w-full h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex items-center justify-center">
              <div className="w-112.5 h-140 backdrop-blur-md shadow-2xl rounded-lg p-2 flex flex-col items-center">
                <img src="/logologin.png" className="w-25 h-17.5 object-cover m-1 rounded-lg"/>
                <h1 className="text-2xl font-bold text-white">Register</h1>
                
                <label className="text-black mt-4 w-full font-semibold">Email</label>
                <input 
                      value={email}
                      onChange={
                        (e)=>{
                             setEmail(e.target.value)
                        }
                      }
                      type="email" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="example@gmail.com"/>
                
                

                <div className="w-full h-12 flex gap-2 mb-4">

                  <div className="w-1/2 h-12 flex-col">
                     <label className="text-black mt-4 w-full font-semibold">First Name</label>
                     <input 
                      value={firstname}
                      onChange={
                        (e)=>{
                             setfirstname(e.target.value)
                        }
                      }
                      type="text" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="Enter your first name"/>

                  </div>
                  <div className="w-1/2 h-12 flex-col">
                     <label className="text-black mt-4 w-full font-semibold">Last Name</label>
                     <input 
                      value={lastname}
                      onChange={
                        (e)=>{
                             setlastname(e.target.value)
                        }
                      }
                      type="text" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="Enter your last name"/>
                  </div>
                </div>
                
                <label className="text-black mt-4 w-full font-semibold">Password</label>
                <input 
                      value={password}
                      onChange={
                        (e)=>{
                             setPassword(e.target.value)
                        }
                      }
                      type="password" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="Enter your password"/>
                <label className="text-black mt-2 w-full font-semibold">Confirm Password</label>
                <input 
                      value={confirmpassword}
                      onChange={
                        (e)=>{
                             setconfirmpassword(e.target.value)
                        }
                      }
                      type="password" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="Confirm your password"/>
                
                <button onClick={handleRegister} className="w-full h-16 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl mt-4 shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-blue-500 transition-all duration-200 font-semibold text-lg">Register</button>
                <p className="text-black mt-4 ">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link></p>
                <button className="w-full h-14 bg-white/90 text-gray-800 rounded-xl mt-4 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base"><FcGoogle className="text-xl" />Register with Google</button>
                
              </div>
        </div>
    )
}
