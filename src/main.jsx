// Import React's entry-point helpers and the application's root component.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import techNestLogo from './assets/Tech Nest logo.jfif'

document.querySelector('link[rel="icon"]').href = techNestLogo

// Mount the React application inside the root element from index.html.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter enables navigation without full-page reloads. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
