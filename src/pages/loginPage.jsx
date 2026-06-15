import { Link } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import api from "../lib/api.js";
export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function handleLogin(){
        api.post("/users/login", {
            email: email,
            password: password
        }).then((res) => {
                toast.success("Login successful!");
                console.log(res.data.token);
                console.log(res.data.isadmin);
                localStorage.setItem("token", res.data.token);
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
                      onChange={
                        (e)=>{
                             setEmail(e.target.value)
                        }
                      }
                      type="email" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="example@gmail.com"/>
                <label className="text-black mt-4 w-full font-semibold">Password</label>
                <input 
                      onChange={
                        (e)=>{
                             setPassword(e.target.value)
                        }
                      }
                      type="password" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="Enter your password"/>
                <p className="text-black w-full text-right">Forgot your password?<Link to="/forgot-password" className="text-blue-500 hover:underline">Reset here</Link></p>
                <button onClick={handleLogin} className="w-full h-14 bg-blue-700 text-white rounded-md mt-4 hover:bg-blue-600 transition-colors">Login</button>
                <p className="text-black mt-4 ">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
                <button className="w-full h-14 bg-blue-700 text-white rounded-md mt-4 hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"><FcGoogle />Login with Google</button>
                
              </div>
        </div>
    )
}
