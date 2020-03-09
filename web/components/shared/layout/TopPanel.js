import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AppContext } from '../../../context/appContext';
import * as util from '../../../utils/checkEmptycondition';
import n from '../../../components/routings/routings';
import S from './Strings';
const OwlCarousel = dynamic(import('react-owl-carousel3'));

const options = {
  loop: true,
  nav: false,
  dots: false,
  autoplayHoverPause: true,
  autoplay: true,
  animateOut: 'slideOutDown',
  animateIn: 'flipInX',
  items: 1,
  navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
};

const TopPanel = () => {
  // Declare a new state variable
  const [state, setState] = useContext(AppContext);
  const [panel, setPanel] = useState(true);
  const [chefStatusId, setChefStatusId] = useState('');
  const [status, setStatus] = useState('');

  //set userdata
  useEffect(() => {
    if (
      util.isObjectEmpty(state) &&
      util.hasProperty(state, 'chefProfile') &&
      util.isObjectEmpty(state.chefProfile) &&
      util.hasProperty(state.chefProfile, 'isDetailsFilledYn') &&
      util.isStringEmpty(state.chefProfile.isDetailsFilledYn)
    ) {
      let data = JSON.parse(state.chefProfile.isDetailsFilledYn);
      setChefStatusId(state.chefProfile.chefStatusId.trim());
      if (data.isFilledYn === false) {
        setStatus(S.FOR_UPDATE_PROFILE);
      } else if (data.isFilledYn === true && state.chefProfile.chefStatusId.trim() === S.PENDING) {
        setStatus(S.FOR_SUBMIT_PROFILE);
      } else if (data.isFilledYn === true && state.chefProfile.chefStatusId.trim() === S.REJECTED) {
        setStatus(S.FOR_REJECTED_PROFILE);
      } else if (
        data.isFilledYn === true &&
        state.chefProfile.chefStatusId.trim() === S.SUBMITTED_FOR_REVIEW
      ) {
        setStatus(S.AFTER_SUBMIT);
      }
    }
  }, [state]);

  return (
    <div>
      {(chefStatusId === S.PENDING ||
        chefStatusId === S.SUBMITTED_FOR_REVIEW ||
        chefStatusId === S.REJECTED) && (
        <div className={`top-panel ${panel ? '' : 'hide'}`}>
          <div className="container">
            <div className="panel-content">
              <OwlCarousel className="top-panel-slides owl-carousel owl-theme" {...options}>
                <div className="single-item-box">
                  <p>
                    {status}
                    <Link href={n.PROFILE}>
                      <a>{S.READ_MORE}</a>
                    </Link>
                  </p>
                </div>
              </OwlCarousel>

              <i onClick={() => setPanel(false)} className="fas fa-times panel-close-btn"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPanel;
