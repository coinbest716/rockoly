import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Link from 'next/link';
import Login from '../../SocialLogins';
import n from '../../../routings/routings';
import s from '../../Auth.String';
import { loginTo, NavigateToChefDetail, loginToAdmin } from './Navigation';
import { ToastContainer } from 'react-toastify';
import { toastMessage } from '../../../../utils/Toast';
import { StoreInLocal } from '../../../../utils/LocalStorage';
import Loader from '../../../Common/loader';
import * as gqlTag from '../../../../common/gql';
import { firebase } from '../../../../config/firebaseConfig';
import { chef, customer, getCustomerAuthData, getChefAuthData } from '../../../../utils/UserType';
import { logOutUser } from '../../../../utils/LogOut';
import { isObjectEmpty, isArrayEmpty, isStringEmpty } from '../../../../utils/checkEmptycondition';
import Footer from '../../../shared/layout/Footer';

//login auth qgl tag
const updateAuthentication = gqlTag.mutation.auth.authtenticateGQLTAG;

const LOGIN_AUTH = gql`
  ${updateAuthentication}
`;

export default function LoginForm(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [icEye, setIcEye] = useState('fa fa-eye-slash');
  const [passwordIcon, setPasswordIcon] = useState(true);
  const [chefUser, setChefUser] = useState(false);
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState('');
  const [roleType, setRoleType] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  const [loginAuthMutation, { data, loading,error }] = useMutation(LOGIN_AUTH, {
    onError: err => {
      // console.log('gql response', err.message);
      //To show the user blocked message
      let paragraph = err.message;
      let regex = /YOUR_ACCOUNT_WAS_BLOCKED/g;
      let found = paragraph.match(regex);

      // console.log(found, isArrayEmpty(found));
      logOutUser()
        .then(result => {})
        .catch(error => {
          toastMessage('renderError', error);
        });
      toastMessage('renderError', isArrayEmpty(found) ? s.BLOCK_MESSAGE : err.message);
    },
  });
  if(error){
    toastMessage('error',error)
  }

  //get & set user id's in local storage after getting firebase token and calling mutation
  useEffect(() => {
    try {
      if (isStringEmpty(roleType) && roleType === 'Admin') {
        if (userRole == 'chef') {
          const chefIds = {
            chefId: userId,
          };
          StoreInLocal('user_ids', chefIds);
        } else {
          const customerIds = {
            customerId: userId,
          };
          StoreInLocal('user_ids', customerIds);
        }
        StoreInLocal('loggedInAs', 'Admin');
        StoreInLocal('user_role', userRole);
        toastMessage('success', 'Loggedin Successfully');
        loginToAdmin();
      } else {
        setAuthData(data);
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }, [data]);

  async function setAuthData(data) {
    if (data !== undefined) {
      if (isObjectEmpty(data.authenticate) && isObjectEmpty(data.authenticate.data)) {
        //for customer login
        if (chefUser === false) {
          getCustomerAuthData(data.authenticate.data)
            .then(customerRes => {
              toastMessage('success', 'Loggedin Successfully');
              StoreInLocal('user_ids', customerRes);
              StoreInLocal('user_role', customer);
              StoreInLocal('selected_menu', 'home_page');
              // console.log('propspropsprops', props);
              if (isObjectEmpty(props) && isObjectEmpty(props.chefId)) {
                NavigateToChefDetail(props.chefId);
              } else {
                loginTo();
              }
            })
            .catch(error => {
              toastMessage('renderError', error.message);
            });
        }
        //for chef login
        else {
          getChefAuthData(data.authenticate.data)
            .then(chefRes => {
              toastMessage('success', 'Loggedin Successfully');
              StoreInLocal('user_ids', chefRes);
              StoreInLocal('user_role', chef);
              StoreInLocal('selected_menu', 'home_page');
              loginTo();
            })
            .catch(error => {
              toastMessage('renderError', error.message);
            });
        }
      }
    }
  }

  //when clicking login button
  async function handleSubmit(e) {
    e.preventDefault();
    localStorage.clear();
    localStorage.getItem('');
    await loginAction();
  }

  //onSubmit login, call firebase function to do login
  function loginAction() {
    try {
      setLoader(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          const currentUser = firebase.auth().currentUser;
          //get firebase token and call qgl tag
          currentUser.getIdToken().then(data => {
            if (currentUser !== null && data) {
              let variables = {
                token: data,
                roleType: roleType === 'Admin' ? 'ADMIN' : chefUser === true ? 'CHEF' : 'CUSTOMER',
                authenticateType: 'LOGIN',
                extra: null,
              };
              loginAuthMutation({ variables });
              setLoader(false);
              StoreInLocal('current_user_token', data);
            } else {
              setLoader(false);
              toastMessage('error', 'The current user is not available');
            }
          });
        })
        .catch(error => {
          setLoader(false);
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
        });
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  // Eye Icon visibility
  function changePwdType() {
    if (passwordIcon) {
      setIcEye('fa fa-eye');
      setPasswordIcon(false);
    } else {
      setIcEye('fa fa-eye-slash');
      setPasswordIcon(true);
    }
  }
  //Get url
  useEffect(() => {
    let url = window.location.href;
    if (url) {
      setUrl(url);
    }
  });

  //Get url data from stripe
  useEffect(() => {
    let loginType = getCode(url, 'loggedInAs');
    let role = getCode(url, 'role');
    let id = getCode(url, 'id');
    let loginTypeData = loginType.split('%22')[1];
    let roleData = role.split('%22')[1];
    let idData = id.split('%22')[1];
    if (isStringEmpty(loginTypeData) && isStringEmpty(roleData) && isStringEmpty(idData)) {
      logOutUser()
        .then(result => {
          StoreInLocal('loggedInAs', 'Admin');
          setUserRole(roleData.toLowerCase());
          setUserId(idData);
          setRoleType('Admin');
        })
        .catch(error => {
          toastMessage('renderError', error);
        });
    }
  }, [url]);

  //seperate url data
  function getCode(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\');
    const regexS = `[\\?&]${name}=([^&#]*)`;
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    if (results == null) return '';
    return results[1];
  }

  function renderLoader() {
    if ((loading !== undefined && loading === true) || loader === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <ToastContainer />
      <section className="login-area ptb-60">
        <div className="container" id="login-content">
          <div className="">
            <div className="col-lg-12 col-md-12">
              <div className="login-content">
                <div className="section-title">
                  <h2>
                    <span className="dot"></span> Login
                  </h2>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{s.EMAIL}</label>
                    <input
                      type={s.EMAIL_INPUT}
                      name={s.EMAIL_INPUT}
                      id={s.EMAIL_INPUT}
                      className={s.FORM_CONTROL}
                      required
                      placeholder={s.EMAIL_PLACEHOLDER}
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>{s.PASSWORD}</label>
                    <div className="eyeIconView">
                      <input
                        type={passwordIcon ? s.PASSWORD_INPUT : s.TEXT}
                        className={s.FORM_CONTROL}
                        minLength="6"
                        id={s.PASSWORD_INPUT}
                        name={s.PASSWORD_INPUT}
                        placeholder={s.PASSWORD_PLACEHOLDER}
                        data-toggle="password"
                        required
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                      />
                      <i className={icEye} onClick={() => changePwdType()}></i>
                    </div>
                  </div>
                  {roleType !== 'Admin' && (
                    <div className="login-keep">
                      <div className="buy-checkbox-btn">
                        <div className="item">
                          {/* <input className="inp-cbx" id="login" type="checkbox" /> */}
                          {/* <label className="cbx" htmlFor="login"> */}
                          <span>
                            {/* <svg width="12px" height="10px" viewBox="0 0 12 10"> */}
                            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            {/* </svg> */}
                          </span>
                          {/* <span id="keep-me-login">{s.KEEP_ME_LOGGED_IN}</span> */}
                          {/* </label> */}
                        </div>
                      </div>

                      <Link href={n.FORGOT_PASSWORD}>
                        <a class="forgot-password" id="password-forgot-content">
                          {s.FORGOT_PASSWORD}
                        </a>
                      </Link>
                    </div>
                  )}
                  {/* <div className="login-keep">
                    <div className="buy-checkbox-btn">
                      <div className="item">
                        <input
                          className="inp-cbx"
                          id="userType"
                          type="checkbox"
                          checked={chefUser}
                          onChange={event => setChefUser(event.target.checked)}
                        />
                        <label className="cbx" htmlFor="userType">
                          <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span>
                          <span>{s.ARE_YOU_CHEF}</span>
                        </label>
                      </div>
                    </div>
                  </div> */}
                  {renderLoader()}
                  <div className="login-btn-view">
                    <button type="submit" className="btn btn-primary" id="login-submit-button">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {roleType !== 'Admin' && (
              <div>
                <div class="col-lg-12 col-md-12" id="socialLoginContainer">
                  <p className="orFont">or</p>
                </div>

                <div class="col-lg-12 col-md-12" id="socialLoginContainer">
                  <div>
                    <Login
                      sourceType={'LOGIN'}
                      userType={chefUser === true ? 'CHEF' : 'CUSTOMER'}
                      chefId={props.chefId}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {roleType !== 'Admin' && <Footer />}
    </React.Fragment>
  );
}

// export default withApollo(LoginForm);
