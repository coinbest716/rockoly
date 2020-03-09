import React, { useState, useEffect } from 'react';
import Page from '../../shared/layout/Main';
import { toastMessage } from '../../../utils/Toast';
import ChatListScreen from './ChatList.Screen';
import ChatDetailScreen from './ChatListDetail.Screen';

export default function ChatViewScreen(props) {
  const [chatListId, setChatListId] = useState(
    props &&
      props.conversationId &&
      props.conversationId.chatDetails &&
      props.conversationId.chatDetails.conversationId
      ? props.conversationId.chatDetails
      : null
  );

  function handleChatListId(idValue) {
    console.log('daslkhlklk1jk2j3123', idValue);
    setChatListId(idValue);
  }
  function handleChatDetailScreen() {}

  try {
    return (
      <React.Fragment>
        <div className="row" id="chat-page-box" style={{ width: '90%' }}>
          <div className={`col-lg-${props.col ? props.col : '3'} col-md-12`} id="chatlist-style">
            {/* <div>
              <div
                className="card"
                style={{
                  width: '100%',
                  height: '10%',
                  border: 'none',
                  backgroundColor: '#08AB93',
                  borderRight: '1px solid rgba(0,0,0,.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px',
                    height: '100%',
                  }}
                >
                  <div style={{ width: '60px' }}>
                    <img
                      src={require('../../../images/mock-image/default_chef_profile_white.png')}
                      alt="image"
                      style={{ borderRadius: '50%' }}
                    />
                  </div>
                  <span style={{ color: '#fff' }}> Chef Name</span>
                </div>
              </div>
            </div> */}
            <div style={{ padding: '5px', paddingTop: '0px' }}>
              <ChatListScreen handleChatListId={handleChatListId} chatListId={chatListId} />
            </div>
          </div>
          {/* <div class="" style={{ width: '20px' }}></div> */}
          <div
            className="col-lg-9 col-sm-12 col-md-12  products-col-item"
            id="fullchat-view"
            style={{ maxWidth: '74%', marginLeft: '1%' }}
          >
            {/* <div
              className="card"
              style={{
                width: '100%',
                height: '10%',
                border: 'none',
                backgroundColor: '#08AB93',
                borderLeft: '1px solid rgba(0,0,0,.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '18px',
                  height: '100%',
                }}
              >
                <div style={{ width: '60px' }}>
                  <img
                    src={require('../../../images/mock-image/default_chef_profile_white.png')}
                    alt="image"
                    style={{ borderRadius: '50%' }}
                  />
                </div>
                <span style={{ color: '#fff' }}> Client Name</span>
              </div>
            </div> */}
            <div>
              <div style={{ padding: '5px' }}>
                {chatListId !== null ? (
                  <ChatDetailScreen chatListId={chatListId} />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                      color: '#08AB93',
                      fontWeight: 'bolder',
                    }}
                  >
                    Select a Chat List item
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
