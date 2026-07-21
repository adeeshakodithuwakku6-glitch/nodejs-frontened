import { FaCirclePlus } from "react-icons/fa6";
import {Link} from "react-router-dom";
export default function AdminProducts() {
    return (
        <div className="w-full h-full flex flex-col p-6">
            <Link to="/admin/add-product" className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/40 transition-all duration-200 hover:scale-105 hover:bg-blue-800 hover:shadow-xl fixed right-10 bottom-10">
                <FaCirclePlus className="text-3xl" />
            </Link>
        </div>
    );
}