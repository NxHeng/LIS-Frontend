import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CreateContextProvider } from './context/CreateContext'
import { CategoryContextProvider } from './context/CategoryContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CategoryContextProvider>
      <CreateContextProvider>
        <App />
      </CreateContextProvider>
    </CategoryContextProvider>
  </React.StrictMode>,
)
