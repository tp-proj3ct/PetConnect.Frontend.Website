export const BASE_URL = 'http://localhost:8001/api';

export const API_ENDPOINTS = {
    //petsitters
    PET_SITTERS: `${BASE_URL}/pet-sitters`,
    
    //AUTH
    LOGIN_URL: `${BASE_URL}/auth/login`,
    REGISTRATION_URL: `${BASE_URL}/auth/registration`,

    //ADMIN
    ADMIN_GETUSERS: `${BASE_URL}/admin/users`,

    //PROFILE
    PROFILE_URL: `${BASE_URL}/user/profile`,
};