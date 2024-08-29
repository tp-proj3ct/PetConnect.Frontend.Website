import { Link } from "react-router-dom";

//TODO: create css file for missing page
const Missing = () => {
  return (
    <article style={{ padding: "100px" }}>
      <p>Страница не найдена</p>
      <div className="flexGrow">
        <Link to="/">Вернуться на главную страницу</Link>
      </div>
    </article>
  );
};

export default Missing;
