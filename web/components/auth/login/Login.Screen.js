import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Navbar from '../../shared/layout/Navbar';
import { toastMessage } from '../../../utils/Toast';
import { GetValueFromLocal } from '../../../utils/LocalStorage';

export default function Login(props) {
  return (
    <React.Fragment>
      <Navbar />
      <div className="auth">
        <section className="">
          <div className="cart-totals">
            <LoginForm chefId={props.chefId} />
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}
