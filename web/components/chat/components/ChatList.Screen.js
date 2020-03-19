import React, { useState, useEffect, useContext } from 'react';
import Page from '../../shared/layout/Main';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import {
  convertDateandTime,
  convertDate,
  getDateFormat,
  fromNow,
  getDateWithTime,
  getDateWithTimeLocal,
} from '../../../utils/DateTimeFormat';
import gql from 'graphql-tag';
import Loader from '../../Common/loader';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import _ from 'lodash';
import { AppContext } from '../../../context/appContext';

const chatListById = gqlTag.query.chat.getConversationListGQLTAG;
const getTotalCount = gqlTag.query.custom.totalCountGQLTAG;
const offset = 0;

const CHAT_LIST_BY_ID = gql`
  ${chatListById}
`;

const CHAT_COUNT_BY_ID = gql`
  ${getTotalCount}
`;

export default function ChatListScreen(props) {
  const sampleChatList = [
    { name: 'ChatList1', id: '1', desc: 'description1', img: null },
    { name: 'ChatList2', id: '2', desc: 'descriptio2', img: null },
  ];
  const [chatList, setChatList] = useState(null);
  const [chatListCountValue, setChatListCountValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [state, setState] = useContext(AppContext);
  const [userId, setUserId] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [firstNum, setFirstNum] = useState(15);

  //Fetching favorite list of particular customer

  const [getChatList, getChatListData] = useLazyQuery(CHAT_LIST_BY_ID, {
    variables: {
      pEntityId: userId,
      first: firstNum,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (state.role === 'customer') {
      if (state && state.customerProfile && state.customerProfile.entityId) {
        setUserId(state.customerProfile.entityId);
      }
    } else {
      if (state && state.chefProfile && state.chefProfile.entityId) {
        setUserId(state.chefProfile.entityId);
      }
    }
  }, [state]);

  let data = {
    type: 'CONVERSATIONS',
    entityId: userId,
  };

  const [getChatListCount, chatListCount] = useLazyQuery(CHAT_COUNT_BY_ID, {
    variables: {
      pData: JSON.stringify(data),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    if (userId !== '') {
      getChatList();
      getChatListCount();
    }
  }, [userId]);

  useEffect(() => {
    if (chatListCount && chatListCount.data && chatListCount.data.totalCountByParams) {
      setTotalCount(chatListCount.data.totalCountByParams);
    }
  }, [chatListCount]);

  useEffect(() => {
    // if (
    //   getFavoriteChefListData &&
    //   getFavoriteChefListData.data &&
    //   getFavoriteChefListData.data.allMessageHistories
    // ) {
    if (
      getChatListData &&
      getChatListData.data &&
      getChatListData.data.getConversationList &&
      getChatListData.data.getConversationList.nodes
    ) {
      let value = getChatListData.data.getConversationList.nodes;
      setChatList(value);
      setChatListCountValue(value.length);
    }
    // }
  }, [getChatListData]);

  function listItemStyle(res) {
    if (
      props &&
      props.chatListId &&
      props.chatListId.conversationId &&
      props.chatListId.conversationId === res.conversationId
    ) {
      let style = {
        padding: '8px',
        margin: '1px',
        color: '#fff',
        backgroundColor: '#08AB93',
      };
      return style;
    } else {
      let style = {
        padding: '8px',
        margin: '1px',
      };
      return style;
    }
  }

  function stringTrim(value) {
    if (value) {
      // todo: Dhilipan the json parse throws error
      // let txt = JSON.parse(value);
      let txt = value;
      if (txt != null && txt != '') {
        if (txt.length > 10) {
          let res = txt.slice(0, 15);
          let newValue = res + '...';
          return newValue;
        } else {
          return value;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  function onLoadMoreButtonClick() {
    setFirstNum(firstNum + 4);
  }

  function chatDataParser(value) {
    try {
      let newValue = JSON.parse(value);
      return newValue;
    } catch (e) {
      return value;
    }
  }

  function chatListRender() {
    if (chatList) {
      if (chatList && chatList.length > 0) {
        return chatList.map((res, index) => {
          let chefBookingDetails = JSON.parse(res.conversationDetails);
          return (
            <div style={listItemStyle(res)}>
              <div
                onClick={() => chatListPress(res, index, chefBookingDetails)}
                style={{ borderBottom: '1px solid lightgray' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="" style={{ display: 'flex' }}>
                    <img
                      src={
                        res.conversationPic
                          ? res.conversationPic
                          : require('../../../images/mock-image/default_chef_profile.png')
                      }
                      alt="image"
                      style={{ borderRadius: '50%', width: '50px', height: '50px' }}
                    />
                    {res && (res.conversationName != '' || res.conversationName != null) && (
                      <b
                        className="chat-user-name"
                        style={{
                          marginLeft: '14px',
                          width: 'calc(100vw - 92vw)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {res.conversationName}
                      </b>
                    )}

                    {res &&
                      (res.conversationLastMessage != '' && res.conversationLastMessage != null) &&
                      (stringTrim(res.conversationLastMessage) != '' &&
                        stringTrim(res.conversationLastMessage) == null && (
                          <div style={{ marginLeft: '11%' }}>
                            {stringTrim(res.conversationLastMessage)}
                          </div>
                        ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {res.conversationLastMessageTimestamp
                      ? fromNow(res.conversationLastMessageTimestamp)
                      : fromNow(res.conversationDate)}
                  </div>
                </div>

                {chefBookingDetails &&
                  chefBookingDetails.chef_booking_from_time &&
                  chefBookingDetails.chef_booking_to_time && (
                    <div
                      style={{
                        position: 'relative',
                        left: '65px',
                        bottom: '25px',
                        fontSize: '13px',
                        // marginLeft: '11%',
                        paddingRight: '10%',
                        width: '88%',
                      }}
                    >
                      {getDateWithTimeLocal(chefBookingDetails.chef_booking_from_time)} {' / '}
                      {getDateWithTimeLocal(chefBookingDetails.chef_booking_to_time)}
                    </div>
                  )}
                {res &&
                  res.conversationRefTableName &&
                  res.conversationRefTableName === 'chef_customer_conversation' && (
                    <div
                      style={{
                        position: 'relative',
                        left: '35px',
                        bottom: '25px',
                        fontSize: '13px',
                        marginLeft: '11%',
                        paddingRight: '10%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {chatDataParser(res.conversationLastMessage)}
                    </div>
                  )}
              </div>
            </div>
          );
        });
      } else if (chatList && chatList.length === 0) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>No data</div>
        );
      } else if (chatList === null) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Loader />;
          </div>
        );
      }
    } else {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>No data</div>
      );
    }
  }

  function chatListPress(idValue, index, chefBookingDetails) {
    let value = JSON.parse(idValue.conversationDetails);
    let val = {
      conversationId: idValue.conversationId,
      fullName: idValue.conversationName,
      pic: idValue.conversationPic,
      status: value && value.chef_booking_status_id ? value.chef_booking_status_id.trim() : '',
      createdAt: chefBookingDetails.createdAt,
    };
    setSelectedItem(index);
    props.handleChatListId(val);
  }

  try {
    return (
      <React.Fragment>
        <div>
          <h4
            className="chatlist-header"
            style={{ display: 'flex', justifyContent: ' center', color: '#08AB93' }}
          >
            Inbox
          </h4>
          {totalCount !== null && (
            <div style={{ color: '#08AB93' }}>
              Showing: {chatListCountValue} of {totalCount}
            </div>
          )}
          {chatListRender()}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              color: '#08AB93',
              cursor: 'pointer',
            }}
          >
            {chatList && chatList.length > 0 && totalCount > chatList.length && (
              <button className="btn btn-primary" onClick={() => onLoadMoreButtonClick()}>
                Load More
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
