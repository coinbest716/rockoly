import React, { useState, useEffect, useContext } from 'react';
import * as gqlTag from '../../../common/gql';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { toastMessage, success, renderError } from '../../../utils/Toast';
import { chef, customer } from '../../../utils/UserType';
import { getDateMonthYear, getDateFormat } from '../../../utils/DateTimeFormat';
import * as utils from '../../../utils/checkEmptycondition';
import Link from 'next/link';
import n from '../../routings/routings';
import RemoveConfirmModal from './RemoveConfirmModal';
import { NavigateToCardDetail } from './Navigation';
import { AppContext } from '../../../context/appContext';
import AddCardModal from '../../shared/modal/AddCardModal';
import { NavigateToAddCard, NavigateToChefAddCard, paymentPage } from './Navigation';
import Loader from '../../Common/loader';
import S from '../Payment.String';

//stripe payment data
let CLIENT_ID = 'ca_FzminCSsD5XREIvTBd8uKiIWB8JBL0W6';

//Add chef stripe account
const chefBankDeatailTag = gqlTag.mutation.chef.saveChefBankDetailsGQLTAG;

//Add chef bank detail
const ADD_CHEF_BANK_DATA = gql`
  ${chefBankDeatailTag}
`;

//Add default account
const updateChefDefaultAccountTag = gqlTag.mutation.chef.updateDefaultBankProfileGQLTAG;
//for update account details as default
const UPDATE_CHEF_DATA = gql`
  ${updateChefDefaultAccountTag}
`;

//get chef card list
const chefDataTag = gqlTag.query.stripe.accountDetailsByChefIdGQLTAG;
const removeChefCardTag = gqlTag.mutation.stripe.removeChefAccountGQLTAG;
//for getting chef data
const GET_CHEF_DATA = gql`
  ${chefDataTag}
`;

//for getting chef data
const REMOVE_CHEF_CARD = gql`
  ${removeChefCardTag}
`;

