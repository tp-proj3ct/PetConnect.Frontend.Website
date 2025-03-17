import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import "./styles/linkpage.css";

const LinkPage = () => {
  const { auth } = useAuth();
  const [redirect, setRedirect] = useState(null);

  const handleNavigation = (path) => {
    if (auth?.user) {
      setRedirect("/");
    } else {
      setRedirect(path);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <section className="linkpage-container">
      <h1 className="linkpage-title">Навигация</h1>
      <p className="linkpage-text">Выберите нужный раздел:</p>

      <div className="linkpage-links">
        <Link to="#" onClick={() => handleNavigation("/login")} className="linkpage-button">
          Вход
        </Link>
        <Link to="#" onClick={() => handleNavigation("/registration")} className="linkpage-button">
          Регистрация
        </Link>
        <Link to="/" className="linkpage-home">
          Вернуться на главную
        </Link>
      </div>
    </section>
  );
};

export default LinkPage;