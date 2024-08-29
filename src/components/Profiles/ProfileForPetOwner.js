import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../constants/constants";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

//TODO: PetOwner/PetSitter profile pages(Now only PetOwner), create css for profile page, Add profile picture

const Profile = () => {
  const delay = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

  const [profile, setProfile] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [surname, setSurname] = useState("");
  const [petInfo, setPetInfo] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petGender, setPetGender] = useState("");
  const [petBehavior, setPetBehavior] = useState("");
  const [petType, setPetType] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [petMedicalInfo, setPetMedicalInfo] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";
  const [errorMessage, setErrorMessage] = useState("");
  const { auth } = useAuth();

  const handleSelectPet = (pet) => {
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
    <div>
      <h1>User Profile</h1>
      <div>
        <div>
          {profilePic && (
            <div>
              <h2>Profile Picture:</h2>
              <img 
              src={profilePic} 
              alt="Profile" 
              style={{
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                marginRight: "100px",
              }}
              />
            </div>
          )}

          {profile && (
            <div>
              <h2>Profile info:</h2>
              <h1>{profile.name} {profile.surname}</h1>
            </div>
          )}
          <form onSubmit={handleAddProfilePicture}>
            <label htmlFor="file">Изменить фото</label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
            />
            <button type="submit">Change</button>
          </form>
          <form onSubmit={handleEditProfile}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="surname">Surname:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
            <button type="submit">Change</button>
          </form>
          <form onSubmit={handleDeleteProfile}>
            <label>Delete your profile?</label>
            <button type="submit">Delete my profile</button>
          </form>
        </div>
      </div>
      {petInfo.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>Age: {item.age}</p>
          <p>Weight: {item.weight}</p>
          <p>Gender: {item.gender}</p>
          <p>Behavior: {item.behavior}</p>
          <p>Type: {item.type}</p>
          <p>Breed: {item.breed}</p>
          <p>Description: {item.description}</p>
          <p>Medical Info: {item.medicalInfo}</p>
          <button onClick={() => handleSelectPet(item)}>Edit Pet</button>
          <button onClick={() => handleDeletePet(item.id)}>Delete Pet</button>
          {selectedPet && selectedPet.id === item.id && (
            <form onSubmit={handleEditPet}>
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
              <input
                type="text"
                value={petGender}
                onChange={(e) => setPetGender(e.target.value)}
              />
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
              <input
                type="text"
                value={petDescription}
                onChange={(e) => setPetDescription(e.target.value)}
              />
              <label>Medical Info:</label>
              <input
                type="text"
                value={petMedicalInfo}
                onChange={(e) => setPetMedicalInfo(e.target.value)}
              />
              <button type="submit">Confirm</button>
            </form>
          )}
        </div>
      ))}
      <button onClick={() => setIsAddingPet(true)}>Add Pet</button>
      {isAddingPet && (
        <form onSubmit={handleAddPet}>
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
          <input
            type="text"
            value={petGender}
            onChange={(e) => setPetGender(e.target.value)}
          />
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
          <input
            type="text"
            value={petDescription}
            onChange={(e) => setPetDescription(e.target.value)}
          />
          <label>Medical Info:</label>
          <input
            type="text"
            value={petMedicalInfo}
            onChange={(e) => setPetMedicalInfo(e.target.value)}
          />
          <button type="submit">Confirm</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
