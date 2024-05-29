import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Tasks from "./pages/Tasks";
import Notifications from "./pages/Notifications";
import Announcement from "./pages/Announcement";
import Create from "./pages/Create";


function App() {
  return (
    <div className="App">
      <CssBaseline>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/announcement" element={<Announcement />} />
            <Route path="/create" element={<Create />} />
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </CssBaseline>
    </div>
  );
}

export default App;