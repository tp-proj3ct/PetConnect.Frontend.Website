// components/Profiles/Profile.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfileForPetOwner from './ProfileForPetOwner';
import ProfileForPetSitter from './ProfileForPetSitter';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { auth } = useAuth();
  console.log(JSON.stringify(auth.userRole));

  if (auth.userRole === 'PetOwner') {
    return <ProfileForPetOwner />;
  } else if (auth.userRole === 'PetSitter') {
    return <ProfileForPetSitter />;
  }
};

export default Profile;
