import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useSubscription } from '@apollo/react-hooks';
import Link from 'next/link';
import gql from 'graphql-tag';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import ModernDatepicker from 'react-modern-datepicker';
import S from '../../ProfileSetup.String';
import { toastMessage, success, renderError, error } from '../../../../utils/Toast';
import Loader from '../../../Common/loader';
import * as util from '../../../../utils/checkEmptycondition';
import {
  getDateFormat,
  fromDate,
  futureMonth,
  futureMonthReversed,
  fromDateReversed,
} from '../../../../utils/DateTimeFormat';
import * as gqlTag from '../../../../common/gql';
import { withApollo } from '../../../../apollo/apollo';
import { getUserTypeRole, getChefId, chef } from '../../../../utils/UserType';

// const getChefData = gqlTag.query.availability.listChefAvailabilityByDateRangeGQLTAG; //get chef availaibity data
const getChefData = gqlTag.query.availability.listChefNotAvailabilityGQLTAG;
const updateChefData = gqlTag.mutation.chef.updateNotAvailabilityGQLTAG; //update chef availability
//get chef availaibity data
const GET_CHEF_AVAILABILITY = gql`
  ${getChefData}
`;

//update chef availability
const UPDATE_CHEF_AVAILABILITY = gql`
  ${updateChefData}
`;

