import React from 'react';
import Feedbacks from './components/Feedback';
import Page from '../shared/layout/Main';
import { toastMessage } from '../../utils/Toast';

export default function Feedback(props) {
  try {
    return (
      <React.Fragment>
        <Page>
          <div className="feedback">
            <section className="cart-area ptb-60">
              <div className="cart-totals">
                <Feedbacks bookinHistoryId={props.bookinHistoryId} />
              </div>
            </section>
          </div>
        </Page>
      </React.Fragment>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
}
