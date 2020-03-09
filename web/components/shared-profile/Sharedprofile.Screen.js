import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { ToastContainer } from 'react-toastify';
import StepZilla from 'react-stepzilla';
import BasicProfileScreen from './components/basic-profile/BasicProfile.Screen';
import LocationScreen from './components/location/Location.Screen';
import AllergyUpdate from '../shared/preferences/components/AllergyUpdate';
import DietaryUpdate from '../shared/preferences/components/DietaryrestrictionsUpdate';
import KitchenUtensilsUpdate from '../shared/preferences/components/KitchenUtensilUpdate';
import Preference from '../shared/preferences/Preference';
import BaserateScreen from '../shared/chef-profile/base-rate/BaseRate.Screen';
import Complexity from '../shared/chef-profile/complexity/Complexity.Screen';
import ChefPreference from '../shared/chef-profile/chef-preference/ChefPreference';
import ImageGallery from '../shared/chef-profile/image-gallery/ImageGallery';
import LicenseUpload from '../shared/chef-profile/license-upload/LicenseUpload';
import ChefIntro from '../shared/chef-profile/intro/intro';
import FavoriteCuisine from '../shared/preferences/components/FavouriteCuisine';
import Page from '../shared/layout/Main';
import * as gqlTag from '../../common/gql';
import Location from '../profile-setup/components/Location';
import Description from '../profile-setup/components/Description';
import Specialization from '../profile-setup/components/Specialization';
import Availability from '../profile-setup/components/availability/Availability';
import UploadFile from '../profile-setup/components/UploadFile';
import PersonalInformationScreen from '../shared/chef-profile/personal-info/PersonalInformation.Screen';
import BasicInformation from '../profile-setup/components/BasicInformation';
import CurrentLocation from '../profile-setup/components/Location';
import gql from 'graphql-tag';
import { toastMessage } from '../../utils/Toast';
import MobileVerification from '../shared/mobile-number/MobileNumberVerification';
import UserEmail from '../shared/email/UserEmail';

import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../utils/UserType';
import * as util from '../../utils/checkEmptycondition';
import { logOutUser } from '../../utils/LogOut';
import ProfilePictureUpload from '../shared/profile-picture/ProfilePicture';

import StepWizard from 'react-step-wizard';
import SliderNavigation from './components/slider-navigation/SliderNavigation.Screen';

