// Import the pages that are displayed by the application's routes.
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/testPage.jsx'
import { Toaster } from "react-hot-toast"
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      {/* Toast messages are available globally for login, registration, and product actions. */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      {/* Define which page React Router should render for each URL. */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
