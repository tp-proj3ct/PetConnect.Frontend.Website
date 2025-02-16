import { Link } from "react-router-dom";

//TODO
const Missing = () => {
  return (
    <section style={{ padding: "100px", minHeight: "863px" }}>
      <p>Страница не найдена</p>
      <div className="flexGrow">
        <Link to="/">Вернуться на главную страницу</Link>
      </div>
    </section>
  );
};

export default Missing;
