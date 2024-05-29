import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CreateContextProvider } from './context/CreateContext'
import { CategoryContextProvider } from './context/CategoryContext'
import { TemplateContextProvider } from './context/TemplateContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TemplateContextProvider>
      <CategoryContextProvider>
        <CreateContextProvider>
          <App />
        </CreateContextProvider>
      </CategoryContextProvider>
    </TemplateContextProvider>
  </React.StrictMode>,
)