const ChefCardList = props => {
  const [cardListData, setCardListData] = useState([]);
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [state, setState] = useContext(AppContext);
  const [stripeId, setStripeId] = useState('');
  const [chefId, setChefId] = useState('');
  const [chefProfile, setChefProfile] = useState({});
  const [chefProfileExtended, setChefProfileExtended] = useState({});
  const [chefStripeId, setchefStripeId] = useState('');
  const [buttonType, setButtonType] = useState('Change default Account');
  const [accountId, setAccountId] = useState('');
  const [modalContent, setModalContent] = useState('');

  //List out the account details
  const [getChefData, { data, loading }] = useLazyQuery(GET_CHEF_DATA, {
    variables: {
      chefId: chefId ? chefId : null,
      limit: 10,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //for update account details as default
  const [updateChefBankData] = useMutation(UPDATE_CHEF_DATA, {
    onCompleted: data => {
      if (
        data &&
        data.updateChefBankProfileByChefBankProfileId &&
        data.updateChefBankProfileByChefBankProfileId.chefBankProfile &&
        data.updateChefBankProfileByChefBankProfileId.chefBankProfile.isDefaultYn === true
      ) {
        toastMessage(success, 'Default account Added Successfully');
        setButtonType('Change default Account');
      }
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //Add new account for chef
  const [addChefBankDetails] = useMutation(ADD_CHEF_BANK_DATA, {
    onCompleted: data => {
      toastMessage(success, 'Bank details Added Successfully');
      getChefData();
      paymentPage();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });
  //Remove chef account
  const [removeChefCard] = useMutation(REMOVE_CHEF_CARD, {
    onCompleted: data => {
      setRemoveModal(false);
      toastMessage(success, 'Card Removed Successfully');
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //set email and strip data
  useEffect(() => {
    if (utils.isObjectEmpty(state.chefProfile)) {
      setChefProfile(state.chefProfile);
      setChefId(state.chefId);
      if (
        utils.isObjectEmpty(state.chefProfile.chefProfileExtendedsByChefId) &&
        utils.isObjectEmpty(state.chefProfile.chefProfileExtendedsByChefId.nodes[0])
      ) {
        let data = state.chefProfile.chefProfileExtendedsByChefId.nodes[0];
        setChefProfileExtended(data);
      }
    }
  }, [state]);

  //set user data
  useEffect(() => {
    if(chefId)
    getChefData();
  }, [stripeId,chefId]);

  //set user data
  useEffect(() => {
    if (
      utils.isObjectEmpty(data) &&
      utils.hasProperty(data, 'stripeGetChefAccounts') &&
      utils.isObjectEmpty(data.stripeGetChefAccounts) &&
      utils.isObjectEmpty(data.stripeGetChefAccounts.data)
    ) {
      let listData = data.stripeGetChefAccounts.data;
      let bankData = listData.map(res => {
        if (res.is_default_yn && res.is_default_yn === true) {
          res.checked = true;
          setAccountId(res.chef_bank_profile_id);
          setSelectedItem(res);
          return res;
        } else {
          res.checked = false;
          return res;
        }
      });
      setCardListData(bankData);
    }
  }, [data]);

  function onCloseModal() {
    try {
      setRemoveModal(false);
      setSelectedItem({});
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  function onConfirmRemove() {
    try {
      if (selectedItem.is_default_yn === true) {
        setButtonType('Save default Account');
        setRemoveModal(false);
      } else {
        if (
          utils.isObjectEmpty(selectedItem) &&
          utils.isObjectEmpty(selectedItem.bank_details) &&
          utils.isStringEmpty(selectedItem.bank_details.id)
        ) {
          removeChefCard({
            variables: {
              chefId: chefId,
              accountId: selectedItem.bank_details.id,
            },
          }).then(data => {
            getChefData();
          });
        }
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  function onSetDefault() {
    try {
      if (
        utils.isObjectEmpty(selectedItem) &&
        utils.isStringEmpty(selectedItem.chef_bank_profile_id)
      ) {
        if (accountId !== selectedItem.chef_bank_profile_id) {
          updateChefBankData({
            variables: {
              chefBankProfileId: selectedItem.chef_bank_profile_id,
              isDefaultYn: true,
            },
          }).then(data => {
            getChefData();
          });
          updateChefBankData({
            variables: {
              chefBankProfileId: accountId,
              isDefaultYn: false,
            },
          }).then(data => {
            getChefData();
          });
        } else {
          updateChefBankData({
            variables: {
              chefBankProfileId: selectedItem.chef_bank_profile_id,
              isDefaultYn: true,
            },
          }).then(data => {
            getChefData();
          });
        }
      } else {
        toastMessage('renderError', 'Please select the account');
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  //change the button type
  function changeButton() {
    if (buttonType === 'Save default Account') {
      onSetDefault();
    } else {
      setButtonType('Save default Account');
    }
  }

  //Call the gql for set default account

  function onViewCardItem(response) {
    try {
      if (utils.isObjectEmpty(response)) {
        let details = {
          chefId: response.chef,
          cardId: response.id,
        };
        NavigateToCardDetail(details);
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  //On click add card button
  function onClickAddButton() {
    if (cardListData.length >= 3) {
      toastMessage('error', 'You can add only 3 bank details');
    } else {
      stripeCall();
    }
  }

  //call stripe payment site
  function stripeCall() {
    let stripeURL = `https://connect.stripe.com/express/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${window.location.origin}/payments`;

    if (!chefProfile) {
      return;
    }
    // basic start
    // email
    if (chefProfile.chefEmail) {
      stripeURL += `&stripe_user[email]=${chefProfile.chefEmail}`;
    }
    // phone number
    if (chefProfile.chefMobileNumber) {
      stripeURL += `&stripe_user[phone_number]=${chefProfile.chefMobileNumber}`;
    }
    // name
    if (chefProfile.chefFirstName) {
      stripeURL += `&stripe_user[first_name]=${chefProfile.chefFirstName}`;
    }
    if (chefProfile.chefLastName) {
      stripeURL += `&stripe_user[last_name]=${chefProfile.chefLastName}`;
    }
    // dob
    if (chefProfile.chefDob) {
      const dob = getDateMonthYear(chefProfile.chefDob);
      const date = dob.get('date');
      const month = dob.get('month') + 1; // 0 to 11
      const year = dob.get('year');
      stripeURL += `&stripe_user[dob_day]=${date}`;
      stripeURL += `&stripe_user[dob_month]=${month}`;
      stripeURL += `&stripe_user[dob_year]=${year}`;
    }
    // basic end
    // extended start
    // url
    if (chefProfileExtended.chefFacebookUrl) {
      stripeURL += `&stripe_user[url]=${chefProfileExtended.chefFacebookUrl}`;
    }
    // country
    // if (chefProfileExtended.chefCountry) {
    //   stripeURL += `&stripe_user[country]=${chefProfileExtended.chefCountry}`;
    // } else {
    stripeURL += `&stripe_user[country]=US`;
    // }
    // extended end

    if (typeof window == 'undefined') return;
    window.open(stripeURL); //to open new page
  }
  // console.log('chefStripeId', chefStripeId);
  //Get url data from stripe
  useEffect(() => {
    let url = window.location.href;
    if (url) {
      let data = getStripeCode(url);
      setchefStripeId(data);
    }
  });

  //seperate url data
  function getStripeCode(url) {
    let name = 'code';
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regexS = `[\\?&]${name}=([^&#]*)`;
    const regex = new RegExp(regexS);
    const results = regex.exec(url);
    if (results == null) return '';
    return results[1];
  }

  //call gql for add chef bank detail
  useEffect(() => {
    if (
      utils.isStringEmpty(chefStripeId) &&
      utils.isObjectEmpty(chefProfile) &&
      utils.isStringEmpty(chefProfile.chefId)
    ) {
      let variables = {
        chefId: chefProfile.chefId,
        token: chefStripeId,
      };
      addChefBankDetails({
        variables,
      });
    }
  }, [chefProfile, chefStripeId]);

  //set radio options
  function setRadioOptions(value) {
    setSelectedItem(value);
    let bankData = cardListData.map(res => {
      if (res.chef_bank_profile_id === value.chef_bank_profile_id) {
        res.checked = true;
        return res;
      } else {
        res.checked = false;
        return res;
      }
    });
    setCardListData(bankData);
  }

  //Remove account
  function removeAccount(value) {
    setRemoveModal(true);
    if (value.is_default_yn === true) {
      setModalContent(S.CHEF_REMOVE_ALERT_DEFAULT);
    } else {
      setModalContent(S.CHEF_REMOVE_ALERT);
      setSelectedItem(value);
    }
  }

  //loader
  function renderLoader() {
    if (loading !== undefined && loading === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  try {
    let cartItems = cardListData.length ? (
      cardListData.map((res, index) => {
        return (
          <div>
            {buttonType === 'Change default Account' ? (
              <div className="row" id="chef-card-view">
                <div className="" id="chef-name-view">
                  <i className="fas fa-credit-card" id="cardSpace"></i>
                  {res.bank_details.external_accounts &&
                    res.bank_details.external_accounts &&
                    res.bank_details.external_accounts.data[0] &&
                    res.bank_details.external_accounts.data[0].bank_name &&
                    res.bank_details.external_accounts.data[0].bank_name}
                  {'                '}
                </div>
                <div className="" id="chef-cardnumber-view">
                  {'**** **** **** '}
                  {res.bank_details.external_accounts &&
                    res.bank_details.external_accounts.data[0] &&
                    res.bank_details.external_accounts.data[0].last4 &&
                    res.bank_details.external_accounts.data[0].last4}
                </div>
                {/* <div className="col-2" id="cardNo1"></div> */}

                <div className="col-2" id="chef-date-view">
                  {res.bank_details.created && getDateFormat(res.bank_details.created)}
                </div>

                {res.is_default_yn === true ? (
                  <div className=" cuisineDisplay">
                    <div className=" dish-type description-content" id="defaultButton">
                      Default
                    </div>
                  </div>
                ) : (
                  <div className="" id="emptyOption">
                    ---
                  </div>
                )}
                <div className="" id="delete-button-view">
                  <button
                    className="btn btn-primary"
                    id="closeButton"
                    onClick={e => {
                      e.preventDefault();
                      removeAccount(res);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-name">
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="col-sm-2" id="input-method">
                    <input
                      type="radio"
                      name="radio-group"
                      onClick={() => setRadioOptions(res)}
                      checked={res.checked}
                    />{' '}
                  </div>
                  {/* <div className="col-sm-2"></div> */}
                  <div className="col-sm-3">
                    <i className="fas fa-credit-card" id="cardSpace"></i>{' '}
                    {res.bank_details.external_accounts &&
                      res.bank_details.external_accounts &&
                      res.bank_details.external_accounts.data[0] &&
                      res.bank_details.external_accounts.data[0].bank_name &&
                      res.bank_details.external_accounts.data[0].bank_name}{' '}
                  </div>
                  <div className="col-sm-3" id="cardNo1">
                    {'**** **** **** '}
                    {res.bank_details.external_accounts &&
                      res.bank_details.external_accounts.data[0] &&
                      res.bank_details.external_accounts.data[0].last4 &&
                      res.bank_details.external_accounts.data[0].last4}
                  </div>

                  <div className="col-2" id="cardNo11">
                    {res.bank_details.created && getDateFormat(res.bank_details.created)}
                  </div>
                </div>
              </div>
            )}
            <br />
            <br />
          </div>
        );
      })
    ) : (
      <div className="product-thumbnail" colspan="3">
        <p>Empty.</p>
      </div>
    );

    return (
      <React.Fragment>
        <div>
          <h2>Card List</h2>
          <br />
          <button type="button" className="btn btn-primary" onClick={() => changeButton()}>
            {buttonType}
          </button>
          {'   '}
          <button
            type="button"
            className="btn btn-primary"
            id="add-new-button"
            onClick={() => onClickAddButton()}
          >
            Add new card
          </button>
          <br />
          <br />
          <br />
          <div className="formContainer">
            <div>
              {/* <table className="table table-bordered">
                <tbody>{cartItems}</tbody>
              </table> */}

              {cartItems}
            </div>
            {removeModal === true && (
              <RemoveConfirmModal
                onCloseModal={onCloseModal}
                onConfirmRemove={onConfirmRemove}
                content={modalContent}
              />
            )}
          </div>
        </div>
        <br />
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};
export default ChefCardList;
