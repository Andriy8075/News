import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { fetchCsrfToken } from './utils/api.js'

console.log('fetchCsrfToken');
fetchCsrfToken()

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
)