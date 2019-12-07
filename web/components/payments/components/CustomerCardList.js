import React, { useState, useEffect, useContext } from 'react';
import * as gqlTag from '../../../common/gql';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { toastMessage, success, renderError } from '../../../utils/Toast';
import * as utils from '../../../utils/checkEmptycondition';
import Link from 'next/link';
import RemoveConfirmModal from './RemoveConfirmModal';
import { NavigateToCardDetail } from './Navigation';
import { AppContext } from '../../../context/appContext';
import AddCardModal from '../../shared/modal/AddCardModal';
import { NavigateToAddCard } from './Navigation';
import Loader from '../../Common/loader';

//customer
const customerDataTag = gqlTag.query.stripe.customerCardsGQLTAG;
const removeCustomerCardTag = gqlTag.mutation.stripe.removeCardGQLTAG;
//for getting customer data
const GET_CUSTOMER_DATA = gql`
  ${customerDataTag}
`;

//for getting customer data
const REMOVE_CUSTOMER_CARD = gql`
  ${removeCustomerCardTag}
`;

const CustomerCardList = props => {
  const [cardListData, setCardListData] = useState([]);
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [state, setState] = useContext(AppContext);
  const [stripeId, setStripeId] = useState('');
  const [cardData, setCardData] = useState({});
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [getCustomerData, { data, loading }] = useLazyQuery(GET_CUSTOMER_DATA, {
    variables: {
      customerId: stripeId,
      limit: 10,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [removeCustomerCard] = useMutation(REMOVE_CUSTOMER_CARD, {
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
    if (
      utils.isObjectEmpty(state.customerProfile) &&
      utils.hasProperty(state.customerProfile, 'customerProfileExtendedsByCustomerId') &&
      utils.isObjectEmpty(state.customerProfile.customerProfileExtendedsByCustomerId) &&
      utils.hasProperty(state.customerProfile.customerProfileExtendedsByCustomerId, 'nodes') &&
      utils.isObjectEmpty(state.customerProfile.customerProfileExtendedsByCustomerId.nodes[0])
    ) {
      let stripDetails =
        state.customerProfile.customerProfileExtendedsByCustomerId.nodes[0]
          .customerStripeCustomerId;
      setStripeId(stripDetails);
    }
  }, [state]);

   //set user data
  useEffect(() => {
    if(stripeId)
    getCustomerData();
  }, [stripeId]);

  //set user data
  useEffect(() => {
    if (
      utils.isObjectEmpty(data) &&
      utils.hasProperty(data, 'stripeGetCustomerCards') &&
      utils.isObjectEmpty(data.stripeGetCustomerCards) &&
      utils.isObjectEmpty(data.stripeGetCustomerCards.data) &&
      utils.isArrayEmpty(data.stripeGetCustomerCards.data.data)
    ) {
      let listData = data.stripeGetCustomerCards.data.data;
      setCardListData(listData);
    } else {
      setCardListData([]);
    }
  }, [data]);

  function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  function onConfirmRemove() {
    try {
      if (utils.isObjectEmpty(selectedItem)) {
        removeCustomerCard({
          variables: {
            customerId: selectedItem.customer,
            cardId: selectedItem.id,
          },
        }).then(data => {
          getCustomerData();
        });
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  function onViewCardItem(response) {
    try {
      if (utils.isObjectEmpty(response)) {
        let details = {
          customerId: response.customer,
          cardId: response.id,
        };
        NavigateToCardDetail(details);
      }
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  //set card value
  function setCardDetails(data) {
    setCardData(data);
  }

  //call back function for select card
  function selectCard() {
    if (props.closeModal) {
      if (utils.isObjectEmpty(cardData)) {
        props.closeModal(cardData);
      } else {
        toastMessage(renderError, 'Please select card');
      }
    }
  }

  //To close the add card modal
  function closeAddCardModal() {
    getCustomerData();
    setAddModalOpen(false);
  }

  //On click add card button
  function onClickAddButton() {
    if (cardListData.length < 5) {
      if (props && props.type === 'modal') {
        setAddModalOpen(true);
      } else {
        NavigateToAddCard();
      }
    } else {
      toastMessage('error', 'You can add only 5 cards');
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
            {props && props.type && props.type === 'page' ? (
              // <div>
              <div className="row card" id="customer-card-view">
                <div
                  className="col-4 row cardNo1"
                  id="card-content-view"
                  onClick={() => onViewCardItem(res)}
                >
                  <i className="fas fa-credit-card" id="cardSpace"></i>
                  <div className="cardNo1">{res.brand}</div>
                </div>
                <div className=" col-4 cardNo1" id="card-number-view">
                  {'**** **** **** '}
                  {res.last4}
                </div>
                <div className="col-4" id="customer-button-view">
                  <button
                    className="btn btn-primary deleteButton"
                    id="closeButton"
                    onClick={e => {
                      e.preventDefault();
                      setRemoveModal(true);
                      setSelectedItem(res);
                    }}
                  >
                    Delete
                  </button>
                </div>
                {/* </div> */}
              </div>
            ) : (
              <td className="product-name">
                <div className="row">
                  <div className="col-sm-12 cardSelect">
                    <input type="radio" name="radio-group" onClick={() => setCardDetails(res)} />{' '}
                    <i className="fas fa-credit-card" id="cardSpace"></i>
                    {res.brand} {'**** **** **** '}
                    {res.last4}
                  </div>
                </div>
              </td>
            )}
          </div>
        );
      })
    ) : (
      <tr>
        <td className="product-thumbnail" colspan="5">
          <p>Empty.</p>
        </td>
      </tr>
    );

    return (
      <React.Fragment>
        <div>
          <div
            className="row"
            id="card-list-row"
            // style={{ marginTop: '7%', display: 'flex', justifyContent: 'spaceBetween' }}
          >
            <h2>{props && props.type === 'modal' ? 'Select card' : 'Card List'}</h2>
            <button
              type="button"
              className="btn btn-primary addCard"
              id="closeButton"
              onClick={() => onClickAddButton()}
            >
              Add new card
            </button>
          </div>
          <br />
          <div className="formContainer">
            <div>
              {renderLoader()}
              {cartItems}
            </div>
            {removeModal === true && (
              <RemoveConfirmModal
                onCloseModal={onCloseModal}
                onConfirmRemove={onConfirmRemove}
                content="Are you sure you want to remove this card?"
              />
            )}
          </div>
        </div>
        <br />
        {utils.isObjectEmpty(cardData) && props && props.type === 'modal' && (
          <button type="button" className="btn btn-primary" onClick={() => selectCard()}>
            Continue
          </button>
        )}
        <div>{addModalOpen === true && <AddCardModal closeAddCardModal={closeAddCardModal} />}</div>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};
export default CustomerCardList;
