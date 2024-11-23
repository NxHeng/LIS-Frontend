import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Details from "./pages/Details";
import Tasks from "./pages/Tasks";
import Notifications from "./pages/Notifications";
import Announcement from "./pages/Announcement";
import Create from "./pages/Create";
import Login from './pages/Login';
import StaffRegister from './pages/StaffRegister';
import ClientRegister from './pages/ClientRegister';
import Profile from './pages/Profile';
import ChangePassword from "./pages/ChangePassword";
import ManageUsers from "./pages/ManageUsers";
import ErrorPage from "./pages/ErrorPage";
import TempDetail from "./pages/TempDetail";
import ExpiredPage from "./pages/ExpiredPage";

import MyCases from "./pages/MyCases";
import MyDetails from "./pages/MyDetails";

import { useAuthContext } from './context/AuthContext';

import AuthRoutes from './AuthRoutes';
import ProtectedRoute from './ProtectedRoutes';

function App() {
  const { loading, user } = useAuthContext();

  if (loading) {
    return null; // Render nothing or a loader while checking authentication
  }
  return (
    <div className="App">
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register-staff" element={<StaffRegister />} />
            <Route path="/register-client" element={<ClientRegister />} />
            {/* Temp Detail Route */}
            <Route path="/temporary/:caseId/:token" element={<TempDetail />} />
            {/* Expired Page Route */}
            <Route path="/temporary/expired" element={<ExpiredPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Shared Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />

            {/* Staff Routes */}
            {user?.role !== 'client' && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/details/:id" element={<Details />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/announcement" element={<Announcement />} />
                <Route path="/create" element={<Create />} />
              </>
            )}

            {/* Admin Routes */}
            {user?.role === 'admin' && (
              <>
                <Route path="/manageusers" element={<ManageUsers />} />
              </>
            )}

            {/* Client Routes */}
            {user?.role === 'client' && (
              <>
                <Route path="/client/mycases" element={<MyCases />} />
                <Route path="/client/mycases/details/:id" element={<MyDetails />} />
              </>
            )}

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<ErrorPage />} />
          </Route>

        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
