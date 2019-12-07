import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import dynamic from 'next/dynamic';
import { toastMessage, success, renderError, error } from '../../../utils/Toast';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { withApollo } from '../../../apollo/apollo';
import { AppContext } from '../../../context/appContext';
import { NavigateToHome } from './Navigation';
import Slider from 'react-slick';

const OwlCarousel = dynamic(import('react-owl-carousel3'));
const options = {
  loop: false,
  nav: false,
  dots: true,
  autoplayHoverPause: false,
  items: 1,
  autoplay: false,
  navText: ["<i class='fas fa-chevron-left'></i>", "<i class='fas fa-chevron-right'></i>"],
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const introData = gqlTag.query.master.questionsByAreaTypeGQLTAG;

const saveQuestion = gqlTag.mutation.chef.saveIntroTourGQLTAG;

const changeFlag = gqlTag.mutation.chef.updateDetailsGQLTag;

const GET_INTRO_DATA = gql`
  ${introData}
`;

const SET_QUESTION_DATA = gql`
  ${saveQuestion}
`;

const CHANGE_FLAG = gql`
  ${changeFlag}
`;

const IntroPageCarousel = props => {
  const [display, setDisplay] = useState('true');
  const [panel, setPanel] = useState('true');
  const [state, setState] = useContext(AppContext);
  const [quesIntroData, setQuesIntroData] = useState(null);
  const [question1, setQuestion1] = useState(null);
  const [question2, setQuestion2] = useState(null);
  const [question3, setQuestion3] = useState(null);
  const [question4, setQuestion4] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  //Get commission value query
  const introData = useQuery(GET_INTRO_DATA, {
    variables: {
      areaType: 'CHEF_REGISTER',
    },
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [setQuestion, { setData }] = useMutation(SET_QUESTION_DATA, {
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  const [changeFlag, { changeFlagData }] = useMutation(CHANGE_FLAG, {
    onCompleted: changeFlagData => {
      toastMessage(success, 'Completd');
      NavigateToHome();
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });

  //when saving data
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (question1 && question2 && question3 && question4) {
        let variables = {
          chefProfileExtendedId:
            state.chefProfile.chefProfileExtendedsByChefId.nodes[0].chefProfileExtendedId,
          isIntroSlidesSeenYn: true,
        };
        changeFlag({
          variables,
        });
      } else {
        toastMessage(renderError, 'fill all fields');
      }
    } catch (error) {
      toastMessage(renderError, error);
    }
  }

  function submitAnswers(questionId, answerId, value) {
    try {
      if (value === 1) {
        setQuestion1(questionId);
      } else if (value === 2) {
        setQuestion2(questionId);
      } else if (value === 3) {
        setQuestion3(questionId);
      } else if (value === 4) {
        setQuestion4(questionId);
      }
      let variables = {
        questionId: questionId,
        questionOptionId: answerId,
        chefId: state.chefId,
      };
      setQuestion({
        variables,
      });
    } catch (error) {
      // toastMessage(renderError, error);
    }
  }

  function nextClick() {
    try {
      setShowForm(true);
    } catch (error) {
      toastMessage(renderError, error);
    }
  }

  //Get commission value
  useEffect(() => {
    let val = loadCount;
    setQuesIntroData(introData);
  }, [introData]);

  function formData() {
    let valarray = quesIntroData.data.allQuestionMasters.nodes;
    return (
      <div className="intro_from_container">
        <div className="container">
          <div className="row">
            <form onSubmit={handleSubmit}>
              <label>{valarray[4].questionDesc}</label>
              <div
                className="form-selection-view"
                style={{ display: 'flex', marginBottom: '15px' }}
              >
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group1"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[4].questionId,
                        valarray[4].questionOptionMastersByQuestionId.nodes[0].questionOptionId,
                        1
                      )
                    }
                  />
                  {valarray[4].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group1"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[4].questionId,
                        valarray[4].questionOptionMastersByQuestionId.nodes[1].questionOptionId,
                        1
                      )
                    }
                  />
                  {valarray[4].questionOptionMastersByQuestionId.nodes[2].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group1"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[4].questionId,
                        valarray[4].questionOptionMastersByQuestionId.nodes[2].questionOptionId,
                        1
                      )
                    }
                  />
                  {valarray[4].questionOptionMastersByQuestionId.nodes[2].questionOptionDesc}
                </div>
              </div>
              <label>{valarray[5].questionDesc}</label>
              <div
                className="form-selection-view"
                style={{ display: 'flex', marginBottom: '15px' }}
              >
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group2"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[5].questionId,
                        valarray[5].questionOptionMastersByQuestionId.nodes[0].questionOptionId,
                        2
                      )
                    }
                  />
                  {valarray[5].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group2"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[5].questionId,
                        valarray[5].questionOptionMastersByQuestionId.nodes[1].questionOptionId,
                        2
                      )
                    }
                  />
                  {valarray[5].questionOptionMastersByQuestionId.nodes[1].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group2"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[5].questionId,
                        valarray[5].questionOptionMastersByQuestionId.nodes[2].questionOptionId,
                        2
                      )
                    }
                  />
                  {valarray[5].questionOptionMastersByQuestionId.nodes[2].questionOptionDesc}
                </div>
              </div>
              <label>{valarray[6].questionDesc}</label>
              <div
                className="form-selection-view"
                style={{ display: 'flex', marginBottom: '15px' }}
              >
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group3"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[6].questionId,
                        valarray[6].questionOptionMastersByQuestionId.nodes[0].questionOptionId,
                        3
                      )
                    }
                  />
                  {valarray[6].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group3"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[6].questionId,
                        valarray[6].questionOptionMastersByQuestionId.nodes[1].questionOptionId,
                        3
                      )
                    }
                  />
                  {valarray[6].questionOptionMastersByQuestionId.nodes[1].questionOptionDesc}
                </div>
              </div>
              <label>{valarray[7].questionDesc}</label>
              <div
                className="form-selection-view"
                style={{ display: 'flex', marginBottom: '15px' }}
              >
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group4"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[7].questionId,
                        valarray[7].questionOptionMastersByQuestionId.nodes[0].questionOptionId,
                        4
                      )
                    }
                  />
                  {valarray[7].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                </div>
                <div style={{ marginLeft: '15px' }}>
                  <input
                    type="radio"
                    name="radio-group4"
                    className="form-radio-select"
                    onClick={() =>
                      submitAnswers(
                        valarray[7].questionId,
                        valarray[7].questionOptionMastersByQuestionId.nodes[1].questionOptionId,
                        4
                      )
                    }
                  />
                  {valarray[7].questionOptionMastersByQuestionId.nodes[1].questionOptionDesc}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
                <button type="submit" className="btn btn-primary" id="saveButton">
                  {'SUBMIT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  function carousal() {
    if (quesIntroData) {
      let questionArray = [];
      if (
        quesIntroData &&
        quesIntroData.data &&
        quesIntroData.data.allQuestionMasters &&
        quesIntroData.data.allQuestionMasters.nodes.length !== 0
      ) {
        let valarray = quesIntroData.data.allQuestionMasters.nodes;
        return (
          <div className="intro_container col-12">
            <Slider {...settings} className="sliderview">
              {/* <div> */}
              <div className="content-class col-10">
                <p className="content-title">{valarray[0].questionDesc}</p>
                <div className="client-info">
                  <span className="content-desc">
                    {valarray[0].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                  </span>
                </div>
              </div>
              <div className="content-class col-10">
                <p className="content-title">{valarray[1].questionDesc}</p>
                <div className="client-info">
                  <span className="content-desc">
                    {valarray[1].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                  </span>
                </div>
              </div>
              <div className="content-class col-10">
                <p className="content-title">{valarray[2].questionDesc}</p>
                <div className="client-info">
                  <span className="content-desc">
                    {valarray[2].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                  </span>
                </div>
              </div>
              <div className="content-class col-10">
                <p className="content-title">{valarray[3].questionDesc}</p>
                <div className="client-info">
                  <span className="content-desc">
                    {valarray[3].questionOptionMastersByQuestionId.nodes[0].questionOptionDesc}
                  </span>
                </div>
              </div>
              <div className="content-class col-10">{formData()}</div>
              {/* </div> */}
            </Slider>
          </div>
        );
      }
    } else {
      return <text>Intro</text>;
    }
  }

  try {
    return (
      <div>
        <div>{quesIntroData && carousal()}</div>
        {/* {showForm === true && formData()} */}
      </div>
    );
  } catch (error) {
    toastMessage('renderError', error.message);
  }
};

export default withApollo(IntroPageCarousel);
