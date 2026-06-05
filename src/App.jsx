import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/testPage.jsx'
import { Toaster } from "react-hot-toast"
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { FaHome } from "react-icons/fa";

function App() {

  return (
    <div>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
      
    </div>
  )
}

export default App
