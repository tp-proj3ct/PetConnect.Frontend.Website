import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
        <NavLink to="/registration">Регистрация</NavLink>
        <NavLink to="/login">Вход</NavLink>
        <NavLink to="/">Главная</NavLink>
      </nav> 
      );
}
 
export default Navbar;