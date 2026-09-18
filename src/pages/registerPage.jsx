import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import { getUserFromAuthResponse, saveAuth } from "../lib/auth";
import techNestLogo from "../assets/Tech Nest logo.jfif";

export default function RegisterPage(){

  // Store each registration field as controlled form state.
    const [email, setEmail] = useState("");
    const[firstname, setfirstname] = useState("");
    const[lastname, setlastname] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const[confirmpassword, setconfirmpassword] = useState("");

    const navigate = useNavigate(); 

    // Validate the passwords before creating the new account through the API.
    function handleRegister(){
        if (!gender) {
          toast.error("Please select your gender");
          return;
        }
        if(!password || !confirmpassword){
          toast.error("Please enter both password fields");
          return;
        }

        if(password !== confirmpassword){
          toast.error("Passwords do not match");
          return;
        }
        api.post("/users", {
            email: email,
            password: password,
            firstName: firstname,
            lastName: lastname,
            gender: gender
        }).then((res) => {
                toast.success("Registration successful!");
                if (res.data.token) {
                  localStorage.setItem("token", res.data.token);
                  saveAuth({ token: res.data.token, isAdmin: Boolean(res.data.isadmin), user: { ...getUserFromAuthResponse(res.data, email), firstName: firstname, lastName: lastname, gender } });
                  navigate("/");
                } else {
                  navigate("/login");
                }
            
            })
            .catch((err) => {
                toast.error("Registration failed. Please try again.");
                console.error(err);
            });
    }
    return(
      // Render the registration form and account navigation links.
          <div className="auth-page flex items-center justify-center">
            <div className="auth-card flex flex-col items-center">
                <img src={techNestLogo} alt="TechNest logo" className="w-25 h-17.5 object-cover m-1 rounded-lg"/>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Create your account</p><h1 className="mt-2 text-3xl font-black text-white">Register</h1>
                
                <label className="text-black mt-4 w-full font-semibold">Email</label>
                <input 
                      value={email}
                      onChange={
                        (e)=>{
                             setEmail(e.target.value)
                        }
                      }
                      type="email" className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200" placeholder="example@gmail.com"/>
                
                

                <div className="mb-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-2">

                  <div className="flex w-full flex-col sm:w-1/2">
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
                  <div className="flex w-full flex-col sm:w-1/2">
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

                <label className="text-black mt-4 w-full font-semibold" htmlFor="gender">Gender</label>
                <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required className="w-full h-14 rounded-xl px-4 py-3 border border-white/70 bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-400/40 transition-all duration-200">
                  <option value="" disabled>Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                
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
                
                <button onClick={handleRegister} className="w-full h-16 bg-linear-to-r from-blue-700 to-blue-600 text-white rounded-xl mt-4 shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-blue-500 transition-all duration-200 font-semibold text-lg">Register</button>
                <p className="text-black mt-4 ">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link></p>
                <button className="w-full h-14 bg-white/90 text-gray-800 rounded-xl mt-4 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base"><FcGoogle className="text-xl" />Register with Google</button>
                
              </div>
        </div>
    )
}
