webpackHotUpdate("static\\development\\pages\\index.js",{

/***/ "./components/home-page/components/Banner.js":
/*!***************************************************!*\
  !*** ./components/home-page/components/Banner.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @apollo/react-hooks */ "./node_modules/@apollo/react-hooks/lib/react-hooks.esm.js");
/* harmony import */ var react_visibility_sensor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-visibility-sensor */ "./node_modules/react-visibility-sensor/dist/visibility-sensor.js");
/* harmony import */ var react_visibility_sensor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_visibility_sensor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_google_autocomplete__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-google-autocomplete */ "./node_modules/react-google-autocomplete/index.js");
/* harmony import */ var react_google_autocomplete__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_google_autocomplete__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_geolocation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-geolocation */ "./node_modules/react-geolocation/dist/react-geolocation.es.js");
/* harmony import */ var next_config__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/config */ "./node_modules/next-server/dist/lib/runtime-config.js");
/* harmony import */ var next_config__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(next_config__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dynamic */ "./node_modules/next-server/dist/lib/dynamic.js");
/* harmony import */ var next_dynamic__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dynamic__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../config/firebaseConfig */ "./config/firebaseConfig.js");
/* harmony import */ var _const_BannerData__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../const/BannerData */ "./components/home-page/const/BannerData.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var react_accessible_accordion__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-accessible-accordion */ "./node_modules/react-accessible-accordion/dist/umd/index.js");
/* harmony import */ var react_accessible_accordion__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(react_accessible_accordion__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../profile-setup/ProfileSetup.String */ "./components/profile-setup/ProfileSetup.String.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../common/gql */ "./common/gql/index.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _utils_UserType__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../utils/UserType */ "./utils/UserType.js");
/* harmony import */ var _utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../utils/DateTimeFormat */ "./utils/DateTimeFormat.js");
/* harmony import */ var _Navigation__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./Navigation */ "./components/home-page/components/Navigation.js");




var __jsx = react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement;

function _templateObject4() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}















var OwlCarousel = next_dynamic__WEBPACK_IMPORTED_MODULE_11___default()(function () {
  return __webpack_require__.e(/*! import() */ 2).then(__webpack_require__.t.bind(null, /*! react-owl-carousel3 */ "./node_modules/react-owl-carousel3/lib/OwlCarousel.js", 7));
}, {
  loadableGenerated: {
    webpack: function webpack() {
      return [/*require.resolve*/(/*! react-owl-carousel3 */ "./node_modules/react-owl-carousel3/lib/OwlCarousel.js")];
    },
    modules: ['react-owl-carousel3']
  }
});





 // Carousel options

var _getConfig = next_config__WEBPACK_IMPORTED_MODULE_9___default()(),
    publicRuntimeConfig = _getConfig.publicRuntimeConfig;

var MAPAPIKEY = publicRuntimeConfig.MAPAPIKEY;
var options = {
  loop: true,
  nav: true,
  dots: true,
  autoplayHoverPause: true,
  items: 1,
  smartSpeed: 750,
  autoplay: true,
  navText: ["<i class='fas fa-arrow-left'></i>", "<i class='fas fa-arrow-right'></i>"]
}; //customer

var customerDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_19__["query"].customer.profileByIdGQLTAG; //for getting customer data

var GET_CUSTOMER_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_18___default()(_templateObject(), customerDataTag); //chef

var chefDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_19__["query"].chef.profileByIdGQLTAG; //for getting chef data

var GET_CHEF_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_18___default()(_templateObject2(), chefDataTag);
var listChefData = _common_gql__WEBPACK_IMPORTED_MODULE_19__["query"].chef.listAllDetailsGQLTAG;
var GET_CHEF_LIST_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_18___default()(_templateObject3(), listChefData); // update profile data submit for chef

var updateChefProfileSubmit = _common_gql__WEBPACK_IMPORTED_MODULE_19__["mutation"].chef.submitForReviewGQLTAG;
var UPDATE_CHEF_PROFILE_SUBMIT = graphql_tag__WEBPACK_IMPORTED_MODULE_18___default()(_templateObject4(), updateChefProfileSubmit);