const unAvailabilitySubs = gqlTag.subscription.chef.notAvailabilityGQLTAG;
const UNAVAILABILITY_SUBSCRIPTION = gql`
  ${unAvailabilitySubs}
`;
const UnAvailabiltyModal = props => {
  // Declare a new state variable
  const [chefAvailabilityList, setChefAvailabilityList] = useState([]);
  const [chefIdValue, setChefIdValue] = useState(
    util.isStringEmpty(props.currentChefIdValue) ? props.currentChefIdValue : null
  );
  const [currentMonthStartDate, setCurrentMonthStartDate] = useState(props.chefId);
  const [currentMonthEndDate, setCurrentMonthEndDate] = useState(props.chefId);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(true);
  const [selectedAll, setSelectedAll] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [addedDate, setAddedDate] = useState('');
  const [deleteItem, setDeleteItem] = useState('');
  //getting chef availaibity data
  const [getChefAvailabilityData, { data, loading }] = useLazyQuery(GET_CHEF_AVAILABILITY, {
    variables: {
      chefId: chefIdValue,
      fromDate: fromDateReversed(),
      toDate: futureMonthReversed(),
      offset: 0,
      first: 100,
    },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  //update chef availability
  const [updateChefAvailability] = useMutation(UPDATE_CHEF_AVAILABILITY, {
    onCompleted: data => {
      setAddedDate('');
      toastMessage(success, S.UPDATE_MSG);
    },
    onError: err => {
      toastMessage(renderError, err.message);
    },
  });
  const { chefUnAvailabilitySubs } = useSubscription(UNAVAILABILITY_SUBSCRIPTION, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefNotAvailabilityProfile) {
        getChefAvailabilityData();
      }
    },
  });

  //requery to get chef availability based on date ,when calendar month start/end date changed
  useEffect(() => {
    getChefAvailabilityData();
  }, [currentMonthStartDate, currentMonthEndDate]);

  useEffect(() => {
    //get user role
    getUserTypeRole()
      .then(async res => {
        if (res === chef) {
          getChefId(chefId)
            .then(chefResult => {
              setChefId(chefResult);
              getChefAvailabilityData();
            })
            .catch(err => {});
        }
      })
      .catch(err => {});
  }, []);

  //set chef data after getting from backend
  useEffect(() => {
    if (
      util.isObjectEmpty(data) &&
      util.isObjectEmpty(data.allChefNotAvailabilityProfiles) &&
      util.isArrayEmpty(data.allChefNotAvailabilityProfiles.nodes)
    ) {
      let chefData = [];
      let details = data.allChefNotAvailabilityProfiles.nodes;
      let dowCount = 0;
      //pushed data based on calendar objects
      details.map((res, index) => {
        if (util.isObjectEmpty(res) && util.isStringEmpty(res.chefNotAvailDate)) {
          let data = {
            title: res.chefNotAvailDate,
            dow: dowCount++,
            checkedValue: false,
            id: res.chefNotAvailId,
          };
          chefData.push(data);
        }
      });
      setChefAvailabilityList(chefData);
    }
  }, [data]);

  // console.log('chefAvailabilityList', chefAvailabilityList);

  //when calendar month view changed
  // function updateTimes(date, view) {
  //   try {
  //     let start = moment(date).startOf(view);
  //     let end = moment(date).endOf(view);
  //     setCurrentMonthStartDate(getDateFormat(start));
  //     setCurrentMonthEndDate(getDateFormat(end));
  //   } catch (error) {
  //     toastMessage(renderError, error.message);
  //   }
  // }

   function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      toastMessage('renderError', error.message);
    }
  }

  //loader
  function renderLoader() {
    if (loader && loader === true && loading === true) {
      return (
        <div>
          <Loader />
        </div>
      );
    }
  }

  //when closing modal
  function closeModal() {
    if (props.onCloseCalendar) {
      props.onCloseCalendar();
      setOpen(false);
    }
  }

  //when selecting / unselecting days
  function onChangeDays(value, indexValue) {
    try {
      let data = cloneDeep(chefAvailabilityList);
      data[indexValue].checkedValue = value.target.checked;
      setChefAvailabilityList(data);
    } catch (error) {
      toastMessage(renderError, error.message);
    }
  }

  //Delete date
  function deleteSingleDate(data) {
    console.log('data', data);
    setChefAvailabilityList(_.pull(chefAvailabilityList, data));
    deleteDate(data);
  }

  //select all
  function selectAll() {
    setSelectedAll(!selectedAll);
    let data = chefAvailabilityList.map(res => {
      res.checkedValue = !selectedAll;
      return res;
    });
    setChefAvailabilityList(data);
  }

  //Delete selected items
  function deleteItems() {
    let data = cloneDeep(chefAvailabilityList);
    let dateValue = [];
    data.map(res => {
      if (res.checkedValue === true) {
        deleteSingleDate(res);
      } else {
        dateValue.push(res);
      }
    });
    setChefAvailabilityList(dateValue);
  }

  //Gql function for delete
  function deleteDate(value) {
    if (util.isObjectEmpty(value)) {
      //update chef availity
      updateChefAvailability({
        variables: {
          pChefId: chefIdValue,
          pChefNotAvailId: value.id,
          pDate: value.title,
          pFromTime: '00:00:00',
          pToTime: '23:59:59',
          pNotes: null,
          pFrequency: null,
          pType: 'DELETE',
        },
      });
      setRemoveModal(false)
    } else {
      toastMessage(error, 'Please select delete items');
    }
  }

  //Gql function for delete
  function addDate() {
    if (util.isStringEmpty(addedDate)) {
      let data = cloneDeep(chefAvailabilityList);
      let details = {
        title: addedDate,
        dow: chefAvailabilityList.length,
        checkedValue: false,
      };
      data.push(details);
      setChefAvailabilityList(data);
      //update chef availity
      updateChefAvailability({
        variables: {
          pChefId: chefIdValue,
          pDate: addedDate,
          pFromTime: '00:00:00',
          pToTime: '23:59:59',
          pNotes: null,
          pFrequency: null,
          pType: 'ADD',
        },
      });
    } else {
      toastMessage(error, 'Please fill the date');
    }
  }

  function handleDelete(res) {
    setRemoveModal(true)
    setDeleteItem(res);
  }

  console.log('addedDate', addedDate);

  return (
    <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
      <div className="bts-popup-container" id="unavailablity-modal-view">
        {renderLoader()}
        <div className="login-content">
          <div className="section-title">
            <h2>{S.SET_UNAVAIALABILITY}</h2>
            <p>Please add your unavailable days here</p>
          </div>

          <div className="form-group">
            <label className="label" id="labelId">
              {S.ADD_UNAVAILABLE_DATE}
            </label>
            <div className="row" id="set-availablity-row">
              <div>
                <ModernDatepicker
                  className="calanderStyle"
                  date={addedDate}
                  format={'MM-DD-YYYY'}
                  showBorder
                  required
                  minDate={fromDate()}
                  maxDate={futureMonth()}
                  onChange={event => setAddedDate(event)}
                  placeholder={S.ADD_UNAVAILABLE_DATE}
                  color={'#d9b44a'}
                />
              </div>
              <div>
                <button
                  type="button"
                  id="addButton"
                  class="btn btn-primary btn-sm"
                  onClick={() => addDate()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          {renderLoader()}
          <label className="label" id="labelId">
            {S.REMOVE_DATE}
          </label>
          {/* <div className="row" id="selectOption">
            <Link href="#" className="login-form">
              <a class="selectDetails" onClick={() => selectAll()}>
                {selectedAll ? 'DeselectAll' : 'Select All'}
              </a>
            </Link>{' '}
            <Link href="#">
              <a class="selectDetails" onClick={() => deleteItems()}>
                Delete selected items
              </a>
            </Link>
          </div> */}
          <div className="container" id="unAvailabilityRow">
            {chefAvailabilityList &&
              chefAvailabilityList.map((res, index) => {
                console.log('res', res);
                let value = res && res.title ? moment(res.title).format('MM-DD-YYYY') : null;
                return (
                  <div className="row" id="availabilityRow">
                    <div className="col-sm-8">
                      <div className="buy-checkbox-btn" id="checkBoxView">
                        <div className="item">
                          {/* <input
                            className="inp-cbx"
                            id={res.dow}
                            type="checkbox"
                            checked={
                              util.isBooleanEmpty(res.checkedValue) ? res.checkedValue : false
                            }
                            onChange={value => onChangeDays(value, index)}
                          /> */}
                          {/* <label className="cbx" htmlFor={res.dow}> */}
                          {/* <span id="checkboxStyle">
                              <svg width="12px" height="10px" viewBox="0 0 12 10">
                                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                              </svg>
                            </span> */}
                          <span>{value}</span>
                          {/* </label> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <Link href="#">
                        <a onClick={() => handleDelete(res)}>
                          <i className="far fa-trash-alt" color="red"></i>
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
          <Link href="#">
            <a onClick={closeModal} className="bts-popup-close"></a>
          </Link>
        </div>
      </div>
      {removeModal === true && (
          <div className={`bts-popup ${open ? 'is-visible' : ''}`} role="alert">
            <div className="bts-popup-container">
              <h6>Are you sure you want to delete this date ?</h6>
              <button type="submit" className="btn btn-success" onClick={() => onCloseModal()}>
                Cancel
              </button>{' '}
              <button type="button" className="btn btn-danger" onClick={() => deleteSingleDate(deleteItem)}>
                Ok
              </button>
              <Link href="#">
                <a onClick={() => onCloseModal()} className="bts-popup-close"></a>
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};
export default withApollo(UnAvailabiltyModal);
