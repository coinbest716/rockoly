// TOdo-cr-si remove unused code
import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import _ from 'lodash';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import Loader from '../../Common/loader';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../utils/UserType';
import { firebase } from '../../../config/firebaseConfig';
import { loginTo } from './Navigation';
import * as util from '../../../utils/checkEmptycondition';
import { toastMessage } from '../../../utils/Toast';
import S from '../../profile-setup/ProfileSetup.String';
// import { GetValueFromLocal } from '../../../utils/LocalStorage';
import { StoreInLocal, GetValueFromLocal } from '../../../utils/LocalStorage';
const storageRef = firebase.storage().ref();

const customerProfilePicture = gqlTag.mutation.customer.updateCustomerProfilePicGQLTAG;
const ProfilePicture = gqlTag.mutation.chef.updateChefProfilePicGQLTAG;

const UPLOAD__CUSTOMER_PROFILE_PICTURE = gql`
  ${customerProfilePicture}
`;

const UPLOAD_PROFILE_PICTURE = gql`
  ${ProfilePicture}
`;

//update screen
const updateScreens = gqlTag.mutation.customer.updateScreensGQLTAG;

const UPDATE_SCREENS = gql`
  ${updateScreens}
`;

//update registration screen
const chefUpdateSCreens = gqlTag.mutation.chef.updateScreensGQLTAG;
const CHEF_UPDATE_SCREENS = gql`
  ${chefUpdateSCreens}
`;

//update registration
const updateRegistration = gqlTag.mutation.customer.updateRegistrationGQLTAG;

const UPDATE_REGISTRATION = gql`
  ${updateRegistration}
`;

