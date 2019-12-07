import { Component } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { listOptions } from '../const/FaqList';
import Strings from '../Faq.String';
import { toastMessage } from '../../../utils/Toast';

class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqs: listOptions,
    };
  }
  render() {
    try {
      let { faqs } = this.state;
      return (
        <section className="faq-area ptb-60">
          <div className="container">
            <div className="section-title">
              <h2>
                <span className="dot"></span> {Strings.FREQUENTLY_ASKED_QUESTIONS}
              </h2>
            </div>

            <div className="faq-accordion">
              <ul className="accordion">
                <Accordion>
                  {faqs.length > 0 ? (
                    faqs.map((data, key) => {
                      return (
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>{data.question}</AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <p>{data.answer}</p>
                          </AccordionItemPanel>
                        </AccordionItem>
                      );
                    })
                  ) : (
                    <div>{Strings.NO_FAQ}</div>
                  )}
                </Accordion>
              </ul>
            </div>
          </div>
        </section>
      );
    } catch (error) {
      const errorMessage = error.message;
      toastMessage('renderError', errorMessage);
    }
  }
}

export default Faq;
