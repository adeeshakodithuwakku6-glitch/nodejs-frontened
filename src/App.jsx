// Import the pages that are displayed by the application's routes.
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/registerPage.jsx'
import AdminPage from './pages/adminPage.jsx'
import TestPage from './pages/testPage.jsx'
import Homepage from './pages/homepage.jsx'
import ProductOverview from './pages/productOverview.jsx'
import CartPage from './pages/cartPage.jsx'
import InvoicePage from './pages/invoicePage.jsx'
import OrderCheckoutPage from './pages/orderCheckoutPage.jsx'
import OrderTrackingPage from './pages/orderTrackingPage.jsx'
import ProfilePage from './pages/profilePage.jsx'
import OrderBillPage from './pages/orderBillPage.jsx'
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
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:productID" element={<ProductOverview />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/checkout" element={<OrderCheckoutPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders/:orderId/bill" element={<OrderBillPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