export default function SharedProfile() {
  const childRef = useRef();
  //customer
  const customerDataTag = gqlTag.query.customer.profileByIdGQLTAG;
  //for getting customer data
  const GET_CUSTOMER_DATA = gql`
    ${customerDataTag}
  `;

  //chef
  const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;
  //for getting chef data
  const GET_CHEF_DATA = gql`
    ${chefDataTag}
  `;

  // gql for subscription for chef
  const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
  const CHEF_SUBSCRIPTION_TAG = gql`
    ${chefProfileSubscription}
  `;

  // gql for subscription for chef specialization
  const chefSpecializationSubscription = gqlTag.subscription.chef.specializationGQLTAG;
  const SPECIALIZATION_SUBSCRIPTION = gql`
    ${chefSpecializationSubscription}
  `;
  // for chef location
  const chefLocationSubscription = gqlTag.subscription.chef.profileExtendedGQLTAG;
  const CHEF_LOCATION_SUBS = gql`
    ${chefLocationSubscription}
  `;

  // gql for subscription for customer
  const customerProfileSubscription = gqlTag.subscription.customer.profileGQLTAG;
  const CUSTOMER_SUBSCRIPTION_TAG = gql`
    ${customerProfileSubscription}
  `;
  // fro customer location
  const customerLocationSubscription = gqlTag.subscription.customer.profileExtendedGQLTAG;
  const CUSTOMER_LOCATION_SUBS = gql`
    ${customerLocationSubscription}
  `;

  // const [keys, setkeys] = useState(parseInt(props.keyValue));
  const [keys, setkeys] = useState(2);
  const [ProfileDetails, setProfileDetails] = useState([]);
  const [customerProfileDetails, setCustomerProfileDetails] = useState([]);
  const [chefDetails, setChefDetails] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [chefStatusId, setChefStatusId] = useState('');
  const [isFilledYn, setIsFilledYn] = useState(false);
  const [load, setLoading] = useState(false);
  const [roleType, setRoleType] = useState('');
  const [reason, setReason] = useState('');
  const [intialCustomerPage, setIntialCustomerPage] = useState(null);
  const [intialChefPage, setIntialChefPage] = useState(null);

  const [getCustomerData, { data }] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: { customerId: customerIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getChefDataByProfile, chefData] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const { chefProfileSubsdata } = useSubscription(CHEF_SUBSCRIPTION_TAG, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfile) {
        getChefDataByProfile();
      }
    },
  });

  const { chefSpecializationSubsdata } = useSubscription(SPECIALIZATION_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefSpecializationProfile) {
        getChefDataByProfile();
      }
    },
  });
  const { chefLocationSubs } = useSubscription(CHEF_LOCATION_SUBS, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    },
  });

  // const { SubscriptionCustomerdata } = useSubscription(CUSTOMER_SUBSCRIPTION_TAG, {
  //   variables: { customerId: customerIdValue },
  //   onSubscriptionData: res => {
  //     if (res.subscriptionData.data.customerProfile) {
  //       getCustomerData();
  //     }
  //   },
  // });
  const { customerLocationSubs } = useSubscription(CUSTOMER_LOCATION_SUBS, {
    variables: { customerId: customerIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.customerProfileExtended) {
        getCustomerData();
      }
    },
  });

  //get chef id
  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(async customerResult => {
              await setCustomerId(customerResult);
            })
            .catch(err => {});
        } else {
          //chef user
          getChefId(chefId)
            .then(async chefResult => {
              await setChefId(chefResult);
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  //set user data
  useEffect(() => {
    if (userRole === customer) {
      if (
        data &&
        data.customerProfileByCustomerId &&
        data.customerProfileByCustomerId.customerUpdatedScreens &&
        data.customerProfileByCustomerId.customerUpdatedScreens.length !== 0
      ) {
        setIntialCustomerPage(data.customerProfileByCustomerId.customerUpdatedScreens.length + 1);
      } else {
        setIntialCustomerPage(1);
      }
      setCustomerDetails(data);
    } else {
      setChefDetails(data);
    }
  }, [data]);

  useEffect(() => {
    if (chefIdValue) getChefDataByProfile();
  }, [chefIdValue]);

  useEffect(() => {
    if (customerIdValue) getCustomerData();
  }, [customerIdValue]);

  useEffect(() => {
    // getting chef's details
    if (
      util.isObjectEmpty(chefData) &&
      util.hasProperty(chefData, 'data') &&
      util.isObjectEmpty(chefData.data) &&
      util.hasProperty(chefData.data, 'chefProfileByChefId') &&
      util.isObjectEmpty(chefData.data.chefProfileByChefId)
    ) {
      if (
        chefData &&
        chefData.data &&
        chefData.data.chefProfileByChefId &&
        chefData.data.chefProfileByChefId.chefUpdatedScreens &&
        chefData.data.chefProfileByChefId.chefUpdatedScreens.length !== 0
      ) {
        setIntialChefPage(chefData.data.chefProfileByChefId.chefUpdatedScreens.length + 1);
      } else {
        setIntialChefPage(1);
      }
      let chefDetails = chefData.data.chefProfileByChefId;
      setProfileDetails(chefDetails);
      setChefStatusId(chefDetails.chefStatusId.trim());
      let data = JSON.parse(chefDetails.isDetailsFilledYn);
      setIsFilledYn(data.isFilledYn);
      let reason = chefDetails.chefRejectOrBlockReason ? chefDetails.chefRejectOrBlockReason : '';
      setReason(reason);
    } else {
      setProfileDetails(null);
    }
  }, [chefData]);

  useEffect(() => {
    // getting customer's details
    if (
      util.isObjectEmpty(data) &&
      util.hasProperty(data, 'customerProfileByCustomerId') &&
      util.isObjectEmpty(data.customerProfileByCustomerId)
    ) {
      setCustomerProfileDetails(data.customerProfileByCustomerId);
    } else {
      setCustomerProfileDetails(null);
    }
  }, [data]);

  const customerSteps = [
    {
      name: 'Home Address',
      component: (
        <CurrentLocation
          details={customerDetails}
          customerId={customerIdValue}
          role={'customer'}
          screen={'register'}
        />
      ),
    },
    {
      name: 'Allergies',
      component: (
        <AllergyUpdate customerId={customerIdValue} details={customerDetails} screen={'register'} />
      ),
    },
    {
      name: 'Dietary Restrictions',
      component: (
        <DietaryUpdate customerId={customerIdValue} details={customerDetails} screen={'register'} />
      ),
    },
    {
      name: 'Kitchen Equipments',
      component: (
        <KitchenUtensilsUpdate
          customerId={customerIdValue}
          details={customerDetails}
          screen={'register'}
        />
      ),
    },
    // {
    //   name: 'Favourite Cuisine',
    //   component: <FavoriteCuisine customerId={customerIdValue} />,
    // },
    {
      name: 'Profile Picture',
      component: (
        <ProfilePictureUpload
          details={customerDetails}
          id={customerIdValue}
          role={'customer'}
          isFromRegister={true}
        />
      ),
    },
    {
      name: 'Mobile Verification',
      component: (
        <MobileVerification
          screen={'basic'}
          details={customerDetails}
          id={customerIdValue}
          role={'customer'}
        />
      ),
    },
  ];

  const chefSteps = [
    {
      name: 'Introduction',
      component: <ChefIntro></ChefIntro>,
    },
    {
      name: 'Base Rate',
      component: (
        <BaserateScreen screen={'register'} chefDetails={ProfileDetails} chefId={chefIdValue} />
      ),
    },
    {
      name: 'Preferences',
      component: (
        <ChefPreference screen={'register'} chefDetails={ProfileDetails} chefId={chefIdValue} />
      ),
    },
    {
      name: 'Complexity',
      component: <Complexity screen={'register'} isFromRegister={true} chefId={chefIdValue} />,
    },
    {
      name: 'Specialization',
      component: (
        <Specialization
          screen={'register'}
          isFromRegister={true}
          chefDetails={ProfileDetails}
          chefId={chefIdValue}
        />
      ),
    },
    {
      name: 'Personal Info',
      component: <PersonalInformationScreen screen={'register'} chefId={chefIdValue} />,
    },
    {
      name: 'Profile Picture Upload',
      component: (
        <ProfilePictureUpload
          isFromRegister={true}
          details={ProfileDetails}
          id={chefIdValue}
          role={'chef'}
        />
      ),
    },
    {
      name: 'Image Gallery',
      component: <ImageGallery screen={'register'} chefId={chefIdValue} />,
    },
    {
      name: 'Upload File',
      component: <UploadFile screen={'register'} chefId={chefIdValue} />,
    },
    {
      name: 'Availability',
      component: <Availability screen={'register'} isFromRegister={true} chefId={chefIdValue} />,
    },
    {
      name: 'Location',
      component: (
        <CurrentLocation
          screen={'register'}
          role={'chef'}
          chefDetails={ProfileDetails}
          chefId={chefIdValue}
        />
      ),
    },
    {
      name: 'Mobile Verification',
      component: (
        <MobileVerification
          screen={'basic'}
          details={ProfileDetails}
          id={chefIdValue}
          role={'chef'}
        />
      ),
    },
  ];

  function uploadProfilePicture(value) {
    setIntialCustomerPage(value);
  }

  //To call logout
  function logoutFunction() {
    logOutUser('shared-profile');
  }

  try {
    return (
      <React.Fragment>
        <div className="separate-width-class">
          <ToastContainer />
          <div className="section-title" id="section-view-container">
            <h2 id="section-view-content">Setup Your Profile</h2>
            <button
              type="button"
              onClick={() => logoutFunction()}
              className="btn btn-primary signup_logout_btn"
              id="logout-button-profile"
            >
              LOGOUT
            </button>
          </div>
          <div
            className={`step-progress shared_profile ProfileSetup ${userRole} `}
            id="shared-profile-view"
          >
            <div
              className="container"
              id="sharesProfile-Customer-view"
              style={{ paddingBottom: '4%' }}
            >
              {intialChefPage !== null && userRole && userRole === chef && (
                <StepWizard initialStep={intialChefPage} nav={<SliderNavigation />}>
                  <UserEmail
                    screen={'register'}
                    chefDetails={ProfileDetails}
                    chefId={chefIdValue}
                    role={'chef'}
                  />
                  <MobileVerification
                    screen={'register'}
                    details={ProfileDetails}
                    id={chefIdValue}
                    role={'chef'}
                  />
                  <ChefIntro screen={'register'} chefId={chefIdValue}></ChefIntro>
                  <BaserateScreen
                    screen={'register'}
                    chefDetails={ProfileDetails}
                    chefId={chefIdValue}
                  />
                  <ChefPreference
                    screen={'register'}
                    chefDetails={ProfileDetails}
                    chefId={chefIdValue}
                  />
                  <Complexity screen={'register'} isFromRegister={true} chefId={chefIdValue} />
                  <Specialization
                    screen={'register'}
                    isFromRegister={true}
                    chefDetails={ProfileDetails}
                    chefId={chefIdValue}
                  />
                  <PersonalInformationScreen screen={'register'} chefId={chefIdValue} />
                  <ProfilePictureUpload
                    isFromRegister={true}
                    screen={'register'}
                    details={ProfileDetails}
                    id={chefIdValue}
                    role={'chef'}
                  />
                  <ImageGallery screen={'register'} chefId={chefIdValue} />
                  <UploadFile screen={'register'} chefId={chefIdValue} />
                  <Availability screen={'register'} isFromRegister={true} chefId={chefIdValue} />
                  <CurrentLocation
                    screen={'register'}
                    role={'chef'}
                    chefDetails={ProfileDetails}
                    chefId={chefIdValue}
                  />
                </StepWizard>
              )}

              {intialCustomerPage !== null && userRole && userRole === customer && (
                <StepWizard initialStep={intialCustomerPage} nav={<SliderNavigation />}>
                  <UserEmail
                    screen={'register'}
                    details={customerDetails}
                    id={customerIdValue}
                    role={'customer'}
                  />
                  <MobileVerification
                    screen={'register'}
                    details={customerDetails}
                    id={customerIdValue}
                    role={'customer'}
                  />
                  <CurrentLocation
                    details={customerDetails}
                    customerId={customerIdValue}
                    role={'customer'}
                    screen={'register'}
                  />
                  <AllergyUpdate
                    customerId={customerIdValue}
                    details={customerDetails}
                    screen={'register'}
                  />
                  <DietaryUpdate
                    customerId={customerIdValue}
                    details={customerDetails}
                    screen={'register'}
                  />
                  <KitchenUtensilsUpdate
                    customerId={customerIdValue}
                    details={customerDetails}
                    screen={'register'}
                  />
                  <ProfilePictureUpload
                    details={customerDetails}
                    id={customerIdValue}
                    role={'customer'}
                    screen={'register'}
                    isFromRegister={true}
                  />
                </StepWizard>
              )}
            </div>
          </div>

          {/* <div className={`step-progress shared_profile ProfileSetup ${userRole}`}>
            {(intialCustomerPage || intialChefPage) && (
              <StepZilla
                steps={userRole && userRole === 'chef' ? chefSteps : customerSteps}
                showNavigation={false}
                startAtStep={userRole && userRole === 'chef' ? intialChefPage : intialCustomerPage}
              />
            )}
          </div> */}
        </div>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
