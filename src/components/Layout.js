import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "name", role: "role" });
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="layout-container">
      <header className="header">
        <h1>Панель управления</h1>
      </header>

      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/dashboard">Дашборд</Link></li>
            <li><Link to="/settings">Настройки</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        {loading ? (
          <p>Загрузка данных...</p>
        ) : (
          <div className="user-info">
            <p>Добро пожаловать, {user.name}!</p>
            <p>Роль: {user.role}</p>
          </div>
        )}
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2025 Все права защищены</p>
      </footer>
    </div>
  );
};

export default Layout;