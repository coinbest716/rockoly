import React, { useState, useEffect } from 'react';
import * as gqlTag from '../../../common/gql';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { toastMessage, success, renderError } from '../../../utils/Toast';
import * as util from '../../../utils/checkEmptycondition';
import Link from 'next/link';
import n from '../../routings/routings';
import RemoveConfirmModal from './RemoveConfirmModal';
import Page from '../../shared/layout/Main';

const cardDataTag = gqlTag.query.stripe.cardDetailsGQLTAG;

//for getting chef data
const GET_CARD_DATA = gql`
  ${cardDataTag}
`;

const CardListItem = props => {
  const [cardListData, setCardListData] = useState([]);
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const getCardDataById = useQuery(GET_CARD_DATA, {
    variables: { customerId: props.cardDetails.customerId, cardId: props.cardDetails.cardId },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  try {
    return (
      <React.Fragment>
        <Page>
          <section className="cart-area ptb-60">
            <div className="cart-totals">
              <p>Card Details</p>
            </div>
          </section>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};
export default CardListItem;
