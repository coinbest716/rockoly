import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import * as gqlTag from '../../../../common/gql';
import Description from './Description';
import WorkGallery from './WorkGallery';
import Availability from './Availability';
import Reviews from './Reviews';
import { toastMessage } from '../../../../utils/Toast';
import * as util from '../../../../utils/checkEmptycondition';
import {
  getChefId,
  getCustomerId,
  chefId,
  chef,
  customer,
  getUserTypeRole,
  customerId,
} from '../../../../utils/UserType';

//chef
const chefDataTag = gqlTag.query.chef.profileByIdGQLTAG;
//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

const chefProfileSubscription = gqlTag.subscription.chef.ProfileGQLTAG;
const CHEF_SUBSCRIPTION_TAG = gql`
  ${chefProfileSubscription}
  `;

const chefLocationSubscription = gqlTag.subscription.chef.profileExtendedGQLTAG;
const CHEF_LOCATION_SUBS = gql`
  ${chefLocationSubscription}
`;
const attachmentSubscription = gqlTag.subscription.chef.attachmentGQLTAG;
const ATTACHMENT_SUBSCRIPTION = gql`
  ${attachmentSubscription}
`;

const chefSpecializationSubscription = gqlTag.subscription.chef.specializationGQLTAG;
const SPECIALIZATION_SUBSCRIPTION = gql`
  ${chefSpecializationSubscription}
`;

const availabilitySubscription = gqlTag.subscription.chef.availabilityGQLTAG;
const AVAILABILITY_SUBSCRIPTION = gql`
  ${availabilitySubscription}
`;


const DetailsTab = props => {

  const [chefIdValue, setChefId] = useState(null);
  const [customerIdValue, setCustomerId] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [ProfileDetails, setProfileDetails] = useState([]);
  const tab1 = 'tab1', tab2 = 'tab2', tab3 = 'tab3', tab4 = 'tab4';
  const [getChefDataByProfile, { data }] = useLazyQuery(GET_CHEF_DATA, {
    variables: { chefId: props.chefId },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (
      util.hasProperty(data, 'chefProfileByChefId') &&
      util.isObjectEmpty(data.chefProfileByChefId)
    ) {
      setProfileDetails(data.chefProfileByChefId);
    } else {
      setProfileDetails(null);
    }
  }, [data]);
  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (!res) {
          // console.log("res",res)
          getChefDataByProfile();
        }

        setUserRole(res);
        if (res === customer) {
          //customer user
          getCustomerId(customerId)
            .then(async customerResult => {
              await setCustomerId(customerResult);
              // console.log("customerResult",customerResult)
              // getCustomerData();
            })
            .catch(err => { });
        }
      })
      .catch(err => { });
  }, []);
  useEffect(() => {
    if (customerIdValue) {
      getChefDataByProfile();
    }
  }, customerIdValue)

  const { chefProfileSubsdata, error, loading } = useSubscription(CHEF_SUBSCRIPTION_TAG,
    {
      variables: { chefId: props.chefId },
      onSubscriptionData: (res) => {

        if (res.subscriptionData.data.chefProfile) {
          getChefDataByProfile();
        }
      },
    });
  const { chefLocationSubs } = useSubscription(CHEF_LOCATION_SUBS,
    {
      variables: { chefId: props.chefId },
      onSubscriptionData: (res) => {
        if (res.subscriptionData.data.chefProfileExtended) {

          getChefDataByProfile();
        }
      },
    });
  const { chefAttachmentsSubs } = useSubscription(ATTACHMENT_SUBSCRIPTION,
    {
      variables: { chefId: props.chefId },
      onSubscriptionData: (res) => {
        if (res.subscriptionData.data.chefAttachmentProfile) {
          getChefDataByProfile();
        }
      },
    });
  const { chefSpecializationSubsdata } = useSubscription(SPECIALIZATION_SUBSCRIPTION,
    {
      variables: { chefId: props.chefId },
      onSubscriptionData: (res) => {
        if (res.subscriptionData.data.chefSpecializationProfile) {
          getChefDataByProfile();
        }
      },
    });
  const { customerAvailabilitySubs } = useSubscription(AVAILABILITY_SUBSCRIPTION,
    {
      variables: { chefId: props.chefId },
      onSubscriptionData: (res) => {
        // console.log("res", res)
        if (res.subscriptionData.data.chefAvailabilityProfile) {
          getChefDataByProfile();
        }
      },
    });

  function openTabSection(evt, tabNmae) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabs_item');

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.remove('fadeInUp');
      tabcontent[i].style.display = 'none';
    }

    tablinks = document.getElementsByTagName('li');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace('current', '');
    }



    document.getElementById(tabNmae).style.display = 'block';
    document.getElementById(tabNmae).className += ' fadeInUp animated';


    evt.currentTarget.className += 'current';
  }

  try {
    return (
      <div className="col-lg-12 col-md-12" style={{ paddingTop: 121 }}>
        <div className="tab products-details-tab">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <ul className="tabs">
                {props.isClickBooking &&
                  <div>
                    {openTabSection(props.event, tab3)}
                  </div>
                }
                {props.isClickBooking ?
                  <li
                    onClick={e => {
                      e.preventDefault();
                      openTabSection(e, tab1);
                    }}
                  >
                    <a href="#">
                      <div className="dot"></div> Description
                  </a>
                  </li> :
                  <li
                    onClick={e => {
                      e.preventDefault();
                      openTabSection(e, tab1);
                    }}
                    className="current"
                  >
                    <a href="#">
                      <div className="dot"></div> Description
                    </a>
                  </li>
                }


                <li
                  onClick={e => {
                    e.preventDefault();
                    openTabSection(e, tab2);
                  }}
                >
                  <a href="#">
                    <div className="dot"></div> Work Gallery
                  </a>
                </li>
                 {props.isClickBooking ?
                  <li
                  onClick={e => {
                    e.preventDefault();
                    openTabSection(e, tab3);
                  }}
                  className="current"
                >
                  <a href="#">
                    <div className="dot"></div> Availability
                  </a>
                </li> : 
                <li
                onClick={e => {
                  e.preventDefault();
                  openTabSection(e, tab3);
                }}
              >
                <a href="#">
                  <div className="dot"></div> Availability
                </a>
              </li>
                 }
                

                <li
                  onClick={e => {
                    e.preventDefault();
                    openTabSection(e, tab4);
                  }}
                >
                  <a href="#">
                    <div className="dot"></div> Ratings & Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-lg-12 col-md-12" style={{ height: '100vh !important' }}>
              <div className="tab_content">
                <div id="tab1" className="tabs_item">
                  <div className="products-details-tab-content">
                    <Description chefDetails={ProfileDetails} />
                  </div>
                </div>

                <div id="tab2" className="tabs_item">
                  <div className="products-details-tab-content">
                    <WorkGallery chefDetails={ProfileDetails} />
                  </div>
                </div>

                <div id="tab3" className="tabs_item">
                  <div className="products-details-tab-content">
                    <Availability chefDetails={ProfileDetails} chefId={props.chefId} />
                  </div>
                </div>

                <div id="tab4" className="tabs_item">
                  <div className="products-details-tab-content">
                    <Reviews chefDetails={ProfileDetails} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default DetailsTab;
