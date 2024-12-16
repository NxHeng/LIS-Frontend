import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { CreateContextProvider } from './context/CreateContext'
import { CategoryContextProvider } from './context/CategoryContext'
import { CaseContextProvider } from './context/CaseContext'
import { FieldContextProvider } from './context/FieldContext'
import { TaskFieldContextProvider } from './context/TaskFieldContext.jsx'
import { TaskContextProvider } from './context/TaskContext'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { DashboardContextProvider } from './context/DashboardContext.jsx'
import { AnnouncementContextProvider } from './context/AnnouncementContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { DocumentContextProvider } from './context/DocumentContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <AnnouncementContextProvider>
        <SocketContextProvider>
          <AuthContextProvider>
            <FieldContextProvider>
              <TaskFieldContextProvider>
                <TaskContextProvider>
                  <CaseContextProvider>
                    <CategoryContextProvider>
                      <CreateContextProvider>
                        <DashboardContextProvider>
                          <DocumentContextProvider>
                            <App />
                          </DocumentContextProvider>
                        </DashboardContextProvider>
                      </CreateContextProvider>
                    </CategoryContextProvider>
                  </CaseContextProvider>
                </TaskContextProvider>
              </TaskFieldContextProvider>
            </FieldContextProvider>
          </AuthContextProvider>
        </SocketContextProvider>
      </AnnouncementContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
