import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import getConfig from 'next/config';
import GoogleLogin from 'react-google-login';
import { loginTo, NavigateToChefDetail } from './login/components/Navigation';
import { SignupToCustomer, SignupToChef } from './register/components/Navigation';
import { toastMessage, renderError, success, error } from '../../utils/Toast';
import { StoreInLocal } from '../../utils/LocalStorage';
import * as gqlTag from '../../common/gql';
import { firebase } from '../../config/firebaseConfig';
import Loader from '../Common/loader';
import {
  chef,
  customer,
  getCustomerAuthData,
  getChefAuthData,
  CUSTOMER,
  CHEF,
} from '../../utils/UserType';
import { logOutUser } from '../../utils/LogOut';
import s from './Auth.String';
import FacebookModal from '../shared/modal/FacebookModal';
import * as utils from '../../utils/checkEmptycondition';

const { publicRuntimeConfig } = getConfig();
const { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } = publicRuntimeConfig;

//Gql path for query call
const updateAuthentication = gqlTag.mutation.auth.authtenticateGQLTAG;

const SOCIAL_AUTH = gql`
  ${updateAuthentication}
`;

export default function Login(props) {
  const [socialAuthMutation, { data, loading }] = useMutation(SOCIAL_AUTH, {
    onError: err => {
      //To show the user blocked message
      let paragraph = err.message;
      let regex = /YOUR_ACCOUNT_WAS_BLOCKED/g;
      let found = paragraph.match(regex);

      logOutUser()
        .then(result => {})
        .catch(error => {
          toastMessage(renderError, error);
        });
      toastMessage(renderError, utils.isArrayEmpty(found) ? s.BLOCK_MESSAGE : err.message);
    },
  });

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);

  //get & set user id's in local storage after getting firebase token and calling mutation
  useEffect(() => {
    try {
      setAuthData(data);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }, [data]);

  async function setAuthData(data) {
    if (data !== undefined) {
      if (utils.isObjectEmpty(data.authenticate) && utils.isObjectEmpty(data.authenticate.data)) {
        //for customer user http://localhost:3000/chef-detail?chefId=7edc8891-e079-4b03-ba87-63c8d7db80b2
        // let url = 'http://localhost:3000/chef-detail/';
        if (props.userType === CUSTOMER) {
          getCustomerAuthData(data.authenticate.data)
            .then(customerRes => {
              StoreInLocal('user_ids', customerRes);
              StoreInLocal('user_role', customer);
              toastMessage(
                success,
                props.sourceType === 'LOGIN' ? 'Logged in Successfully' : 'Registered Successfully'
              );
              if (props && props.chefId && props.chefId.chefId) {
                let obj = {
                  chefId: props.chefId.chefId,
                };
                NavigateToChefDetail(obj);
              } else {
                if (props.sourceType === 'LOGIN') {
                  loginTo();
                  StoreInLocal('selected_menu', 'home_page');
                } else {
                  SignupToCustomer();
                }
              }
            })
            .catch(error => {
              toastMessage(renderError, error.message);
            });
        }
        //for chef user
        else {
          getChefAuthData(data.authenticate.data)
            .then(chefRes => {
              StoreInLocal('user_ids', chefRes);
              StoreInLocal('user_role', chef);
              toastMessage(
                success,
                props.sourceType === 'LOGIN' ? 'Logged in Successfully' : 'Registered Successfully'
              );
              if (props.sourceType === 'LOGIN') {
                loginTo();
                StoreInLocal('selected_menu', 'home_page');
              } else {
                SignupToChef();
              }
            })
            .catch(error => {
              toastMessage(renderError, error.message);
            });
        }
      }
    }
  }

  //1) facebook response
  function responseFacebook(response) {
    try {
      if (!utils.hasProperty(response, 'status') && response.status !== 'unknown') {
        socialAuthUser(response, 'FACEBOOK');
      } else {
        toastMessage(error, 'Unknown error occured');
      }
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //2) On click social login
  function socialAuthUser(data, type) {
    try {
      setLoader(true);
      let provider = '';
      let credential = '';
      if (type === 'FACEBOOK') {
        provider = firebase.auth.FacebookAuthProvider;
        // create a new firebase credential with the token
        credential = provider.credential(data.accessToken);
      } else if (type === 'GOOGLE') {
        provider = new firebase.auth.GoogleAuthProvider();
        // create a new firebase credential with the token
        credential = provider.credential(data.tokenId, data.accessToken);
      }
      StoreInLocal('signInMethod', credential.signInMethod);
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(async currentUser => {
          //for new user register
          if (currentUser.additionalUserInfo.isNewUser === true) {
            if (currentUser.user.email === null) {
              // get email id from user
              onOpenMoadal();
            } else {
              socialLoginFuction();
            }
          }
          //for  user login
          else if (currentUser.additionalUserInfo.isNewUser === false) {
            if (currentUser.user.email === null) {
              setLoader(false);
              // do account register later
              if (firebase.auth().currentUser) {
                firebase.auth().currentUser.delete();
              }
              // firebase.auth().signOut()
              toastMessage(renderError, s.FB_LOGOUT_ERROR);
            } else {
              socialLoginFuction();
            }
          }
        })
        .catch(error => {
          setLoader(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            case 'auth/invalid-email':
              // do something
              toastMessage(error, 'The email address is not valid');
              break;
            case 'auth/wrong-password':
              toastMessage(error, 'Wrong username or password');
              break;
            case 'auth/user-not-found':
              toastMessage(error, 'User not found');
              break;
            default:
              toastMessage(error, errorMessage);
            // handle other codes ...
          }
        });
    } catch (error) {
      setLoader(false);
      toastMessage(renderError, error.message);
    }
  }

  //3) open modal
  function onOpenMoadal() {
    setModal(true);
  }

  //4) Callback function from modal
  function emailValue(email) {
    if (props && utils.isStringEmpty(email)) {
      props
        .checkMobileAndEmailDataExist(email)
        .then(result => {
          if (result === true) {
            setModal(false);
            firebase
              .auth()
              .currentUser.updateEmail(email)
              .then(() => {
                socialLoginFuction();
              });
          }
        })
        .catch(err => {
          toastMessage(renderError, err);
        });
    } else {
      toastMessage(renderError, 'Please enter email for fb account');
    }
  }

  //5) Gql call for social login
  function socialLoginFuction() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser !== null) {
      //get firebase token and call qgl tag
      currentUser
        .getIdToken()
        .then(data => {
          if (data) {
            let variables = {
              token: data,
              roleType: props.userType,
              authenticateType: props.sourceType,
              extra: null,
            };
            socialAuthMutation({
              variables,
            });
            setLoader(false);
            StoreInLocal('current_user_token', data);
          } else {
            setLoader(false);
            toastMessage(error, 'The current user is not available');
          }
        })
        .catch(error => {
          setLoader(false);
          toastMessage(renderError, error);
        });
    } else {
      setLoader(false);
      toastMessage(error, 'The current user is not available');
    }
  }

  function responseSuccessGoogle(response) {
    socialAuthUser(response, 'GOOGLE');
  }

  function responseFailureGoogle(response) {
    // toastMessage(error, response.error);
  }

  //loader
  function renderLoader() {
    if ((loading !== undefined && loading === true) || loader === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  try {
    return (
      <React.Fragment>
        {renderLoader()}
        <div className="socialLogin" id="login-social">
          <div className="row">
            <div className="col-12">
              <div className="card card-block">
                <FacebookLogin
                  appId={FACEBOOK_APP_ID}
                  textButton="Facebook"
                  fields="name,email,picture"
                  scope="public_profile, email"
                  callback={responseFacebook}
                  cssClass="btn btn-md btn-fb"
                  icon="fab fa-facebook-f pr-1"
                  disableMobileRedirect={true}
                />
              </div>
            </div>
          </div>
          <br></br>
          <div className="row" id="google-id">
            <div className="col-12">
              <div className="card card-block">
                <GoogleLogin
                  clientId={GOOGLE_CLIENT_ID}
                  className="google-login" //CLIENTID
                  buttonText="Google"
                  onSuccess={responseSuccessGoogle}
                  onFailure={responseFailureGoogle}
                />
              </div>
            </div>
          </div>
        </div>
        {modal === true && <FacebookModal content={s.MODAL_MESSAGE} emailValue={emailValue} />}
      </React.Fragment>
    );
  } catch (error) {
    toastMessage(renderError, error.message);
  }
}
