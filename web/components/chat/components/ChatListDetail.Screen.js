import React, { useState, useEffect, useContext, useRef } from 'react';
import Page from '../../shared/layout/Main';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import * as gqlTag from '../../../common/gql';
import { convertDateandTime, convertDate } from '../../../utils/DateTimeFormat';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { AppContext } from '../../../context/appContext';
import S from './ChatScreen.String';
import _ from 'lodash';

const chatDetailById = gqlTag.query.chat.conversationMessagesGQLTAG;
const chatDataPost = gqlTag.mutation.chat.createMsgGQLTAG;
const chatSubs = gqlTag.subscription.chat.messsageHistoryGQLTAG;
const getTotalCount = gqlTag.query.custom.totalCountGQLTAG;

const CHAT_DETAIL_BY_ID = gql`
  ${chatDetailById}
`;

const CHAT_DATA_POST = gql`
  ${chatDataPost}
`;

const chatSubsGQL = gql`
  ${chatSubs}
`;

export default function ChatDetailScreen(props) {
  const [chatId, setChatId] = useState(props.chatListId.conversationId);
  const [chatMsgAry, setChatMsgAry] = useState([]);
  const [inputValue, setInputValue] = useState(null);
  const [state, setState] = useContext(AppContext);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [firstNum, setFirstNum] = useState(5);
  const [chatListCountValue, setChatListCountValue] = useState(0);
  const [showSend, setShowSend] = useState(false);
  const ref = React.createRef();

  // function handleClick() {
  //   console.log('dasjkjhkjasdasd', ref);
  //   if (ref && ref.current) {
  //     console.log('dasjkjhkjasdasd 0000', ref);
  //     ref.current.scrollIntoView({
  //       behavior: 'smooth',
  //       // block: 'start',
  //     });
  //   }
  // }

  //Fetching favorite list of particular customer
  // const getFavoriteChefListData = useQuery(CHAT_DETAIL_BY_ID, {
  //   variables: {
  //     conversationHistId: props.chatListId,
  //   },
  // });

  // const messagesEndRef = useRef();

  const subsDate = useSubscription(chatSubsGQL, {
    variables: {
      conversationHistId: props.chatListId.conversationId,
    },
    onSubscriptionData: res => {
      if (res) {
        getChatDetailData();
        getChatListCount();
        setShowSend(false);
      }
    },
  });

  let data = {
    type: 'CONVERSATION_MESSAGES',
    conversationHistId: props.chatListId.conversationId,
  };

  const CHAT_COUNT_BY_ID = gql`
    ${getTotalCount}
  `;

  const [getChatListCount, chatListCount] = useLazyQuery(CHAT_COUNT_BY_ID, {
    variables: {
      pData: JSON.stringify(data),
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [getChatDetailData, chatDetail] = useLazyQuery(CHAT_DETAIL_BY_ID, {
    variables: {
      conversationHistId: props.chatListId.conversationId,
      first: firstNum,
      offset: 0,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    setChatMsgAry(messageForId);
    if (state.role === 'customer') {
      setUserId(state.customerId);
    } else {
      setUserId(state.chefId);
    }
    // scrollToBottom();
  }, []);

  useEffect(() => {
    if (chatListCount && chatListCount.data && chatListCount.data.totalCountByParams) {
      setTotalCount(chatListCount.data.totalCountByParams);
    }
  }, [chatListCount]);

  useEffect(() => {
    if (props && props.chatListId && props.chatListId.conversationId) {
      setTotalCount(0);
      setChatListCountValue(0);
      setFirstNum(5);
      getChatDetailData();
      getChatListCount();
    }
  }, [props.chatListId.conversationId]);

  const [postChatData, { chatData }] = useMutation(CHAT_DATA_POST, {
    onCompleted: chatData => {
      setInputValue('');
    },
    onError: err => {
      toastMessage(renderError, err.message);
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

  useEffect(() => {
    if (chatDetail && chatDetail.data && chatDetail.data.allMessageHistories) {
      setChatMsgAry(chatDetail.data.allMessageHistories);
      if (
        chatDetail.data.allMessageHistories &&
        chatDetail.data.allMessageHistories.nodes.length > 0
      ) {
        setChatListCountValue(chatDetail.data.allMessageHistories.nodes.length);
        // handleClick();
      }
    }
  }, [chatDetail]);

  useEffect(() => {
    if (props.chatListId) {
      setChatId(props.chatListId);
    }
  }, [props.chatListId]);

  const sampleChatList = [{ name: 'ChatList1', id: 1 }, { name: 'ChatList2', id: 2 }];
  const messageForId = [
    {
      fromId: '1',
      toId: '2',
      text: 'test message One',
      date: '12:00:00',
      img: 'null',
    },
    {
      fromId: '2',
      toId: '1',
      text: 'test message Two',
      date: '12:00:00',
      img: 'null',
    },
    {
      fromId: '1',
      toId: '2',
      text: 'test message Three',
      date: '12:00:00',
      img: 'null',
    },
    {
      fromId: '1',
      toId: '2',
      text: 'test message Four',
      date: '12:00:00',
      img: 'null',
    },
    {
      fromId: '2',
      toId: '1',
      text: 'test message Five',
      date: '12:00:00',
      img: 'null',
    },
  ];
  const [chatList, setChatList] = useState([]);

  function chatListRender() {
    // return sampleChatList.map((res, index) => {
    //   console.log('dalskjdlk1j23123', res);
    //   return <div>{res.name}</div>;
    // });
    if (chatMsgAry && chatMsgAry.nodes && chatMsgAry.nodes.length > 0) {
      let value = _.orderBy(chatMsgAry.nodes, ['createdAt'], ['asc']);
      return value.map((res, index) => {
        let nameData = JSON.parse(res.fromEntityDetails);
        return (
          <div>
            <div style={chatListStyle(res)}>
              {res.fromEntityId !== userId ? (
                <div
                  className="col-5"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ height: '30px', width: '30px' }}>
                    <img
                      src={
                        props.chatListId.pic
                          ? props.chatListId.pic
                          : require('../../../images/mock-image/default_chef_profile.png')
                      }
                      alt="image"
                      style={{ borderRadius: '50%' }}
                    />
                    {/* {imageAlign(res)} */}
                  </div>
                  <div style={chatTextStyle(res)}>
                    <div>{JSON.parse(res.msgText)}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <text style={{ fontSize: '13px' }}>{convertDateandTime(res.createdAt)}</text>
                    </div>
                  </div>
                </div>
              ) : (
                  <div
                    className="col-5"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={chatTextStyle(res)}>
                      <div>{JSON.parse(res.msgText)}</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <text style={{ fontSize: '13px' }}>{convertDateandTime(res.createdAt)}</text>
                      </div>
                    </div>
                    <div style={{ height: '30px', width: '30px' }}>
                      <img
                        src={require('../../../images/mock-image/default_chef_profile.png')}
                        alt="image"
                        style={{ borderRadius: '50%' }}
                      />
                      {/* {imageAlign(res)} */}
                    </div>
                  </div>
                )}
              {/* <div ref={this.messagesEndRef} /> */}
            </div>
            {/* <div ref={ref} /> */}
          </div>
        );
      });
    } else {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>No data</div>
      );
    }
  }

  // function imageAlign(res) {
  //   let image = '';
  //   if (state.role === 'customer') {
  //     image = state.chefProfile.chefPicId;
  //   } else {
  //     image = state.customerProfie.customerPicId;
  //   }
  //   console.log('daslkdhakshdksadasd', state);
  //   return null;
  //   // <img
  //   //   src={image ? image : require('../../../images/mock-image/default_chef_profile.png')}
  //   //   alt="image"
  //   //   style={{ borderRadius: '50%' }}
  //   // />null
  // }

  function chatListStyle(res) {
    if (res.fromEntityId === userId) {
      let style = {
        display: 'flex',
        justifyContent: 'flex-end',
      };
      return style;
    } else {
      let style = {
        display: 'flex',
        justifyContent: 'flex-start',
      };
      return style;
    }
  }

  function chatTextStyle(res) {
    if (res.fromEntityId === userId) {
      let style = {
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        borderBottomRightRadius: '15px',
        borderTopLeftRadius: '15px',
        padding: '10px',
        background: '#08AB93',
        margin: '2px',
      };
      return style;
    } else {
      let style = {
        padding: '10px',
        borderBottomRightRadius: '15px',
        borderTopLeftRadius: '15px',
        background: '#d7d7d7',
        margin: '2px',
      };
      return style;
    }
  }
  function inputValueChange(e) {
    setInputValue(e.target.value);
  }

  function onSubmitButtonClick() {
    setShowSend(true);
    if (inputValue) {
      // let newArray = chatMsgAry;
      let variables = {
        fromEntityId: userId,
        conversationHistId: props.chatListId.conversationId,
        msgText: JSON.stringify(inputValue),
      };
      postChatData({
        variables,
      }).then(data => {
        setInputValue('');
      });
    }
  }

  function onLoadMoreButtonClick() {
    setFirstNum(firstNum + 5);
  }

  try {
    return (
      <React.Fragment>
        <div id="chat-text-view">
          {props.chatListId && <h4 style={{ color: '#08AB93' }}>{props.chatListId.fullName}</h4>}
          {/* {chatListCount > firstNum && */}
          {chatListCountValue < totalCount && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#08AB93',
                cursor: 'pointer',
              }}
              onClick={() => onLoadMoreButtonClick()}
            >
              Load Earlier Messages
            </div>
          )}
          {/* } */}

          {props.chatListId && chatListRender()}
        </div>
        {props.chatListId &&
          (props.chatListId.status.trim() !== S.CHEF_REJECTED &&
            props.chatListId.status.trim() !== S.COMPLETED &&
            props.chatListId.status.trim() !== S.AMT_TRANSFER_FAILED &&
            props.chatListId.status.trim() !==  S.AMT_TRANSFER_SUCCESS &&
            props.chatListId.status.trim() !== S.REFUND_AMOUNT_FAILED &&
            props.chatListId.status.trim() !== S.REFUND_AMOUNT_SUCCESS &&
            props.chatListId.status.trim() !== S.CANCELLED_BY_CHEF &&
            props.chatListId.status.trim() !== S.CANCELLED_BY_CUSTOMER) && (
            <div
              className="chat-input-style"
              style={{
                margin: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                width: '92%',
              }}
            >
              <textarea
                className="input-method"
                type="text"
                value={inputValue}
                onChange={val => inputValueChange(val)}
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  maxHeight: '70px',
                  height: '70px',
                  minHeight: '70px',
                }}
                placeholder="Enter Your message here..."
              />
              <button
                className="btn btn-primary"
                disabled={showSend}
                onClick={() => onSubmitButtonClick()}
                style={{ marginLeft: '4%', marginBottom: '10px' }}
              >
                Send
              </button>
            </div>
          )}
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}