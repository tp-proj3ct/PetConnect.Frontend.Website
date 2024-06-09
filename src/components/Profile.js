import React, { useState, useEffect } from 'react';
import axios, { axiosPrivate } from '../api/axios';
import { API_ENDPOINTS } from '../constants/constants';
import useAuth from "../hooks/useAuth";

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const { auth } = useAuth(); // Assuming you are using this hook for authentication

    const getUserProfile = async () => {
        try {
            const response = await axiosPrivate.get(API_ENDPOINTS.PROFILE_URL);
            setProfile(response.data);
        } catch (err) {
            console.error(err.toJSON());
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    // if (!auth) {
    //     return <Navigate to="/login" />;
    // }

    if (!profile) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={profile.profilePic} alt={`${profile.name} ${profile.surname}`} style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '20px' }} />
                <div>
                    <h2>{profile.name} {profile.surname}</h2>
                    <p>Login: {profile.user.login}</p>
                    <p>Email: {profile.user.email}</p>
                    <p>Phone Number: {profile.user.phoneNumber}</p>
                    <p>Role: {profile.user.role}</p>
                    <p>Blocked: {profile.user.isBlocked ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
