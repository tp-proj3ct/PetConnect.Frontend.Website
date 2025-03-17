import { Link } from "react-router-dom";
import "./styles/missing.css";

const Missing = () => {
  return (
    <section className="missing-container">
      <h1 className="missing-title">Ошибка 404</h1>
      <p className="missing-text">Страница не найдена</p>
      <div className="missing-link">
        <Link to="/">Вернуться на главную страницу</Link>
      </div>
    </section>
  );
};

export default Missing;