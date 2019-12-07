import React, { useState } from 'react';
import Strings from '../../Auth.String';
import { loginPage } from './Navigation';
import { toastMessage } from '../../../../utils/Toast';
import Loader from '../../../Common/loader';
import { isStringEmpty } from '../../../../utils/checkEmptycondition';
import { firebase } from '../../../../config/firebaseConfig';

const ForgotPasswordForm = () => {
  // Declare a new state variable
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);

  function onClickReset(e) {
    e.preventDefault();
    if (isStringEmpty(email)) {
      forgotPassword(email);
    }
  }

  function forgotPassword(email) {
    try {
      setLoader(true);
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(user => {
          setLoader(false);
          toastMessage('success', 'Reset password link has been sent to your mail');
          loginPage();
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case 'auth/invalid-email':
              // do something
              toastMessage('error', 'The email address is not valid');
              break;
            case 'auth/wrong-password':
              toastMessage('error', 'Wrong username or password');
              break;
            case 'auth/user-not-found':
              toastMessage('error', 'User not found');
              break;
            default:
              toastMessage('error', errorMessage);
            // handle other codes ...
          }
          setLoader(false);
        });
    } catch (error) {
      setLoader(false);
      toastMessage('renderError', error.message);
    }
  }

  //loader
  function renderLoader() {
    if (loader && loader === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  return (
    <section className="login-area ptb-60">
      <div className="container">
        {renderLoader()}
        <div className="row" id="FormRow">
          <div className="col-sm-6">
            <div className="login-content">
              <div className="section-title">
                <h2>{Strings.FORGOT_PASSWORD}</h2>
              </div>

              <form className="login-form" onSubmit={onClickReset}>
                <div>
                  <label>{Strings.SUBMIT_MESSAGE}</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder={Strings.EMAIL_PLACE_HOLDER}
                    id="email"
                    name="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                  />
                </div>

                <div className="login-button" id="resetPwdButton">
                  <button type="submit" className="btn btn-primary">
                    {Strings.RESET_PASSWORD}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ForgotPasswordForm;
