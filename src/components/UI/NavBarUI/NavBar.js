import { NavLink, useNavigate } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import { useContext } from "react";
import AuthContext from "../../../context/AuthProvider";
import '../../styles/navbar.css'

const NavBar = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const logout = () => {
    setAuth({});
    navigate('/', {});
    window.location.reload();
  }

  if (auth.userRole === '') {
    return (
      <div className="topnav">
        <div className="topnav-right">
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/sitters">Сиделки</NavLink>
        <NavLink to="/registration">Регистрация</NavLink>
        <NavLink to="/login">Вход</NavLink>
      </div>
      </div>
    )
  } else {
    return (
      <div className="topnav">
        <div className="topnav-right">
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/profile">Личный кабинет</NavLink>
        <NavLink to="/sitters">Сиделки</NavLink>
        <NavLink className={"topnav-logout"} onClickCapture={logout}>Выйти</NavLink>
        </div>
      </div>
    )
  }
};
 
export default NavBar;