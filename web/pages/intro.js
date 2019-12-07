import React from 'react';
import { toastMessage } from '../utils/Toast';
import IntroPage from '../components/intro/IntroPage.Screen';

export default function Index() {
  try {
    return <IntroPage />;
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
