import {useState} from "react"
import toast, { Toaster } from "react-hot-toast"
export default function NextPresident(){
    const [president, setPresident] = useState("Vote")

    const handleSelect = (name, message) => {
        setPresident(name)
        toast.success(message)
    }
    const errorHandle = (name,message) => {
        setPresident(name)
        toast.error(message)
    }

    return(
        <>
        <Toaster position="top-right" reverseOrder={false} />
        <div
          className="min-h-screen w-full p-6 flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://i.ytimg.com/vi/3U0a2xe4zhk/maxresdefault.jpg')" }}
        >
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <h1 className="mb-4 text-center text-2xl font-semibold text-slate-800">Who will be the next president?</h1>
                <p className="mb-6 rounded-2xl bg-slate-100 px-4 py-3 text-center text-lg font-medium text-slate-700">{president}</p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleSelect("Anura Kumara Dissanayake", "Thank You!")}
                            
                        className="h-12 w-full rounded-xl bg-red-500 px-4 text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        AKD
                    </button>
                    <button
                        onClick={() => errorHandle("Sajith Premadasa", "Eat rice even for one meal!")}
                        className="h-12 w-full rounded-xl bg-green-500 px-4 text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                        Sajith
                    </button>
                    <button
                        onClick={() => errorHandle("Namal Rajapaksa", "How fool you are!")}
                        className="h-12 w-full rounded-xl bg-red-900 px-4 text-white transition hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Namal
                    </button>
                     <button
                        onClick={() => errorHandle("Ranil Wickramasinghe", "Fuck You!")}
                        className="h-12 w-full rounded-xl bg-yellow-500 px-4 text-white transition hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Ranil
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

