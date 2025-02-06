import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../constants/constants";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [surname, setSurname] = useState("");
  const [serviceInfo, setServiceInfo] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();

  const handleSelectService = (service) => {
    if (selectedService && selectedService.id === service.id) {
      setSelectedService(null);
      setIsEditingService(false);
    } else {
      setSelectedService(service);
      setServiceName(service.name);
      setServiceDescription(service.description);
      setServicePrice(service.price);
      setIsEditingService(false);
    }
  };

  const toggleEditService = () => {
    setIsEditingService(!isEditingService);
  };

  const toggleAddService = () => {
    setIsAddingService(!isAddingService);
  };

  const handleAddProfilePicture = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("profilePic");
    const file = fileInput.files[0]; // Получаем файл из input

    if (!file) {
      console.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("picture", file); // Добавляем файл в formData

      const response = await axiosPrivate.post(
        `${API_ENDPOINTS.PROFILE_URL}/picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Если сервер возвращает base64
      const imageUrl = `${file.type};base64,${response.data}`;
      setProfilePic(imageUrl);

      navigate("/");
      navigate("/profile");
    } catch (error) {
      console.error("Error response:", error.response);
    }
  };

  const handleAddService = async (e) => {
    // ADD SERVICE
    e.preventDefault();

    try {
      const payload = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice,
      };

      const response = await axiosPrivate.post(
        API_ENDPOINTS.SERVICE_URL,
        payload
      );
      console.log("Response: ", response.data);

      setServiceInfo([...serviceInfo, response.data]);

      setIsAddingService(false);

      setServiceName("");
      setServiceDescription("");
      setServicePrice("");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response: ", error.response);
    }
  };

  //EDIT SERVICE
  const handleEditService = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      return;
    }

    try {
      const payload = {
        name: serviceName,
        description: serviceDescription,
        price: servicePrice,
      };

      console.log("Payload: ", payload);

      const response = await axiosPrivate.put(
        `${API_ENDPOINTS.SERVICE_URL}/${selectedService.id}`,
        payload
      );
      console.log("Response: ", response.data);

      setServiceInfo((prevServiceInfo) =>
        prevServiceInfo.map((service) =>
          service.id === selectedService.id
            ? { ...service, ...payload }
            : service
        )
      );

      setSelectedService(null);

      setServiceName("");
      setServiceDescription("");
      setServicePrice("");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response: ", error.response);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const response = await axiosPrivate.delete(
        `${API_ENDPOINTS.SERVICE_URL}/${serviceId}`
      );
      console.log("Delete service response: ", response.data);

      setServiceInfo(serviceInfo.filter((service) => service.id !== serviceId));
      if (selectedService && selectedService.id === serviceId) {
        setSelectedService(null);
      }
      navigate("/profile", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfile = async (e) => {
    // EDIT PROFILE
    e.preventDefault();

    try {
      setName("");
      setSurname("");

      const payload = {
        name: name || profile.name,
        surname: surname || profile.surname,
      };
      console.log("Sending payload:", payload);

      const response = await axiosPrivate.put(
        API_ENDPOINTS.PROFILE_URL,
        payload
      );
      console.log("Response:", response.data);

      setProfile((prev) => ({
        ...prev,
        name: payload.name,
        surname: payload.surname,
      }));

      setName("");
      setSurname("");

      setIsEditingProfile(false);

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response:", error.response);
      if (!error.response) {
        setErrorMessage("No server response");
      } else if (error.response?.status === 400) {
        setErrorMessage("Missing name or surname");
      } else if (error.response.status === 401) {
        setErrorMessage("Unauthorized");
      } else {
        setErrorMessage("Profile update failed");
      }
    }
  };

  const handleDeleteProfile = async (e) => {
    // DELETE PROFILE
    e.preventDefault(e);

    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.USER_URL);
      console.log("Response: ", response.data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserProfilePicture = async () => {
      try {
        const response = await axiosPrivate.get(
          `${API_ENDPOINTS.PROFILE_URL}/picture`,
          {
            responseType: "arraybuffer", // ожидаем бинарные данные от сервера
            signal: controller.signal,
          }
        );

        // Создаем blob из полученных данных
        const blob = new Blob([response.data], { type: "image/jpeg" });

        // Используем FileReader для преобразования blob в base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageBase64 = reader.result; // это будет base64 строка, включающая data:image/jpeg;base64
          if (isMounted) {
            setProfilePic(imageBase64);
          }
        };
        reader.readAsDataURL(blob); // Преобразуем blob в base64
      } catch (err) {
        console.error(err);
      }
    };

    const getUserProfile = async () => {
      try {
        const response = await axiosPrivate.get(API_ENDPOINTS.PROFILE_URL, {
          signal: controller.signal,
        });

        console.log("User data: ", response.data);
        if (isMounted) {
          setProfile(response.data);
          setName(response.data.name);
          setSurname(response.data.surname);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getUserServices = async () => {
      try {
        const response = await axiosPrivate.get(API_ENDPOINTS.SERVICE_URL, {
          signal: controller.signal,
        });

        console.log("Service data", response.data);
        isMounted && setServiceInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUserProfile();
    getUserProfilePicture();
    getUserServices();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-picture-section">
          {profilePic && (
            <div>
              <img className="profile-photo" src={profilePic} alt="Profile" />
            </div>
          )}

          {profile && (
            <div className="profile-info">
              <h1>
                {profile.name} {profile.surname}
              </h1>
            </div>
          )}
        </div>
        <form onSubmit={handleAddProfilePicture}>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfilePictureFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfilePic(reader.result); // Сохранение результата для отображения превью
                };
                reader.readAsDataURL(file); // Чтение файла как Data URL
              }
            }}
            style={{ display: "none" }} // Скрываем input
          />
          <button
            type="button"
            onClick={() => document.getElementById("profilePic").click()} // Открыть диалог выбора файла
          >
            {profilePictureFile ? "Выбрать другое" : "Добавить фото"}
          </button>
          {profilePictureFile && (
            <button type="submit">Сохранить изменения</button>
          )}
        </form>


        {!isEditingProfile ? (
          <button onClick={() => setIsEditingProfile(true)}>
            Изменить данные
          </button>
        ) : (
          <form onSubmit={handleEditProfile}>
            <label htmlFor="Имя">Имя:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="Фамилия">Фамилия:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <button type="submit">Сохранить изменения</button>
          </form>
        )}
      </div>

      {/* часть с услугами */}
      <div className="pet-list-container">
        {serviceInfo.map((service) => (
          <div key={service.id} className="pet-item">
            <button onClick={() => handleSelectService(service)}>{service.name}</button>
            {selectedService && selectedService.id === service.id && (
              <div className="pet-item">
                {isEditingService ? (
                  <form className="pet-edit-form" onSubmit={handleEditService}>
                    <label>Название</label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                    />
                    <label>Описание</label>
                    <div className="pet-description">
                      <input
                        type="text"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                      />
                    </div>
                    <label>Цена</label>
                    <input
                      type="number"
                      value={servicePrice}
                      onChange={(e) => setServicePrice}
                    />
                    <button type="submit">Подтвердить изменения</button>
                  </form>
                ) : (
                  <div className="pet-info">
                    <p>Название: {service.name}</p>
                    <p>Описание: {service.description}</p>
                    <p>Цена: {service.price}</p>
                    <p>Айди услуги: {service.id}</p>
                  </div>
                )}
                <button onClick={toggleEditService}>
                  {isEditingService ? "Отменить" : "Изменить услугу"}
                </button>
                <button onClick={() => handleDeleteService(service.id)}>
                  Удалить сервис
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => setIsAddingService(true)}>Добавить сервис</button>
        <div className="pet-item">
          {isAddingService && (
            <div className="add-pet-form">
              <form onSubmit={handleAddService}>
                <label>Название</label>
                <input 
                  type="text"
                  placeholder="Название"
                  onChange={(e) => setServiceName(e.target.value)}
                />
                <label>Описание</label>
                <div className="pet-description">
                  <input 
                    type="text"
                    placeholder="Описание"
                    onChange={(e) => setServiceDescription(e.target.value)}
                  />
                </div>
                <label>Цена</label>
                <input 
                  type="number"
                  placeholder="Цена"
                  onChange={(e) => setServicePrice(e.target.value)}
                />
                <button type="submit">Подтвердить</button>
                <button className="add-pet-button" onClick={toggleAddService}>
                  {isAddingService ? "Отменить" : "Добавить сервис"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
