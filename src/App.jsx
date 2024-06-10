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
import Register from './pages/Register';
import Profile from './pages/Profile';
import ChangePassword from "./pages/ChangePassword";

import { useAuthContext } from './context/AuthContext';

import AuthRoutes from './AuthRoutes';
import ProtectedRoute from './ProtectedRoutes';

function App() {
  const { loading } = useAuthContext();

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
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/details/:id" element={<Details />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
          </Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
