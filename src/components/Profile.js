import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../constants/constants';
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Navigate, useNavigate, useLocation } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState();
    const axiosPrivate = useAxiosPrivate();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [petInfo, setPetInfo] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState('');
    const [petWeight,setPetWeight] = useState('');
    const [petGender, setPetGender] = useState('');
    const [petBehavior, setPetBehavior] = useState('');
    const [petType, setPetType] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petDescription, setPetDescription] = useState('');
    const [petMedicalInfo, setPetMedicalInfo] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/profile";
    const [errorMessage, setErrorMessage] = useState('');
    const { auth } = useAuth(); // Assuming you are using this hook for authentication

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
                medicalInfo: petMedicalInfo
            };

            const response = await axiosPrivate.put(API_ENDPOINTS.PETS_URL/selectedPet.id, payload);
            console.log('Response:', response.data);

            // Update the pet info in the state
            setPetInfo(petInfo.map(pet => pet.id === selectedPet.id ? response.data : pet));

            // Clear the selected pet and form fields
            setSelectedPet(null);
            setPetName('');
            setPetAge('');
            setPetWeight('');
            setPetGender('');
            setPetBehavior('');
            setPetType('');
            setPetBreed('');
            setPetDescription('');
            setPetMedicalInfo('');

            navigate("/", { replace: true });
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Error response:', error.response);
        }
    };

    const handleDeletePet = async (e) => {
        e.preventDefault(e);
        try{
            
            const response = await axiosPrivate.delete(API_ENDPOINTS.PETS_URL/selectedPet.id);
            console.log('Delete pet response', response.data);

            navigate('/profile', {replace: true});
        } catch (error){
            console.log(error);
        }
    }

    const handleDeleteProfile = async (e) => {
        e.preventDefault(e);

        try {
            const response = await axiosPrivate.delete(API_ENDPOINTS.USER_URL);
            console.log('Response:', response.data);
            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();

        try {
            const payload = { name, surname };
            console.log('Sending payload:', payload);

            const response = await axiosPrivate.put(API_ENDPOINTS.PROFILE_URL, payload);
            console.log('Response:', response.data);

            setName(name);
            setSurname(surname);

            navigate("/", { replace: true });
            navigate(from, { replace: true });
        } catch (error) {
            console.error('Error response:', error.response);
            if (!error.response) {
                setErrorMessage('No server response');
            } else if (error.response?.status === 400) {
                setErrorMessage('Missing login or password');
            } else if (error.response.status === 401) {
                setErrorMessage('Unauthorized');
            } else {
                setErrorMessage('Login Failed');
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserProfile = async () => {
            try {
                const response = await axiosPrivate.get(API_ENDPOINTS.PROFILE_URL, {
                    signal: controller.signal
                });

                console.log('User data: ', response.data);
                isMounted && setProfile(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const getUserPets = async () => {
            try {
                const response = await axiosPrivate.get(API_ENDPOINTS.PETS_URL, {
                    signal: controller.signal
                });

                console.log('Pet data', response.data);
                isMounted && setPetInfo(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        getUserProfile();
        getUserPets();

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
        <div>
            <h1>User Profile</h1>
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
                </div>
            ))}
            {selectedPet && (
                <form onSubmit={handleEditPet} key={selectedPet.id}>
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
                    <button type="submit">Save Changes</button>
                </form>
            )}
            <form onSubmit={handleDeletePet}>
            <label style={{ color: '#ff0000' }} htmlFor='Delete pet'>Delete this pet?</label>
            <button>Delete</button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <h2>{profile.name} {profile.surname}</h2>
                    <form onSubmit={handleEditProfile}>
                        <label htmlFor='Change your name'>Name:</label>
                        <input
                            type="name"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                        <label htmlFor='Change your surname'>Surname:</label>
                        <input
                            type="surname"
                            id="surname"
                            onChange={(e) => setSurname(e.target.value)}
                            value={surname}
                            required
                        />
                        <button>Change</button>
                    </form>
                    <form onSubmit={handleDeleteProfile}>
                        <label style={{ color: '#ff0000' }} htmlFor='Delete your profile'>Delete your profile?</label>
                        <button>Delete my profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
