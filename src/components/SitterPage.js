import React, { useState, useEffect, useRef } from "react";
import { API_ENDPOINTS } from "../constants/constants";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import './styles/sitterspage.css';
import Booking from "./Booking";

const SitterPage = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [isPopUpOpen, setPopupOpen] = useState(false);


  const [profile, setProfile] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {id} = useParams();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || `/sitter/${id}`;
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();
  console.log(JSON.stringify(auth.userRole));





  useEffect(() => {
    setErrMsg("");
  }, [reviewRating, reviewComment]);

  const toggleAddReview = () => {
    setIsAddingReview(!isAddingReview)
  }

  const handleAddReview = async (e) => {
    e.preventDefault();
    try{
      const payload = {
        rating: reviewRating,
        comment: reviewComment
      };

      const response = await axiosPrivate.post(`${API_ENDPOINTS.PET_SITTERS}/${id}/reviews`, payload);
      console.log(response.data);



      setReviews([...reviews, response.data]);

      setIsAddingReview(false);

      setReviewRating("");
      setReviewComment("");

      // navigate(from, {replace: true});
    } catch(err) {
      console.error(err.response);
    }
  }

    useEffect (() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSitterInfo = async () => {
    try {
        const response = await axiosPrivate.get(`${API_ENDPOINTS.PET_SITTERS}/${id}`,
          {signal: controller.signal,}
        );
        console.log(response.data);
        isMounted && setProfile(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axiosPrivate.get(`${API_ENDPOINTS.PET_SITTERS}/${id}/reviews`,
        {signal: controller.signal}
      )
      console.log(response.data);
      isMounted && setReviews(response.data);
      
    } catch(err){
      console.error(err);
    }
  };

    const getServicesInfo = async () => {
      try{
        const response = await axiosPrivate.get(`${API_ENDPOINTS.PET_SITTERS}/${id}/services`, 
          {signal: controller.signal,}
        )
        console.log(response.data);
        
        isMounted && setServices(response.data);
        
      } catch (err){
        console.error(err);
      }
    };
  
      getSitterInfo();
      getServicesInfo();
      getReviews();
      return () => {
        isMounted = false;
        controller.abort();
      };

  }, []);

  return (
    <div className="sitter-page">
      <h1>
        {profile.name} {profile.surname}
      </h1>

      {/* Секция с услугами */}
      <div className="services-section">
        <h2>Услуги</h2>
        {services.length ? (
          <div className="services-list">
            {services.map((service) => (
              <div className="service-item" key={service.id}>
                <p>Услуга: {service.name}</p>
                <p>Описание: {service.description}</p>
                <p>Цена: {service.price} рублей</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No services to display</p>
        )}
      </div>

      {/* Секция с отзывами */}
      <div className="reviews-section">
        <h2>Отзывы</h2>
        {reviews.length ? (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div className="review-item" key={review.id}>
                <p>Комментарий: {review.comment}</p>
                <p>Рейтинг: {review.rating}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Отзывов пока нет.</p>
        )}
      </div>

      {/* Форма добавления отзыва */}
      {auth.userRole === "" ? (
        <article>
          <p>Войдите в аккаунт, чтобы оставить отзыв</p>
          <button className="button" onClick={() => navigate("/login")}>
            Войти
          </button>
        </article>
      ) : (
        <>
          <button className="button" onClick={() => setIsAddingReview(true)}>
            Добавить отзыв
          </button>
          {isAddingReview && (
            <form className="add-review-form" onSubmit={handleAddReview}>
              <label>Рейтинг: </label>
              <input
                type="number"
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
              />
              <label>Комментарий: </label>
              <input
                type="text"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
              <button className="button" type="submit">
                Отправить отзыв
              </button>
              <button onClick={toggleAddReview}>
                {isAddingReview ? "Отменить" : "Отправить отзыв"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default SitterPage;
