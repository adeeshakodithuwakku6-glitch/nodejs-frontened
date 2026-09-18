// Import the pages that are displayed by the application's routes.
import LoginPage from './pages/loginPage.jsx'
import ForgotPasswordPage from './pages/forgotPasswordPage.jsx'
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
import NotFoundPage from './pages/notFoundPage.jsx'
import AnnouncementBanner from './components/announcementBanner.jsx'
import { Toaster } from "react-hot-toast"
import { Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'

function App() {
  return (
    <GoogleOAuthProvider clientId="793276565595-a71qrcd4ppj62qd2ko66r9o7o99b0iem.apps.googleusercontent.com">
      <div>
        {/* Toast messages are available globally for login, registration, and product actions. */}
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <AnnouncementBanner />
        {/* Define which page React Router should render for each URL. */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App