const ProfilePictureUpload = props => {
  const [customerIdValue, setCustomerId] = useState();
  const [chefIdValue, setChefId] = useState();
  const [ProfileDetails, setProfileDetails] = useState();
  const [load, setLoading] = useState(false);
  const [uploadcustomerProfilePicture, datas] = useMutation(UPLOAD__CUSTOMER_PROFILE_PICTURE, {
    onCompleted: data => {
      setLoading(false);
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('PROFILE_PIC');
            screensValue = _.uniq(screensValue);
            let variables = {
              customerId: props.id,
              customerUpdatedScreens: screensValue,
            };
            StoreInLocal('SharedProfileScreens', screensValue);
            updateScrrenTag({ variables });
          })
          .catch(err => {
            //console.log('err', err);
          });
      }
      toastMessage('success', 'Profile Picture Uploaded Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });
  const [uploadchefProfilePicture, { dataValue }] = useMutation(UPLOAD_PROFILE_PICTURE, {
    onCompleted: datas => {
      setLoading(false);
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        let screensValue = [];
        GetValueFromLocal('SharedProfileScreens')
          .then(result => {
            if (result && result.length > 0) {
              screensValue = result;
            }
            screensValue.push('PROFILE_PIC');
            screensValue = _.uniq(screensValue);
            let variables = {
              chefId: props.id,
              chefUpdatedScreens: screensValue,
            };
            updateChefScreenTag({ variables });
            if (props && props.nextStep) {
              props.nextStep();
            }
            StoreInLocal('SharedProfileScreens', screensValue);
          })
          .catch(err => {
            //console.log('err', err);
          });
      }
      toastMessage('success', 'Profile Picture Uploaded Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [updateScrrenTag, { data, loading, error }] = useMutation(UPDATE_SCREENS, {
    onCompleted: data => {
      skipImage();
    },
    onError: err => {},
  });

  const [updateRegistrationTag, valueChange] = useMutation(UPDATE_REGISTRATION, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
      if (props.isFromRegister === true) {
        loginTo();
      }
    },
    onError: err => {},
  });

  const [updateChefScreenTag] = useMutation(CHEF_UPDATE_SCREENS, {
    onCompleted: data => {
      // toastMessage(success, 'Favourite cuisines updated successfully');
    },
    onError: err => {},
  });

  useEffect(() => {
    if (props.role === customer) {
      setCustomerId(props.id);
    } else if (props.role === chef) {
      setChefId(props.id);
    }
  }, [props]);
  useEffect(() => {
    if (
      util.isObjectEmpty(props.details) &&
      util.hasProperty(props.details, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(props.details.customerProfileByCustomerId)
    ) {
      setProfileDetails(props.details.customerProfileByCustomerId);
    } else if (util.isObjectEmpty(props.details) && util.hasProperty(props.details, 'chefPicId')) {
      setProfileDetails(props.details);
    }
  }, [props]);
  function uploadProfilePicture(event) {
    if (props.role === customer) {
      setLoading(true);
      var reader = new FileReader();
      reader.onload = function() {
        var output = document.getElementById('imageUploading');
        output.src = reader.result;
        const dateTime = new Date().getTime();
        const randNo = Math.floor(Math.random() * 9000000000) + 1000000000;
        const imageFileName = `${customerIdValue}/PROFILE_PICTURE/${dateTime}_${randNo}`;
        firebase
          .storage()
          .ref()
          .child(imageFileName)
          .putString(reader.result, 'data_url')
          .then(res => {
            storageRef
              .child(res.metadata.fullPath)
              .getDownloadURL()
              .then(url => {
                uploadcustomerProfilePicture({
                  variables: {
                    customerId: customerIdValue,
                    customerPicId: url,
                  },
                });
              });
          });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else if (props.role === chef) {
      setLoading(true);
      var reader = new FileReader();
      reader.onload = function() {
        var output = document.getElementById('imageUploading');
        output.src = reader.result;
        const dateTime = new Date().getTime();
        const randNo = Math.floor(Math.random() * 9000000000) + 1000000000;
        const imageFileName = `${chefIdValue}/PROFILE_PICTURE/${dateTime}_${randNo}`;
        firebase
          .storage()
          .ref()
          .child(imageFileName)
          .putString(reader.result, 'data_url')
          .then(res => {
            storageRef
              .child(res.metadata.fullPath)
              .getDownloadURL()
              .then(url => {
                uploadchefProfilePicture({
                  variables: {
                    chefId: chefIdValue,
                    chefPicId: url,
                  },
                });
              });
          });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function skipImage() {
    if (props.screen && props.screen === 'register') {
      let screenArray = [
        'EMAIL_VERIFICATION',
        'MOBILE_VERIFICATION',
        'ADDRESS',
        'ALLERGY',
        'DIETARY',
        'KITCHEN_EQUIPMENT',
      ];
      //To check the updated screen values
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            result = _.pull(result, 'PROFILE_PIC');
            if (result.length === 6) {
              let variables = {
                customerId: props.id,
                isRegistrationCompletedYn: true,
              };
              updateRegistrationTag({ variables });
              StoreInLocal('user_ids', chefIds);
            } else {
              let screenData = _.pullAll(screenArray, result);
              let screenDetails = screenData.map((res, key) => {
                return _.upperFirst(_.lowerCase(res));
              });
              let screenValue = screenDetails.join(', ');
              toastMessage('renderError', 'Please fill out the screens: ' + screenValue);
            }
          }
        })
        .catch(err => {
          //console.log('err', err);
        });
    }
  }

  //For click next step
  function nextStepFunction() {
    // To get the updated screens value
    if (props.role != 'customer' && !ProfileDetails.chefPicId) {
      toastMessage('error', 'Please upload profile picture');
    } else {
      let screensValue = [];
      GetValueFromLocal('SharedProfileScreens')
        .then(result => {
          if (result && result.length > 0) {
            screensValue = result;
          }
          if (result && !_.includes(result, 'PROFILE_PIC')) {
            screensValue.push('PROFILE_PIC');
            screensValue = _.uniq(screensValue);
            StoreInLocal('SharedProfileScreens', screensValue);
            let variables;
            if (props.role === 'chef') {
              variables = {
                chefId: props.id,
                chefUpdatedScreens: screensValue,
              };
              updateChefScreenTag({ variables });
            } else if (props.role === 'customer') {
              variables = {
                customerId: props.id,
                customerUpdatedScreens: screensValue,
              };
              updateScrrenTag({ variables });
            }
          }
          props.nextStep();
        })
        .catch(err => {
          //console.log('err', err);
        });
    }
  }

  try {
    return (
      <div
        className={`ProfileSetup 
      ${props.screen === 'register' ? 'base-rate-info' : ''}`}
      >
        {ProfileDetails && (
          <div className="containers profile_pic" id="edit-profile-picture">
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '5%',
              }}
            >
              {load && <Loader />}
              {props.role == 'customer' && (
                <input
                  type="image"
                  src={
                    ProfileDetails.customerPicId
                      ? ProfileDetails.customerPicId
                      : require('../../../images/mock-image/sample_user.png')
                  }
                  // className="rounded-circle image"
                  style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                  alt="Cinque Terre"
                  value="imageUploader"
                  id="imageUploading"
                  height="100"
                />
              )}
              {props.role != 'customer' && (
                <input
                  type="image"
                  src={
                    ProfileDetails.chefPicId
                      ? ProfileDetails.chefPicId
                      : require('../../../images/mock-image/rockoly-logo.png')
                  }
                  // className="rounded-circle image"
                  style={{ width: '120px', height: '120px', borderRadius: '50%' }}
                  alt="Cinque Terre"
                  value="imageUploader"
                  id="imageUploading"
                  height="100"
                />
              )}
            </div>
            {/* <div className="middle"></div> */}
            <div className="text">
              <label htmlFor="file-input">
                <div className="pointerView">
                  {props.screen && props.screen === 'register' ? 'Upload' : 'Change'} Profile
                  Picture
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="file-input"
                onChange={event => {
                  uploadProfilePicture(event);
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                paddingRight: '2%',
              }}
            >
              {props.nextStep && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    props.currentStep === props.totalSteps ? skipImage() : nextStepFunction();
                  }}
                >
                  {props.role === chef ? 'Save' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {}
};
export default ProfilePictureUpload;