var Banner = function Banner(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      userRole = _useState[0],
      setUserRole = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      display = _useState2[0],
      setDisplay = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(true),
      panel = _useState3[0],
      setPanel = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      fullAddress = _useState4[0],
      setFullAddress = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      latitude = _useState5[0],
      setLatitude = _useState5[1];

  var _useState6 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      longtitude = _useState6[0],
      setLongtitude = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      customerIdValue = _useState7[0],
      setCustomerId = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      customerProfileDetails = _useState8[0],
      setCustomerProfileDetails = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      chefIdValue = _useState9[0],
      setChefId = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      removeModal = _useState10[0],
      setRemoveModal = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      ProfileDetails = _useState11[0],
      setProfileDetails = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      chefStatusId = _useState12[0],
      setChefStatusId = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      reason = _useState13[0],
      setReason = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      mobileNumberVerified = _useState14[0],
      setMobileNumberVerified = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      emailVerified = _useState15[0],
      setEmailVerified = _useState15[1];

  var _useState16 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      dateFormat = _useState16[0],
      setDateFormat = _useState16[1];

  var _useState17 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      requestList = _useState17[0],
      setRequestList = _useState17[1];

  var _useState18 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      star = _useState18[0],
      setStar = _useState18[1];

  var _useState19 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      review = _useState19[0],
      setReview = _useState19[1];

  var _useState20 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      earnings = _useState20[0],
      setEarnings = _useState20[1];

  var _useState21 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      reviewList = _useState21[0],
      setReviewList = _useState21[1];

  var _useState22 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      reservationList = _useState22[0],
      setReservationList = _useState22[1];

  var _useState23 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      isRegistrationCompletedYn = _useState23[0],
      setIsRegistrationCompletedYn = _useState23[1];

  var _useLazyQuery = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CUSTOMER_DATA, {
    variables: {
      customerId: customerIdValue
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('renderError', err);
    }
  }),
      _useLazyQuery2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery, 2),
      getCustomerData = _useLazyQuery2[0],
      data = _useLazyQuery2[1].data;

  var _useLazyQuery3 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CHEF_DATA, {
    variables: {
      chefId: chefIdValue
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('renderError', err);
    }
  }),
      _useLazyQuery4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery3, 2),
      getChefDataByProfile = _useLazyQuery4[0],
      chefData = _useLazyQuery4[1];

  var _useLazyQuery5 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CHEF_LIST_DATA, {
    variables: {
      chefId: chefIdValue,
      dateTime: dateFormat
    },
    fetchPolicy: 'network-only' // onError: err => {
    //   toastMessage('renderError', err);
    // },

  }),
      _useLazyQuery6 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery5, 2),
      getChefListByProfile = _useLazyQuery6[0],
      listData = _useLazyQuery6[1];

  var _useMutation = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useMutation"])(UPDATE_CHEF_PROFILE_SUBMIT, {
    onCompleted: function onCompleted(responseForProfileSubmit) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('success', 'Submitted successfully');
      onCloseModal();
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('error', err);
    }
  }),
      _useMutation2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useMutation, 2),
      updateChefProfileSubmitFn = _useMutation2[0],
      responseForProfileSubmit = _useMutation2[1].responseForProfileSubmit;

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    setDisplay(true);
  }, []); //get chef id

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    //get user role
    Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_21__["getUserTypeRole"])().then(
    /*#__PURE__*/
    function () {
      var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(res) {
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                setUserRole(res);

                if (res === _utils_UserType__WEBPACK_IMPORTED_MODULE_21__["customer"]) {
                  //customer user
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_21__["getCustomerId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_21__["customerId"]).then(function (customerResult) {
                    setCustomerId(customerResult);
                  })["catch"](function (err) {});
                } else {
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_21__["getChefId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_21__["chefId"]).then(
                  /*#__PURE__*/
                  function () {
                    var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
                    /*#__PURE__*/
                    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(chefResult) {
                      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return setChefId(chefResult);

                            case 2:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function (_x2) {
                      return _ref2.apply(this, arguments);
                    };
                  }())["catch"](function (err) {});
                }

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (err) {});
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (customerIdValue) {
      getCustomerData();
    }
  }, customerIdValue);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    setDateFormat(moment__WEBPACK_IMPORTED_MODULE_12___default()(new Date()).utc().format('YYYY-MM-DDTHH:mm:ss'));

    if (chefIdValue && dateFormat) {
      getChefListByProfile();
      getChefDataByProfile();
    } // else{
    //   getChefListByProfile();
    // }

  }, chefIdValue); // useEffect(() =>{
  //   getChefListByProfile();
  // },[])

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    // getting customer's details
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](data, 'customerProfileByCustomerId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](data.customerProfileByCustomerId) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](data.customerProfileByCustomerId, 'customerProfileExtendedsByCustomerId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId)) {
      var details = data.customerProfileByCustomerId.customerProfileExtendedsByCustomerId;

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](details, 'nodes') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isArrayEmpty"](details.nodes)) {
        setFullAddress(details.nodes[0].customerLocationAddress ? details.nodes[0].customerLocationAddress : '');
        setLongtitude(details.nodes[0].customerLocationLng ? details.nodes[0].customerLocationLng : '');
        setLatitude(details.nodes[0].customerLocationLat ? details.nodes[0].customerLocationLat : '');
      }
    } else {
      setCustomerProfileDetails([]);
    }
  }, [data]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    // getting chef's details
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](chefData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](chefData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](chefData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](chefData.data.chefProfileByChefId)) {
      setProfileDetails(chefData.data.chefProfileByChefId);
      var details = chefData.data.chefProfileByChefId;
      setIsRegistrationCompletedYn(details.isRegistrationCompletedYn);
      setChefStatusId(details.chefStatusId.trim());
      console.log("details.chefStatusId.trim()", details.chefStatusId.trim());

      var _reason = details.chefRejectOrBlockReason ? details.chefRejectOrBlockReason : '';

      setReason(_reason);
    } else {
      setProfileDetails(null);
    }
  }, [chefData]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    console.log("listData OUT", listData);

    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](listData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](listData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](listData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["hasProperty"](listData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isObjectEmpty"](listData.data.chefProfileByChefId)) {
      console.log("listData if", listData.data.chefProfileByChefId);
      var details = listData.data.chefProfileByChefId;
      var request = details.outstandingRequests;
      var listRequest = details.reviews;
      var reservations = details.futureReservations;

      if (request && request.nodes.length > 0) {
        setRequestList(request.nodes);
      } else {
        setRequestList([]);
      }

      if (details.totalEarnings) {
        setEarnings(details.totalEarnings);
      } else {
        setEarnings(0.000);
      }

      if (details.totalReviewCount) {
        setReview(details.totalReviewCount);
      } else {
        setReview(0);
      }

      if (listRequest && listRequest.nodes.length > 0) {
        setReviewList(listRequest.nodes);
      } else {
        setReviewList([]);
      }

      if (reservations && reservations.nodes.length > 0) {
        setReservationList(reservations.nodes);
      } else {
        setReservationList([]);
      }
    } else {
      console.log("listData else", listData);
      setProfileDetails(null);
      setRequestList([]);
      setEarnings(0);
      setReview(0);
      setReviewList([]);
      setReservationList([]);
    }
  }, [listData]); //Check email and mobile number verified or not

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_13__["firebase"].auth().onAuthStateChanged(function (user) {
      if (user) {
        if (user.phoneNumber) {
          setMobileNumberVerified(true);
        }

        if (user.emailVerified) {
          setEmailVerified(true);
        }
      }
    });
  });

  function getLocation(location) {
    if (props.getLocation) {
      props.getLocation(fullAddress, latitude, longtitude);
    }
  }

  function getCurrentLocation(lat, lon) {
    if (lat && lon) {
      axios__WEBPACK_IMPORTED_MODULE_10___default.a.post("".concat(_profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].GOOGLEAPI).concat(lat, ",").concat(lon).concat(_profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].KEY).concat(MAPAPIKEY)).then(function (locationData) {
        if (locationData && locationData.data && locationData.data.results[0]) {
          setFullAddress(locationData.data.results[0].formatted_address);
          setLatitude(locationData.data.results[0].formatted_address ? lat : '');
          setLongtitude(locationData.data.results[0].formatted_address ? lon : '');
        }
      })["catch"](function (error) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])(renderError, error.message);
      });
    }
  }

  function onClickAlert() {
    console.log('onClickAlert');
  }

  function onClickRequest(data) {
    console.log('onClickRequest');
    var newData = {};
    newData.chefBookingHistId = data.chefBookingHistId;
    Object(_Navigation__WEBPACK_IMPORTED_MODULE_23__["NavigateToBookongDetail"])(newData);
  }

  function onClickReviews() {
    console.log('onClickReviews');
  }

  function onClickStats() {
    console.log('onClickStats');
  }

  function onClickReservations() {
    console.log('onClickReservations');
  }

  function chefBookingTime(data, type) {
    if (type == 'time') {
      var bookingFromTime = Object(_utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__["getTimeOnly"])(Object(_utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__["getLocalTime"])(data.chefBookingFromTime));
      var bookingToTime = Object(_utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__["getTimeOnly"])(Object(_utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__["getLocalTime"])(data.chefBookingToTime));
      return bookingFromTime + ' - ' + bookingToTime;
    } else {
      return Object(_utils_DateTimeFormat__WEBPACK_IMPORTED_MODULE_22__["NotificationconvertDateandTime"])(data.chefBookingFromTime);
    }
  }

  function onClickSubmit() {
    return _onClickSubmit.apply(this, arguments);
  }

  function _onClickSubmit() {
    _onClickSubmit = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3() {
      var variables;
      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(emailVerified === true && mobileNumberVerified === true)) {
                _context3.next = 6;
                break;
              }

              variables = {
                pChefId: chefIdValue
              };
              _context3.next = 4;
              return updateChefProfileSubmitFn({
                variables: variables
              });

            case 4:
              _context3.next = 7;
              break;

            case 6:
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('error', S.VERIFIED_ALERT);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _onClickSubmit.apply(this, arguments);
  }

  function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('renderError', error.message);
    }
  }

  try {
    return __jsx(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, userRole !== 'chef' && display && _const_BannerData__WEBPACK_IMPORTED_MODULE_14__["bannerData"] && _const_BannerData__WEBPACK_IMPORTED_MODULE_14__["bannerData"].map(function (res, index) {
      return __jsx("div", {
        className: "row"
      }, __jsx("div", {
        className: "col-lg-6"
      }, __jsx("div", {
        className: res["class"],
        key: index
      }, __jsx("div", {
        className: "d-table"
      }, __jsx("div", {
        className: "d-table-cell"
      }, __jsx("div", {
        className: "container"
      }, __jsx(react_visibility_sensor__WEBPACK_IMPORTED_MODULE_6___default.a, null, function (_ref3) {
        var isVisible = _ref3.isVisible;
        return __jsx("div", {
          className: "main-banner-content"
        }, __jsx("h1", {
          className: isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
        }, res.title), __jsx("p", {
          className: isVisible ? 'animated fadeInUp opacityOne' : 'opacityZero'
        }, res.description));
      })))))), userRole !== 'chef' && __jsx("div", {
        className: "col-lg-6",
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }
      }, __jsx("div", {
        className: "location-details-model"
      }, __jsx("div", null, __jsx("p", {
        className: "location-text"
      }, "Rockoly - Find Your Chef")), __jsx("div", {
        style: {
          display: 'flex',
          width: '95%'
        }
      }, __jsx("h5", {
        style: {
          color: 'black',
          display: 'flex',
          width: '67%'
        }
      }, __jsx(react_google_autocomplete__WEBPACK_IMPORTED_MODULE_7___default.a, {
        className: "form-control inputView",
        placeholder: "Enter location",
        value: fullAddress,
        onChange: function onChange(event) {
          return setFullAddress(event.target.value);
        },
        onPlaceSelected: function onPlaceSelected(place) {
          setFullAddress(place.formatted_address);
          setLatitude(place.formatted_address ? place.geometry.location.lat() : '');
          setLongtitude(place.formatted_address ? place.geometry.location.lng() : '');
        },
        types: ['address'],
        componentRestrictions: {
          country: 'us'
        }
      })), __jsx(react_geolocation__WEBPACK_IMPORTED_MODULE_8__["default"], {
        render: function render(_ref4) {
          var fetchingPosition = _ref4.fetchingPosition,
              _ref4$position = _ref4.position;
          _ref4$position = _ref4$position === void 0 ? {} : _ref4$position;
          var _ref4$position$coords = _ref4$position.coords;
          _ref4$position$coords = _ref4$position$coords === void 0 ? {} : _ref4$position$coords;
          var latitude = _ref4$position$coords.latitude,
              longitude = _ref4$position$coords.longitude,
              error = _ref4.error,
              getCurrentPosition = _ref4.getCurrentPosition;
          return __jsx("div", {
            className: "locationIconView"
          }, __jsx("i", {
            className: "fas fa-crosshairs",
            id: "current-locaton-view",
            onClick: function onClick() {
              return getCurrentLocation(latitude, longitude);
            }
          }));
        }
      }), __jsx("button", {
        className: "btn btn-primary",
        id: "home-search-button",
        onClick: function onClick() {
          return getLocation(event);
        },
        style: {
          height: '42px',
          marginLeft: '20px',
          marginTop: '2px'
        }
      }, "Search")))));
    }), userRole === 'chef' && display && _const_BannerData__WEBPACK_IMPORTED_MODULE_14__["bannerData"] && _const_BannerData__WEBPACK_IMPORTED_MODULE_14__["bannerData"].map(function (res, index) {
      return __jsx("div", null, __jsx("div", {
        "class": "row"
      }, __jsx("div", {
        "class": "col-lg-5 overview",
        onClick: function onClick() {
          return onClickAlert();
        }
      }, __jsx("h4", null, "Alerts"), __jsx("div", null, chefStatusId === 'PENDING' && __jsx("div", null, __jsx("div", {
        className: "statusMsg"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].PROFILE_STATUS, __jsx("div", {
        className: "response-view",
        style: {
          paddingLeft: 5
        }
      }, ' ', ' ' + _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].REVIEW_PENDING)), __jsx("div", {
        className: "statusMsg",
        id: "failed"
      }, __jsx("div", {
        className: "response-view"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].REVIEW_PENDING_MSG)), isRegistrationCompletedYn === true && __jsx("div", {
        className: "basicInfoSubmit"
      }, __jsx("button", {
        type: "submit",
        onClick: function onClick() {
          return setRemoveModal(true);
        },
        className: "btn btn-primary"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].SUBMIT))), chefStatusId === 'REJECTED' && __jsx("div", null, __jsx("div", {
        className: "statusMsg"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].PROFILE_STATUS, __jsx("div", {
        className: "response-view",
        style: {
          paddingLeft: 5
        }
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].REVIEW_REJECTED)), isRegistrationCompletedYn === true && __jsx("div", {
        className: "basicInfoSubmit"
      }, __jsx("button", {
        type: "submit",
        onClick: function onClick() {
          return setRemoveModal(true);
        },
        className: "btn btn-primary"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].SUBMIT))), chefStatusId === 'SUBMITTED_FOR_REVIEW' && __jsx("div", null, __jsx("div", {
        className: "statusMsg"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].PROFILE_STATUS, __jsx("div", {
        className: "response-view",
        style: {
          paddingLeft: 5
        }
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].SUBMIT_FOR_REVIEW))), chefStatusId === 'APPROVED' && __jsx("div", null, __jsx("div", {
        className: "statusMsg"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].PROFILE_STATUS, __jsx("div", {
        className: "response-view"
      }, _profile_setup_ProfileSetup_String__WEBPACK_IMPORTED_MODULE_17__["default"].PROFILE_VERIFIED))), _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_20__["isStringEmpty"](reason) && __jsx("div", {
        className: "statusMsg"
      }, "REASON :", __jsx("div", {
        className: "response-view"
      }, reason))), emailVerified === true && // <span class="fas fa-check tickIcon" ></span>
      __jsx("div", {
        "class": "verificationSuccess"
      }, "Email has been Verified "), emailVerified === false && __jsx("div", {
        "class": "verification"
      }, "You didn't verify your Email"), mobileNumberVerified === true && __jsx("div", {
        "class": "verificationSuccess"
      }, "Mobile number has been Verified"), mobileNumberVerified === false && __jsx("div", {
        "class": "verification"
      }, "You didn't verify your Mobile number") // <span class="fas fa-times crossIcon" ></span>
      ), __jsx("div", {
        "class": "col-lg-6 overview scroll"
      }, __jsx("h4", null, "Request"), requestList.length > 0 && requestList.map(function (request) {
        return __jsx("div", {
          className: "request row",
          id: "chef-home-request"
        }, __jsx("div", {
          className: "col-lg-3",
          style: {
            display: 'flex',
            flexDirection: 'column'
          }
        }, __jsx("img", {
          className: "profile-pic",
          src: request.customerProfileByCustomerId.customerPicId
        }), __jsx("p", {
          className: "request-name"
        }, request.customerProfileByCustomerId.fullName)), __jsx("div", {
          className: "col-lg-5",
          style: {
            textAlign: 'center'
          }
        }, __jsx("p", {
          className: "request-name "
        }, "Booking Time:", chefBookingTime(request, 'time')), __jsx("p", {
          "class": "request-name"
        }, "Date:", chefBookingTime(request, 'date'))), __jsx("button", {
          className: "btn btn-primary button",
          onClick: function onClick() {
            return onClickRequest(request);
          }
        }, "View"));
      }), requestList.length == 0 && __jsx("h4", null, "No past request"))), __jsx("div", {
        "class": "row"
      }, __jsx("div", {
        "class": "col-lg-5 overview scroll"
      }, __jsx("h4", null, "Reviews"), reviewList.length > 0 && reviewList.map(function (review) {
        return __jsx("div", {
          "class": "request row",
          id: "chef-home-request"
        }, __jsx("div", {
          className: "col-lg-3",
          style: {
            display: 'flex',
            flexDirection: 'column'
          }
        }, __jsx("img", {
          "class": "profile-pic",
          src: review.customerProfileByCustomerId.customerPicId
        }), __jsx("p", {
          "class": "request-name"
        }, review.customerProfileByCustomerId.fullName)), __jsx("div", {
          className: "col-lg-5",
          style: {
            textAlign: 'center'
          }
        }, __jsx("p", {
          "class": "request-name"
        }, "Booking Time:", chefBookingTime(review, 'time')), __jsx("p", {
          "class": "request-name"
        }, "Date:", chefBookingTime(review, 'date'))), __jsx("button", {
          "class": "btn btn-primary button",
          onClick: function onClick() {
            return onClickRequest(review);
          }
        }, "View"));
      }), reviewList.length == 0 && __jsx("h4", null, "No pending reviews")), __jsx("div", {
        "class": "col-lg-6 overview"
      }, __jsx("h4", null, "Stats"), __jsx("h5", null, "Earnings : $ ", earnings ? earnings.toFixed(2) : '0'), __jsx("h5", null, "Review Counts : ", review))), __jsx("div", {
        "class": "row"
      }, __jsx("div", {
        "class": "col-lg-5 overview scroll"
      }, __jsx("h4", null, "Reservations"), reservationList.length > 0 && reservationList.map(function (reservation) {
        return __jsx("div", {
          "class": "request row",
          id: "chef-home-request"
        }, __jsx("div", {
          className: "col-lg-3",
          style: {
            display: 'flex',
            flexDirection: 'column'
          }
        }, __jsx("img", {
          "class": "profile-pic",
          src: reservation.customerProfileByCustomerId.customerPicId
        }), __jsx("p", {
          "class": "request-name"
        }, reservation.customerProfileByCustomerId.fullName)), __jsx("div", {
          className: "col-lg-5"
        }, __jsx("p", {
          "class": "request-name"
        }, "Booking Time:", chefBookingTime(reservation, 'time')), __jsx("p", {
          "class": "request-name"
        }, "Date:", chefBookingTime(reservation, 'date'))), __jsx("button", {
          "class": "btn btn-primary button",
          onClick: function onClick() {
            return onClickRequest(reservation);
          }
        }, "View"));
      }), reservationList.length == 0 && __jsx("h4", null, "No reservations yet"))), removeModal === true && __jsx("div", {
        className: "bts-popup ".concat(open ? 'is-visible' : ''),
        role: "alert"
      }, __jsx("div", {
        className: "bts-popup-container"
      }, __jsx("h6", null, "Ready to submit your profile for review ?"), __jsx("p", null, "You will be notified of your registration status within 48 hours."), __jsx("button", {
        type: "submit",
        className: "btn btn-success",
        onClick: function onClick() {
          return onCloseModal();
        }
      }, "Cancel"), ' ', __jsx("button", {
        type: "button",
        className: "btn btn-danger",
        onClick: function onClick() {
          return onClickSubmit();
        }
      }, "Ok"))));
    }));
  } catch (error) {
    Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_15__["toastMessage"])('renderError', error.message);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Banner);

/***/ })

})
//# sourceMappingURL=index.js.9b913ea66ebd947da422.hot-update.js.map