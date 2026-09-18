import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import { getUserFromAuthResponse, saveAuth } from "../lib/auth";
import techNestLogo from "../assets/Tech Nest logo.jfif";

export default function LoginPage(){
  // Keep the form fields controlled so their values are available during login.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate(); 

    // Send the credentials to the API and route the user based on their role.
    async function handleLogin(){
      if (!email.trim() || !password) {
        toast.error("Enter your email and password.");
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await api.post("/users/login", {
            email: email,
            password: password
        });
                toast.success("Login successful!");
                localStorage.setItem("token", res.data.token);
                saveAuth({
                  token: res.data.token,
                  isAdmin: Boolean(res.data.isadmin ?? res.data.isAdmin ?? res.data.admin),
                  user: getUserFromAuthResponse(res.data, email),
                });
                if(res.data.isadmin ?? res.data.isAdmin ?? res.data.admin){
                  navigate("/admin");  
                }
                else{
                  navigate("/");
                }
        } catch (err) {
          const message = err.response?.status === 403
            ? "Your account is blocked. Please contact an administrator."
            : err.response?.data?.message || "Invalid email or password";
          toast.error(message);
          console.error(err);
        } finally {
          setIsSubmitting(false);
        }
    }

    async function handleGoogleSuccess(response) {
      if (!response.credential) {
        toast.error("Google login did not return a credential.");
        return;
      }

      try {
        const res = await api.post("/users/google", {
          credential: response.credential,
        });
        const isAdmin = Boolean(res.data.isadmin ?? res.data.isAdmin ?? res.data.admin);

        localStorage.setItem("token", res.data.token);
        saveAuth({
          token: res.data.token,
          isAdmin,
          user: getUserFromAuthResponse(res.data),
        });
        toast.success("Google login successful!");
        navigate(isAdmin ? "/admin" : "/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google login failed.");
        console.error(err);
      }
    }

    return(
      // Render the login form and links to the other account actions.
          <div className="auth-page flex items-center justify-center">
            <div className="auth-card flex flex-col items-center">
                <img src={techNestLogo} alt="TechNest logo" className="w-25 h-17.5 object-cover m-1 rounded-lg"/>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">Welcome back</p><h1 className="mt-2 text-3xl font-black text-white">Login</h1>
                <label className="text-black mt-4 w-full font-semibold">Email</label>
                <input 
                      value={email}
                      onChange={
                        (e)=>{
                             setEmail(e.target.value)
                        }
                      }
                      type="email" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="example@gmail.com"/>
                <label className="text-black mt-4 w-full font-semibold">Password</label>
                <input 
                      value={password}
                      onChange={
                        (e)=>{
                             setPassword(e.target.value)
                        }
                      }
                      type="password" className="w-full h-14 rounded-md p-2 mb-4 border-2 border-white focus:border-be-zinc-900" placeholder="Enter your password"/>
                <p className="text-black w-full text-right">Forgot your password?<Link to="/forgot-password" className="text-blue-500 hover:underline">Reset here</Link></p>
                <button onClick={handleLogin} disabled={isSubmitting} className="w-full h-14 bg-blue-700 text-white rounded-md mt-4 hover:bg-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Signing in..." : "Login"}</button>
                <p className="text-black mt-4 ">Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
                <div className="w-full mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed.")}
                    useOneTap={false}
                  />
                </div>
                
              </div>
        </div>
    )
}
