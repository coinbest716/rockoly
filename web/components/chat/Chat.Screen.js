import React, { useState, useEffect } from 'react';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';
import ChatViewScreen from './components/ChatView.Screen';

export default function ChatScreen(props) {
  try {
    return (
      <React.Fragment>
        <Page>
          <div id="chat-fullscreen-view">
            <section className="products-details-area " style={{ paddingTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2%' }}>
                <ChatViewScreen conversationId={props} />
              </div>
            </section>
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
}
