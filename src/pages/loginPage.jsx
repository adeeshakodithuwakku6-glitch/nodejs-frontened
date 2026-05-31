export default function LoginPage(){
    return(
        <div className="bg-violet-950 w-60 h-96 ">
            <h2>Login</h2>
            <input type="text" placeholder="Username" className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"/>
            <input type="password" placeholder="Password" className="border-2 border-gray-300 rounded-md p-2 mb-4 w-full"/>
            <button className="bg-green-700 text-white py-2 px-4 rounded-md w-full">Login</button>
        </div>
    )
}