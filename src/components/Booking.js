import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../constants/constants";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "./styles/booking.css"
import { axiosPrivate } from "../api/axios";
import { useNavigate } from "react-router-dom";

// TODO



const Booking = ({ service, sitter, closeBooking }) => {
    
    
    const [petInfo, setPetInfo] = useState([]);
    const [petName, setPetName] = useState([]);
    const [selectedPets, setSelectedPets] = useState([])
    const [serviceAddress, setServiceAddress] = useState("");
    const [additionalRequirements, setAdditionalRequirements] = useState("");
    const [customerComment, setCustomerComment] = useState("");

    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    console.log(JSON.stringify(auth.userRole));

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserPets = async () => {
            try{
                const response = await axiosPrivate.get(API_ENDPOINTS.PETS_URL, {
                    signal: controller.signal,
                });

                console.log("Pet data", response.data);
                if (isMounted) {
                    setPetInfo(response.data);
                  }
            } catch (err) {
                console.error(err);
            }
        };

        getUserPets();

        return () => {
            isMounted = false;
            controller.abort();
          };

    }, [axiosPrivate]);

    const handlePetSelection = (petId) => {
        setSelectedPets((prev) => 
          prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
        );
      };


      const handleBooking = async () => {
        if (selectedPets.length === 0) {
          alert("Выберите хотя бы одного питомца!");
          return;
        }
    
        const payload = {
          serviceId: service.id,
          petIds: selectedPets,
          serviceAddress,
          additionalRequirements,
          customerComment,
        };
    
        try {
          const response = await axiosPrivate.post(API_ENDPOINTS.BOOKING_URL, payload);
          console.log("Booking successful", response.data);
          alert("Бронирование подтверждено!");
          closeBooking();
        } catch (err) {
          console.error("Booking error", err);
          alert("Ошибка при бронировании.");
        }
      };

      return (
        <div>
        {auth.userRole === "" ? (
            <article>
            <p style={{color: "white"}}>Войдите в аккаунт, чтобы забронировать услугу</p>
            <button className="button" onClick={() => navigate("/login")}>
              Войти
            </button>
          </article>
        ) : 

        <div className="booking-container">
        <h2>Бронирование услуги</h2>
        <p><strong>Сервис:</strong> {service.name}</p>
        <p><strong>Описание:</strong> {service.description}</p>
        <p><strong>Цена:</strong> {service.price} рублей</p>
        <p><strong>Питомцевод:</strong> {sitter.name} {sitter.surname}</p>
  
        <label>Выберите питомцев:</label>
        <div className="pet-selection">
          {petInfo.map((pet) => (
            <div key={pet.id} className="pet-option">
              <input
                type="checkbox"
                id={`pet-${pet.id}`}
                value={pet.id}
                checked={selectedPets.includes(pet.id)}
                onChange={() => handlePetSelection(pet.id)}
              />
              <label htmlFor={`pet-${pet.id}`}>{pet.name}</label>
              
            </div>
          ))}
        </div>
  
        <label>Адрес услуги:</label>
        <input
          type="text"
          value={serviceAddress}
          onChange={(e) => setServiceAddress(e.target.value)}
          placeholder="Введите адрес"
        />
  
        <label>Дополнительные требования:</label>
        <textarea
          value={additionalRequirements}
          onChange={(e) => setAdditionalRequirements(e.target.value)}
          placeholder="Например, особый уход за питомцем..."
        />
  
        <label>Комментарий клиента:</label>
        <textarea
          value={customerComment}
          onChange={(e) => setCustomerComment(e.target.value)}
          placeholder="Добавьте комментарий..."
        />
  
        <button className="confirm-button" onClick={handleBooking}>Подтвердить</button>
        <button className="cancel-button" onClick={closeBooking}>Отмена</button>
      </div>}
      </div>
      );
    };


export default Booking;