import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Missing from './components/Missing';
import LinkPage from './components/LinkPage';
import Unauthorized from './components/Unauthorized';

const ROLES = {
  PetSitter : 'PetSitter',
  PetOwner : 'PetOwner',
  Admin : 'Admin'
}

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
       {/* public routes */}
       <Route element={<RequireAuth allowedRoles={[ROLES.PetSitter, ROLES.Admin, ROLES.PetOwner]} />}>
        <Route path="/" element={<Home />} />
       </Route>

      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Registration />} />
      <Route path="linkpage" element={<LinkPage />} /> 
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* we want to protect these routes */}

      <Route element={<RequireAuth allowedRoles={[ROLES.PetOwner]} />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  )
}

export default App;
