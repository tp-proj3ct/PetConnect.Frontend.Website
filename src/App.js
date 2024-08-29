import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/Home";
// import RequireAuth from './components/RequireAuth';
// import Layout from './components/Layout';
import NavBar from "./components/UI/NavBarUI/NavBar";
import SitterPage from "./components/SitterPage";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Missing from "./components/Missing";
import LinkPage from "./components/LinkPage";
import Unauthorized from "./components/Unauthorized";
import Admin from "./components/Admin";
import Sitters from "./components/Sitters";
import Profile from "./components/Profiles/Profile"; // Новый компонент для профиля

function App() {
  return (
    <div className="App">

        <NavBar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        

        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="sitters" element={<Sitters />} />
        <Route path="sitter/:id" element={<SitterPage />} />
        <Route path="profile" element={<Profile />} />


        <Route path="/" element={<Home />} />
        <Route path="admin" element={<Admin />} />

        <Route path="*" element={<Missing />} />
      </Routes>
    </div>
  );
}

export default App;
