import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";
import Projectspage from "../pages/Projectspage";
import Blogspage from "../pages/blogpage";
import Dashboard from "../pages/Dashboard";
import { PortfolioDataProvider } from "../services/PortfolioDataContext.jsx";

import "./App.css";

function App() {
  return (
    <PortfolioDataProvider>
      <BrowserRouter>
        <Routes>

        {/* Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Full Projects Page */}
        <Route path="/projects" element={<Projectspage />} />


        <Route path="/blogs" element={<Blogspage />} />
        <Route path="/dashboard" element={<Dashboard />} />


        </Routes>
      </BrowserRouter>
    </PortfolioDataProvider>
  );
}

export default App;