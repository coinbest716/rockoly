import React from 'react';
import { toastMessage } from '../utils/Toast';
import ForgotPassword from '../components/auth/forgot-password/ForgotPassword.screen';

export default function Index() {
  try {
    return <ForgotPassword />;
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
