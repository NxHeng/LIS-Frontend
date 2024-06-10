import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CreateContextProvider } from './context/CreateContext'
import { CategoryContextProvider } from './context/CategoryContext'
import { CaseContextProvider } from './context/CaseContext'
import { TaskContextProvider } from './context/TaskContext'
import { AuthContextProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskContextProvider>
      <CaseContextProvider>
        <CategoryContextProvider>
          <CreateContextProvider>
            <AuthContextProvider>
              <App />
            </AuthContextProvider>
          </CreateContextProvider>
        </CategoryContextProvider>
      </CaseContextProvider>
    </TaskContextProvider>
  </React.StrictMode>,
)
