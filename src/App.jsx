import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { FaHome } from "react-icons/fa";

function App() {

  return (
    <div>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
      
    </div>
  )
}

export default App
