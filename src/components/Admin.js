import { Link } from "react-router-dom";
import Users from "./Users";
import useAuth from '../hooks/useAuth';
import Missing from "./Missing";
import Unauthorized from "./Unauthorized";
import "./styles/admin.css";

const Admin = () => {
  const { auth } = useAuth();

  if (auth.userRole === 'Admin') {
    return (
      <section className="admin-container">
        <header className="admin-header">
          <h1>Панель администратора</h1>
        </header>

        <div className="admin-content">
          <p className="admin-welcome">Добро пожаловать, {auth.username}!</p>
          <Users />
        </div>

        <footer className="admin-footer">
          <Link to="/" className="home-link">На главную</Link>
        </footer>
      </section>
    );
  } else if (auth.userRole === 'PetSitter' || auth.userRole === 'PetOwner') {
    return <Missing />;
  } else {
    return <Unauthorized />;
  }
};

export default Admin;