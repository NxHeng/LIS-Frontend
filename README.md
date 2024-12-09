# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
#   L I S - F r o n t e n d 
 
 

src
├─ AuthRoutes.jsx
├─ components
│  ├─ Announcement
│  │  ├─ AnnouncementCard.jsx
│  │  └─ AttachmentUpload.jsx
│  ├─ Authentication
│  │  └─ AuthNavbar.jsx
│  ├─ Background.jsx
│  ├─ Cases
│  │  ├─ CaseCard.jsx
│  │  ├─ CaseDetails.jsx
│  │  ├─ CaseLog
│  │  │  ├─ CaseLog.jsx
│  │  │  ├─ LogCard.jsx
│  │  │  └─ LogDialog.jsx
│  │  ├─ ClientCaseCard.jsx
│  │  ├─ CollapsibleRow.jsx
│  │  ├─ Documents
│  │  ├─ ContextMenu.jsx
│  │  │  ├─ Documents.jsx
│  │  │  ├─ FileItem.jsx
│  │  │  └─ ...
│  │  ├─ EditCaseDetails.jsx
│  │  ├─ EditMatterDetails.jsx
│  │  ├─ MatterDetails.jsx
│  │  └─ Tasks
│  │     ├─ AddTaskBar.jsx
│  │     ├─ TaskDetail.jsx
│  │     └─ ...
│  ├─ Create
│  │  ├─ Case
│  │  │  ├─ NewCase.jsx
│  │  │  └─ NewCaseDetails.jsx
│  │  └─ Category
│  │     ├─ CategoryCard.jsx
│  │     ├─ ...
│  ├─ Dashboard
│  │  └─ TasksLinearProgress.jsx
│  ├─ DeleteDialog.jsx
│  ├─ Footer.jsx
│  ├─ ManageUsers
│  │  ├─ UserApprovalDialog.jsx
│  │  └─ UserTable.jsx
│  ├─ Navbar.jsx
│  └─ Tasks
│     ├─ CentralTaskDetail.jsx
│     └─ CentralTaskItem.jsx
├─ context
│  ├─ AnnouncementContext.jsx
│  ├─ AuthContext.jsx
│  ├─ CaseContext.jsx
│  └─ ...
├─ main.jsx
├─ pages
│  ├─ Announcement.jsx
│  ├─ Cases.jsx
│  ├─ Create.jsx
│  ├─ Details.jsx
│  ├─ MyCases.jsx
│  ├─ MyDetails.jsx
│  └─ ...
└─ ProtectedRoutes.jsx
