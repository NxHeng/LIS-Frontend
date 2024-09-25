import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CreateContextProvider } from './context/CreateContext'
import { CategoryContextProvider } from './context/CategoryContext'
import { CaseContextProvider } from './context/CaseContext'
import { TaskContextProvider } from './context/TaskContext'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DashboardContextProvider } from './context/DashboardContext.jsx'
import { AnnouncementContextProvider } from './context/AnnouncementContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { DocumentContextProvider } from './context/DocumentContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DocumentContextProvider>
      <TaskContextProvider>
        <CaseContextProvider>
          <CategoryContextProvider>
            <CreateContextProvider>
              <AuthContextProvider>
                <DashboardContextProvider>
                  <AnnouncementContextProvider>
                    <UserContextProvider>
                      <App />
                    </UserContextProvider>
                  </AnnouncementContextProvider>
                </DashboardContextProvider>
              </AuthContextProvider>
            </CreateContextProvider>
          </CategoryContextProvider>
        </CaseContextProvider>
      </TaskContextProvider>
    </DocumentContextProvider>
  </React.StrictMode>,
)
