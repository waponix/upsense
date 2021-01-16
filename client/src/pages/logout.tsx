import React from 'react';
import { navigate } from 'gatsby';
import { logout } from '../services/auth';

const Logout = () => {
  logout(() => navigate('/auth/login'));
  return null;
};

export default Logout;
