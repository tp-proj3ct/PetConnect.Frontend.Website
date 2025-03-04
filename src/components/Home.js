import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import main_photo from "../media/homepage/89f3929cebcdc726be47.webp";
import AuthContext from "../context/AuthProvider";
import useAuth from "../hooks/useAuth";
import "./styles/home.css";

const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { auth } = useAuth();

  return (
    <section className="home-container">
      {/* Главный баннер */}
      <div className="banner">
        <img className="main_photo" src={main_photo} alt="Главное изображение" />
        <div className="banner-content">
          <h1>Pet Connect - наши сиделки для Ваших питомцев!</h1>
          <p>Живите полной жизнью, не беспокоясь о своих любимцах</p>
          <button className="find-sitter-btn" onClick={() => navigate("/sitters")}>
            Найти сиделку
          </button>
        </div>
      </div>

      {/* Основная информация */}
      <div className="info-section">
        <div className="info-box">
          <h2>Лучше для владельцев домашних животных</h2>
          <p>Владельцы домашних животных могут быть спокойны, зная, что об их питомцах (и доме) заботятся, пока их нет дома.</p>
        </div>
        <div className="info-box">
          <h2>Лучше для домашних животных</h2>
          <p>Домашние животные чувствуют себя комфортно дома, если рядом с ними есть няня, которая дарит им любящую заботу и компанию.</p>
        </div>
        <div className="info-box">
          <h2>Лучше для сиделок</h2>
          <p>Сиделки обменивают свое время, заботу на интересное проживание в семье и уникальный опыт.</p>
        </div>
      </div>


      
    </section>
  );
};

export default Home;