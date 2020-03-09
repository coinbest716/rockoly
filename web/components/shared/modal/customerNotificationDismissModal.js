import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import * as gqlTag from '../../../common/gql';
import S from './Modal.String';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import { withApollo } from '../../../apollo/apollo';
import { isStringEmpty, isBooleanEmpty, isObjectEmpty } from '../../../utils/checkEmptycondition';
import { chef, customer } from '../../../utils/UserType';
import { NavigateToFeedbackPage, NavigateToLoginPage } from './Navigation';
import { AppContext } from '../../../context/appContext';

const dismissNotification = gqlTag.mutation.notification.updateStatusGQLTag;

const DISMISS_NOTIFICATION = gql`
  ${dismissNotification}
`;
const NotificationCustomerDismissModal = props => {
  const [dismissnotifications, { data }] = useMutation(DISMISS_NOTIFICATION, {
    onCompleted: data => {
      toastMessage('success', 'Notification dismissed');
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  function onClickYes() {
    if (props.onCloseModal) {
      props.onCloseModal();
    }

    if (props.notificationData === null) {
      dismissnotifications({
        // storing files in db
        variables: {
          pChefId: null,
          pCustomerId: props.customerId,
          pAdminId: null,
          pStatusId: 'DISMISSED',
          pNotificationId: null,
        },
      });
    } else {
      // dismiss 1 notification
      let unStringifyObject = JSON.parse(props.notificationData.notificationDetails);

      dismissnotifications({
        // storing files in db
        variables: {
          pChefId: null,
          pCustomerId: props.customerId,
          pAdminId: null,
          pStatusId: 'DISMISSED',
          pNotificationId: props.notificationData.notificationHistId,
        },
      });
      // }
    }
  }
  function closeModal() {
    if (props.onCloseModal) {
      props.onCloseModal();
    }
  }

  return (
    <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
      <div className="bts-popup-container">
        <h6>{props.content}</h6>
        <button
          type="submit"
          className="btn btn-success"
          onClick={() => {
            onClickYes();
          }}
        >
          {S.YES}
        </button>

        <button
          type="button"
          style={{ marginLeft: '23px' }}
          className="btn btn-danger"
          onClick={closeModal}
        >
          {S.NO}
        </button>
        <Link href="#">
          <a onClick={closeModal} className="bts-popup-close"></a>
        </Link>
      </div>
    </div>
  );
};

export default withApollo(NotificationCustomerDismissModal);
