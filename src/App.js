import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
// import RequireAuth from './components/RequireAuth';
// import Layout from './components/Layout';
import { Router, Routes, Route, Link } from 'react-router-dom';
import Missing from './components/Missing';
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';
import Admin from './components/Admin';
import Sitters from './components/Sitters';
import Profile from './components/Profile';


function App() {

  return (
    <div>
    <header>
      <nav>
        <Link to="/registration">Регистрация</Link>
        <Link to="/login">Вход</Link>
      </nav>
    </header>

    <Routes>
      <Route path='/' element={<Home />} />
       {/* public routes */}
      
      <Route path="/" element={<Home />} />

      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Registration />} />
      <Route path="linkpage" element={<LinkPage />} /> 
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path='sitters' element={<Sitters />} />
      <Route path='profile' element={<Profile />} />

      {/* we want to protect these routes */}


      <Route path="/" element={<Home />} />



      <Route path="admin" element={<Admin />} />


      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
    </div>
  )
}

export default App;