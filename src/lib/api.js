// Axios provides one reusable HTTP client for calls to the backend API.
import axios from "axios";

// Keeping the server address in one place makes API calls easier to maintain.
const api = axios.create({
     baseURL: "http://localhost:3000"   
});
export default api;
