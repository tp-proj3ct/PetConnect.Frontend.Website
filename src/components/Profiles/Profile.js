// components/Profiles/Profile.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import ProfileForPetOwner from './ProfileForPetOwner';
import ProfileForPetSitter from './ProfileForPetSitter';
import useAuth from '../../hooks/useAuth';
import Unauthorized from '../Unauthorized';
import Admin from '../Admin';

const Profile = () => {
  const { auth } = useAuth();

  if (auth.userRole === 'PetOwner') {
    return <ProfileForPetOwner />;
  } else if (auth.userRole === 'PetSitter') {
    return <ProfileForPetSitter />;
  } else if (auth.userRole === 'Admin') {
    return <Admin />
  } else {
    return <Unauthorized />
  }
};

export default Profile;
