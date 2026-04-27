import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './styles/variables.css'
import './styles/global.css'
import './styles/typography.css'
import './styles/utilities.css'
import App from './App'

document.documentElement.setAttribute('data-theme', 'light')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
