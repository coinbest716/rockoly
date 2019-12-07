// TOdo-cr-si remove unused code
import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
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
import * as util from '../../../utils/checkEmptycondition';
import { toastMessage } from '../../../utils/Toast';
import S from '../../profile-setup/ProfileSetup.String';
import { GetValueFromLocal } from '../../../utils/LocalStorage';

const storageRef = firebase.storage().ref();


const customerProfilePicture = gqlTag.mutation.customer.updateCustomerProfilePicGQLTAG;
const ProfilePicture = gqlTag.mutation.chef.updateChefProfilePicGQLTAG;

// upload customer profile picture
const UPLOAD__CUSTOMER_PROFILE_PICTURE = gql`
  ${customerProfilePicture}
`;

// upload chef profile picture
const UPLOAD_PROFILE_PICTURE = gql`
  ${ProfilePicture}
`;

const ProfilePictureUpload = (props) => {

  const [customerIdValue, setCustomerId] = useState();
  const [chefIdValue,setChefId] = useState();
  const [ProfileDetails, setProfileDetails] = useState();
  const [load, setLoading] = useState(false);


  const [uploadcustomerProfilePicture, { datas }] = useMutation(UPLOAD__CUSTOMER_PROFILE_PICTURE, {
    onCompleted: datas => {
      setLoading(false);
      toastMessage('success', 'Profile Picture Uploaded Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const [uploadchefProfilePicture, { dataValue }] = useMutation(UPLOAD_PROFILE_PICTURE, {
    onCompleted: datas => {
      setLoading(false);
      toastMessage('success', 'Profile Picture Uploaded Successfully');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  useEffect(() => {
    if(props.role === customer){
      setCustomerId(props.id)
    }else if(props.role === chef){
      setChefId(props.id)
    }
  }, [props]);

  useEffect(() =>{
   
    if(util.isObjectEmpty(props.details) &&
       util.hasProperty(props.details,"customerProfileByCustomerId")&&
       util.isObjectEmpty(props.details.customerProfileByCustomerId)
    ){
      setProfileDetails(props.details.customerProfileByCustomerId);
    }
    else if(util.isObjectEmpty(props.details) &&
    util.hasProperty(props.details,"chefPicId")){
      setProfileDetails(props.details)
    }
  },[props])

  function uploadProfilePicture(event){
   
    if(props.role===customer){
      setLoading(true);
      var reader = new FileReader();
      reader.onload = function () {
        var output = document.getElementById('imageUploading');
        output.src = reader.result;
        const dateTime = new Date().getTime();
        const randNo = Math.floor(Math.random() * 9000000000) + 1000000000;
        const imageFileName = `${customerIdValue}/PROFILE_PICTURE/${dateTime}_${randNo}`
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
    }else if(props.role === chef){
      setLoading(true);
    var reader = new FileReader();
    reader.onload = function () {
      var output = document.getElementById('imageUploading');
      output.src = reader.result;
      const dateTime = new Date().getTime();
      const randNo = Math.floor(Math.random() * 9000000000) + 1000000000;
      const imageFileName = `${chefIdValue}/PROFILE_PICTURE/${dateTime}_${randNo}`
      // console.log('loading', load);
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
                  chefId : chefIdValue,
                  chefPicId : url
                },
              });
            });
        });
    };
    reader.readAsDataURL(event.target.files[0]);
    }
    
  }
  try {
    return (
      <div className="ProfileSetup">
        {ProfileDetails && (
          <div className="containers">
          {load && <Loader />}
            <input
              type="image"
              src={
                ProfileDetails.customerPicId
                  ? ProfileDetails.customerPicId
                  : ProfileDetails .chefPicId ?
                  ProfileDetails .chefPicId
                  :require('../../../images/mock-image/sample_user.png')
              }
              className="rounded-circle image"
              alt="Cinque Terre"
              value="imageUploader"
              id="imageUploading"
            />
            <div className="middle">
              <div className="text">
                <label htmlFor="file-input">
                  <div className="pointerView">Change</div>
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
            </div>
          </div>
        )}
        
   </div>
    )
  } catch (error) {
    console.log("error", error)
  }
}
export default ProfilePictureUpload;