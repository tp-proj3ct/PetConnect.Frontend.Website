import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../constants/constants";
import axios from "../../api/axios";
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
  const [petInfo, setPetInfo] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petBehavior, setPetBehavior] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [petMedicalInfo, setPetMedicalInfo] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();

  const handleSelectPet = (pet) => {
    if (selectedPet && selectedPet.id === pet.id) {
      // Если кликнули на уже выбранного питомца, сворачиваем информацию
      setSelectedPet(null);
      setIsEditingPet(false);
    } else {
      // Если кликнули на другого питомца, разворачиваем его информацию
      setSelectedPet(pet);
      setPetName(pet.name);
      setPetAge(pet.age);
      setPetWeight(pet.weight);
      setPetGender(pet.gender);
      setPetBehavior(pet.behavior);
      setPetType(pet.type);
      setPetBreed(pet.breed);
      setPetDescription(pet.description);
      setPetMedicalInfo(pet.medicalInfo);
      setIsEditingPet(false);
    }
  };

  const toggleEditPet = () => {
    setIsEditingPet(!isEditingPet);
  };

  const toggleAddPet = () => {
    setIsAddingPet(!isAddingPet);
  };



  

  const handleEditPet = async (e) => {
    e.preventDefault();

    if (!selectedPet) {
      return;
    }

    try {
      const payload = {
        name: petName,
        age: petAge,
        weight: petWeight,
        gender: petGender,
        behavior: petBehavior,
        type: petType,
        breed: petBreed,
        description: petDescription,
        medicalInfo: petMedicalInfo,
      };

      console.log("Payload", payload);

      const response = await axiosPrivate.put(
        `${API_ENDPOINTS.PETS_URL}/${selectedPet.id}`,
        payload
      );
      console.log("Response:", response.data);

      setPetInfo((prevPetInfo) =>
        prevPetInfo.map((pet) =>
          pet.id === selectedPet.id ? { ...pet, ...payload } : pet
        )
      );

      setSelectedPet(null);

      // Clear the form fields
      setPetName("");
      setPetAge("");
      setPetWeight("");
      setPetGender("");
      setPetBehavior("");
      setPetType("");
      setPetBreed("");
      setPetDescription("");
      setPetMedicalInfo("");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response:", error.response);
    }
  };

  const handleAddPet = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: petName,
        age: petAge,
        weight: petWeight,
        gender: petGender,
        behavior: petBehavior,
        type: petType,
        breed: petBreed,
        description: petDescription,
        medicalInfo: petMedicalInfo,
      };

      const response = await axiosPrivate.post(API_ENDPOINTS.PETS_URL, payload);
      console.log("Response:", response.data);

      setPetInfo([...petInfo, response.data]);

      setIsAddingPet(false);

      // Clear the form fields
      setPetName("");
      setPetAge("");
      setPetWeight("");
      setPetGender("");
      setPetBehavior("");
      setPetType("");
      setPetBreed("");
      setPetDescription("");
      setPetMedicalInfo("");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error response:", error.response);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      const response = await axiosPrivate.delete(
        `${API_ENDPOINTS.PETS_URL}/${petId}`
      );
      console.log("Delete pet response", response.data);

      setPetInfo(petInfo.filter((pet) => pet.id !== petId));
      if (selectedPet && selectedPet.id === petId) {
        setSelectedPet(null);
      }
      navigate("/profile", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProfile = async (e) => {
    e.preventDefault(e);

    try {
      const response = await axiosPrivate.delete(API_ENDPOINTS.USER_URL);
      console.log("Response:", response.data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProfile = async (e) => {
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

    const getUserPets = async () => {
      try {
        const response = await axiosPrivate.get(API_ENDPOINTS.PETS_URL, {
          signal: controller.signal,
        });

        console.log("Pet data", response.data);
        isMounted && setPetInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    getUserProfile();
    getUserProfilePicture();
    getUserPets();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="profile-picture-section">
          {profilePic && (
            <img className="profile-photo" src={profilePic} alt="Profile" />
          )}
          {profile && (
            <div className="profile-info">
              <h2>
                {profile.name} {profile.surname}
              </h2>
            </div>
          )}
        </div>
        <form className="profile-addphoto-frame" onSubmit={handleAddProfilePicture}>
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
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="surname">Фамилия:</label>
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

      <div className="pet-list-container">
        {petInfo.map((pet) => (
          <div key={pet.id} className="pet-item">
            <button onClick={() => handleSelectPet(pet)}>{pet.name}</button>
            {selectedPet && selectedPet.id === pet.id && (
              <div className="pet-item">
                {isEditingPet ? (
                  <form className="pet-edit-form" onSubmit={handleEditPet}>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                    />
                    <label>Age:</label>
                    <input
                      type="number"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                    />
                    <label>Weight:</label>
                    <input
                      type="number"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                    />
                    <label>Gender:</label>
                    <div className="gender-selection">
                      <div className="gender-option">
                        <label>
                          {" "}
                          Мальчик
                          <input
                            type="radio"
                            value="Male"
                            checked={petGender === "Male"}
                            onChange={() => setPetGender("Male")}
                          />
                        </label>
                      </div>
                      <div className="gender-option">
                        <label>
                          {" "}
                          Девочка
                          <input
                            type="radio"
                            value="Female"
                            checked={petGender === "Female"}
                            onChange={() => setPetGender("Female")}
                          />
                        </label>
                      </div>
                    </div>
                    <label>Behavior:</label>
                    <input
                      type="text"
                      value={petBehavior}
                      onChange={(e) => setPetBehavior(e.target.value)}
                    />
                    <label>Type:</label>
                    <input
                      type="text"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                    />
                    <label>Breed:</label>
                    <input
                      type="text"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                    />
                    <label>Description:</label>
                    <div className="pet-description">
                    <input
                      type="text"
                      value={petDescription}
                      onChange={(e) => setPetDescription(e.target.value)}
                    />
                    </div>
                    <label>Medical Info:</label>
                    <input
                      type="text"
                      value={petMedicalInfo}
                      onChange={(e) => setPetMedicalInfo(e.target.value)}
                    />
                    <button type="submit">Confirm Changes</button>
                  </form>
                ) : (
                  // ДОБАВИТЬ СТИЛЬ ДЛЯ ПАРАГРАФОВ
                  <div className="pet-info">
                    <p>Age: {pet.age}</p>
                    <p>Weight: {pet.weight}</p>
                    <p>Gender: {pet.gender}</p>
                    <p>Behavior: {pet.behavior}</p>
                    <p>Type: {pet.type}</p>
                    <p>Breed: {pet.breed}</p>
                    <p>Description: {pet.description}</p>
                    <p>Medical Info: {pet.medicalInfo}</p>
                  </div>
                )}
                <button onClick={toggleEditPet}>
                  {isEditingPet ? "Cancel" : "Edit Pet"}
                </button>
                <button onClick={() => handleDeletePet(pet.id)}>
                  Удалить питомца
                </button>
              </div>
            )}
          </div>
        ))}
        <button onClick={() => setIsAddingPet(true)}>Add Pet</button>
        <div className="pet-item">
          {isAddingPet && (
            <div className="add-pet-form">
              <form onSubmit={handleAddPet}>
                <label>Имя питомца:</label>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setPetName(e.target.value)}
                />
                <label>Возраст питомца:</label>
                <input
                  type="number"
                  placeholder="Age"
                  onChange={(e) => setPetAge(e.target.value)}
                />
                <label>Вес питомца:</label>
                <input
                  type="number"
                  placeholder="Weight"
                  onChange={(e) => setPetWeight(e.target.value)}
                />
                <label>Пол питомца:</label>
                <div className="gender-selection">
                  <div className="gender-option">
                    <label>
                      {" "}
                      Мальчик
                      <input
                        type="radio"
                        value="Male"
                        checked={petGender === "Male"}
                        onChange={() => setPetGender("Male")}
                      />
                    </label>
                  </div>
                  <div className="gender-option">
                    <label>
                      {" "}
                      Девочка
                      <input
                        type="radio"
                        value="Female"
                        checked={petGender === "Female"}
                        onChange={() => setPetGender("Female")}
                      />
                    </label>
                  </div>
                </div>
                <label>Поведение: </label>
                <input
                  type="text"
                  placeholder="Behavior"
                  onChange={(e) => setPetBehavior(e.target.value)}
                />
                <label>Тип питомца:</label>
                <input
                  type="text"
                  placeholder="Type"
                  onChange={(e) => setPetType(e.target.value)}
                />
                <label>Порода питомца:</label>
                <input
                  type="text"
                  placeholder="Breed"
                  onChange={(e) => setPetBreed(e.target.value)}
                />
                <label>Расскажите о питомце</label>
                <div className="pet-description">
                  <input
                    type="text"
                    placeholder="Description"
                    onChange={(e) => setPetDescription(e.target.value)}
                  />
                </div>
                <label>Медицинская информация</label>
                <input
                  type="text"
                  placeholder="Medical Info"
                  onChange={(e) => setPetMedicalInfo(e.target.value)}
                />

                <button type="submit">Confirm Changes</button>
                <button className="add-pet-button" onClick={toggleAddPet}>
                  {isAddingPet ? "Cancel" : "Add Pet"}
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
