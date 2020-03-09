import React, { useState } from 'react';
import s from '../../Auth.String';
import { firebase, auth } from '../../../../config/firebaseConfig';
import { toastMessage } from '../../../../utils/Toast';
import Router from 'next/router';
import Loader from '../../../Common/loader';
import { StoreInLocal } from '../../../../utils/LocalStorage';
import n from '../../../routings/routings';
const ChangePasswordForm = () => {
  const [icEye1, seticEye1] = useState('fa fa-eye-slash');
  const [icEye2, seticEye2] = useState('fa fa-eye-slash');
  const [icEye3, seticEye3] = useState('fa fa-eye-slash');
  const [passwordIcon1, setpasswordIcon1] = useState(true);
  const [passwordIcon2, setpasswordIcon2] = useState(true);
  const [passwordIcon3, setpasswordIcon3] = useState(true);
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isLoadingYn, setisLoadingYn] = useState(false);

  // Eye Icon visibility
  function changePwdType1() {
    if (passwordIcon1) {
      seticEye1('fa fa-eye');
      setpasswordIcon1(false);
    } else {
      seticEye1('fa fa-eye-slash');
      setpasswordIcon1(true);
    }
  }

  function changePwdType2() {
    if (passwordIcon2) {
      seticEye2('fa fa-eye');
      setpasswordIcon2(false);
    } else {
      seticEye2('fa fa-eye-slash');
      setpasswordIcon2(true);
    }
  }

  function changePwdType3() {
    if (passwordIcon3) {
      seticEye3('fa fa-eye');
      setpasswordIcon3(false);
    } else {
      seticEye3('fa fa-eye-slash');
      setpasswordIcon3(true);
    }
  }

  function changePasswordForm(e) {
    setisLoadingYn(true);
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setisLoadingYn(false);
    }
    if (newPassword === confirmPassword) {
      let user = auth.currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
      user
        .reauthenticateAndRetrieveDataWithCredential(credentials)
        .then(() => {
          user
            .updatePassword(newPassword)
            .then(() => {
              setisLoadingYn(false);
              toastMessage(
                'success',
                'Password Updated..You are logged out now.Please Login to continue'
              );
              try {
                firebase
                  .auth()
                  .signOut()
                  .then(async () => {
                    // let keysToRemove = ['user_ids', 'selected_menu'];
                    await localStorage.clear();
                    setTimeout(async function() {
                      await StoreInLocal('chef_loggedIn', false);
                      await StoreInLocal('selected_menu', 'home_page');
                      await Router.push(n.HOME);
                    }, 2000);
                  })
                  .catch(error => {
                    setisLoadingYn(false);
                    toastMessage('renderError', error.message);
                  });
              } catch (error) {
                setisLoadingYn(false);
                toastMessage('renderError', error.message);
              }
            })
            .catch(error => {
              setisLoadingYn(false);
              toastMessage('renderError', error.message);
            });
        })
        .catch(error => {
          setisLoadingYn(false);
          toastMessage('renderError', error.message);
        });
    } else {
      setisLoadingYn(false);
      toastMessage('renderError', 'Password must match');
    }
  }

  try {
    return (
      <section className="login-area ptb-60">
        <div className="container">
          <div className="row" id="FormRow">
            <div className="col-sm-6">
              {isLoadingYn && <Loader />}
              <div className="login-content">
                <div className="section-title">
                  <h2>{s.CHANGE_PASSWORD}</h2>
                </div>

                <form className="login-form">
                  <div className="form-group">
                    <label className="changePwdInputLable">{s.CURRENT_PASSWORD_TITLE}</label>
                    <div className="passwordContainer">
                      <input
                        type={passwordIcon1 ? s.PASSWORD_INPUT : s.TEXT}
                        className="form-control"
                        placeholder={s.CURRENT_PASSWORD_PLACE_HOLDER}
                        onChange={event => {
                          setCurrentPassword(event.target.value);
                        }}
                        id="name"
                        name="name"
                        required
                      />
                      <i className={icEye1} onClick={() => changePwdType1()} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="changePwdInputLable">{s.NEW_PASSWORD_TITLE}</label>
                    <div className="passwordContainer">
                      <input
                        type={passwordIcon2 ? s.PASSWORD_INPUT : s.TEXT}
                        className="form-control"
                        placeholder={s.NEW_PASSWORD_PLACE_HOLDER}
                        onChange={event => {
                          setNewPassword(event.target.value);
                        }}
                        id="name"
                        name="name"
                        required
                      />
                      <i className={icEye2} onClick={() => changePwdType2()} />
                    </div>
                    <div className="passwordContainer">
                      <input
                        type={passwordIcon3 ? s.PASSWORD_INPUT : s.TEXT}
                        className="form-control"
                        placeholder={s.CONFIRM_NEW_PASSWORD_PLACE_HOLDER}
                        onChange={event => {
                          setConfirmPassword(event.target.value);
                        }}
                        id="name"
                        name="name"
                        required
                      />
                      <i className={icEye3} onClick={() => changePwdType3()} />
                    </div>
                  </div>
                  <div className="login-button">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => changePasswordForm(event)}
                    >
                      {s.UPDATE}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default ChangePasswordForm;
