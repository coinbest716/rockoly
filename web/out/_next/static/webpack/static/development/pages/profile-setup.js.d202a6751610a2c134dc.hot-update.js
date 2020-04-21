webpackHotUpdate("static\\development\\pages\\profile-setup.js",{

/***/ "./components/shared/chef-profile/pricing-page/CalculatePrice.js":
/*!***********************************************************************!*\
  !*** ./components/shared/chef-profile/pricing-page/CalculatePrice.js ***!
  \***********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/parse-int */ "./node_modules/@babel/runtime-corejs2/core-js/parse-int.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_float__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/parse-float */ "./node_modules/@babel/runtime-corejs2/core-js/parse-float.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_float__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_parse_float__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @apollo/react-hooks */ "./node_modules/@apollo/react-hooks/lib/react-hooks.esm.js");
/* harmony import */ var react_responsive_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-responsive-modal */ "./node_modules/react-responsive-modal/lib/index.es.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../common/gql */ "./common/gql/index.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _utils_priceCalculator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/priceCalculator */ "./utils/priceCalculator.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_12__);




var __jsx = react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement;

function _templateObject5() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

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









 //chef

var chefDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_8__["query"].chef.profileByIdGQLTAG; //for getting chef data

var GET_CHEF_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject(), chefDataTag);
var editBooking = _common_gql__WEBPACK_IMPORTED_MODULE_8__["mutation"].booking.createRequestGQLTAG; //for insert dish

var EDIT_BOOKING = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject2(), editBooking);
var createBooking = _common_gql__WEBPACK_IMPORTED_MODULE_8__["mutation"].booking.createGQLTAG; //for insert dish

var CREATE_BOOKING = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject3(), createBooking); //Get commission value

var commissionValue = _common_gql__WEBPACK_IMPORTED_MODULE_8__["query"].setting.getSettingValueGQLTAG;
var COMMISSION_VALUE = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject4(), commissionValue); //Get dishes

var dishDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_8__["query"].master.dishByChefIdGQLTAG; //for getting dish data

var GET_DISHES_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject5(), dishDataTag);

var CalculatePrice = function CalculatePrice(props) {
  var sampleArray = [];
  var dishesRef = Object(react__WEBPACK_IMPORTED_MODULE_4__["useRef"])();

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(true),
      Isopen = _useState[0],
      setIsOpen = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      ProfileDetails = _useState2[0],
      setProfileDetails = _useState2[1]; // const [range, setRange] = useState(null);


  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(1),
      rangeMinValue = _useState3[0],
      setRangeMinValue = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      range = _useState4[0],
      setRange = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(1),
      PriceRange = _useState5[0],
      setPrcieRange = _useState5[1];

  var _useState6 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      additionalServices = _useState6[0],
      setAdditionalServices = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      bookingData = _useState7[0],
      setBookingData = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      chefRate = _useState8[0],
      setChefRate = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      savedService = _useState9[0],
      setSavedService = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      availableService = _useState10[0],
      setAvailableService = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      valuePrice = _useState11[0],
      setValuePrice = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      complexityValue = _useState12[0],
      setComplexity = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0),
      additionalServicePrice = _useState13[0],
      setAdditionalServicePrice = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple1 = _useState14[0],
      setmultiple1 = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple2 = _useState15[0],
      setmultiple2 = _useState15[1];

  var _useState16 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple3 = _useState16[0],
      setmultiple3 = _useState16[1];

  var _useState17 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedRange = _useState17[0],
      setSavedRange = _useState17[1];

  var _useState18 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedComplexity = _useState18[0],
      setSavedComplexity = _useState18[1];

  var _useState19 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedPrice = _useState19[0],
      setSavedPrice = _useState19[1];

  var _useState20 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedCommision = _useState20[0],
      setSavedCommision = _useState20[1];

  var _useState21 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedStore = _useState21[0],
      setSavedStore = _useState21[1];

  var _useState22 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])('1%'),
      servicePercentage = _useState22[0],
      setServicePercentage = _useState22[1];

  var _useState23 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0),
      commissionAmount = _useState23[0],
      setCommissionAmount = _useState23[1];

  var _useState24 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      serviceAmount = _useState24[0],
      setServiceAmount = _useState24[1]; // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING


  var getDishesData = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useQuery"])(GET_DISHES_DATA, {
    // getting image gallery based on chef id
    variables: {
      pChefId: props.chefId ? props.chefId : ''
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_11__["toastMessage"])('renderError', err);
    }
  }); //get dishes data

  var _useLazyQuery = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CHEF_DATA, {
    variables: {
      chefId: props.chefId
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {}
  }),
      _useLazyQuery2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery, 2),
      getChefDataByProfile = _useLazyQuery2[0],
      chefData = _useLazyQuery2[1]; //Get commission value query


  var commissionData = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useQuery"])(COMMISSION_VALUE, {
    variables: {
      pSettingName: 'BOOKING_SERVICE_CHARGE_IN_PERCENTAGE'
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_11__["toastMessage"])('renderError', err);
    }
  });
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isObjectEmpty"](commissionData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isObjectEmpty"](commissionData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isStringEmpty"](commissionData.data.getSettingValue)) {
      var _servicePercentage = _babel_runtime_corejs2_core_js_parse_float__WEBPACK_IMPORTED_MODULE_1___default()(commissionData.data.getSettingValue);

      setServiceAmount(_servicePercentage);
      var servicePercentageString = "".concat(commissionData.data.getSettingValue, " %");
      setServicePercentage(servicePercentageString);

      if (valuePrice) {
        var commissionCost = _servicePercentage / 100 * valuePrice;
        setCommissionAmount(commissionCost.toFixed(2));
      } else {
        var _commissionCost = _servicePercentage / 100 * savedPrice;

        setCommissionAmount(_commissionCost.toFixed(2));
      }
    }
  }, [commissionData, savedPrice, valuePrice]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    var data = [];

    if (props.bookingDetails) {
      setBookingData(props.bookingDetails);
      setRange(props.bookingDetails.chefBookingNoOfPeople);
      setSavedRange(props.bookingDetails.chefBookingNoOfPeople);

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](props.bookingDetails, 'additionalServiceDetails') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isStringEmpty"](props.bookingDetails.additionalServiceDetails)) {
        JSON.parse(props.bookingDetails.additionalServiceDetails).map(function (value) {
          data.push(value.id);
        });
        setSavedService(data);
      }

      setSavedComplexity(props.bookingDetails.chefBookingComplexity);
      setSavedCommision(props.bookingDetails.chefBookingCommissionPriceValue);
      setValuePrice(props.bookingDetails.chefBookingPriceValue);
      setSavedPrice(props.bookingDetails.chefBookingPriceValue);
      setSavedStore(props.bookingDetails.chefBookingStoreTypeId[0]);

      if (props.bookingDetails.chefBookingComplexity === 1) {
        setSavedComplexity(1);
        setComplexity(1);
        setmultiple1(true);
        setmultiple2(false);
        setmultiple3(false);
      } else if (props.bookingDetails.chefBookingComplexity === 1.5) {
        setSavedComplexity(1.5);
        setComplexity(1.5);
        setmultiple2(true);
        setmultiple1(false);
        setmultiple3(false);
      } else if (props.bookingDetails.chefBookingComplexity === 2) {
        setSavedComplexity(2);
        setComplexity(2);
        setmultiple1(false);
        setmultiple2(false);
        setmultiple3(true);
      }
    } else {
      setBookingData([]);
    }
  }, [props]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](chefData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isObjectEmpty"](chefData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](chefData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isObjectEmpty"](chefData.data.chefProfileByChefId)) {
      var detail = chefData.data.chefProfileByChefId;

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](detail, 'chefProfileExtendedsByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](detail.chefProfileExtendedsByChefId, 'nodes')) {
        setProfileDetails(detail.chefProfileExtendedsByChefId.nodes[0]);

        if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["hasProperty"](detail.chefProfileExtendedsByChefId.nodes[0], 'additionalServiceDetails') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_9__["isStringEmpty"](detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails)) {
          setAvailableService(JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails));
        } else {
          setAvailableService([]);
        }
      }
    } else {
      setProfileDetails([]);
    }
  }, [chefData]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (props.chefId) {
      getChefDataByProfile();
    }
  }, [props.chefId]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    calculatePrice();
  }, [additionalServicePrice]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (ProfileDetails) {
      calculatePrice();
    }
  }, [complexityValue]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    var newValue = 0;
    additionalServices.map(function (value) {
      newValue = newValue + _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(value.price);
    });
    setAdditionalServicePrice(newValue);
  }, [additionalServices]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (ProfileDetails) {
      setRange(ProfileDetails.noOfGuestsMin);
      calculatePrice();
    }
  }, [ProfileDetails]);

  function calculatePrice() {
    if (ProfileDetails) {
      var baseRate = ProfileDetails ? ProfileDetails.chefPricePerHour : null;
      var guest = range;
      var complexity = complexityValue;
      var _additionalServices = additionalServicePrice;
      var price = Object(_utils_priceCalculator__WEBPACK_IMPORTED_MODULE_10__["priceCalculator"])(baseRate, guest, complexity, _additionalServices);
      setValuePrice(price);
    }
  }

  function additionalServiceCalc(value, name) {
    var newVal = value;
    var price = 0;

    if (name === 'old') {
      if (newVal.length > 0) {
        newVal.map(function (value1, index) {
          price = price + value1.price;
        });
        return price;
      } else {
        return price;
      }
    } else {
      if (newVal.length > 0) {
        newVal.map(function (value1, index) {
          price = price + _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(value1.price);
        });
        return price;
      } else {
        return price;
      }
    }
  }

  function pricingDetails() {
    var chefDetail;

    if (props.ProfileDetails && props.ProfileDetails.chefProfileExtendedsByChefId && props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }

    if (chefDetail) {
      var baseRate = 0;
      var noOfGuests = 0;
      var complexity = 0;
      var _additionalServices2 = 0;
      var price = 0;
      var totalCharge = 0;
      var serviceCharge = 0;
      var firstfve = 0;
      var afterFive = 0;
      var complexityCharge = 0;
      var remainingMemberCount = 0;
      var halfOfBaseRate = 0;
      var chefCharge = 0;
      var totalAmount = 0;
      var chefValue = chefDetail;
      baseRate = chefValue ? chefValue.chefPricePerHour : null;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = props.complexity;
      console.log('props', props);
      _additionalServices2 = props.additionalServices ? props.additionalServices ? additionalServiceCalc(props.additionalServices, 'old') : 0 : 0;

      if (noOfGuests <= 5) {
        // price = baseRate;
        // price = price * noOfGuests;
        // price = price * complexity;
        // price = price + additionalServices;
        // firstfve = baseRate * 5;
        // chefCharge = price + serviceCharge + firstfve + complexityCharge;
        // totalCharge = price + serviceCharge;
        firstfve = baseRate * noOfGuests;
        complexityCharge = complexity && complexity !== null ? firstfve * complexity - firstfve : 0;
        totalCharge = firstfve + complexityCharge + _additionalServices2;
        serviceCharge = serviceAmount / 100 * totalCharge + 0.3;
        totalAmount = totalCharge - serviceCharge;
        return __jsx("div", {
          className: "card"
        }, __jsx("div", {
          className: "card-header"
        }, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate ? baseRate.toFixed(2) : '')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests ? noOfGuests : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices2.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid  #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef base rate($", baseRate, ") X No.of.guests(", noOfGuests, ")"), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2), " ")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity Upcharge"), __jsx("div", {
          className: "col-lg-2"
        }, complexityCharge >= 0 ? "$".concat(complexityCharge.toFixed(2)) : null)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Rockoly / Payment Charges:"), __jsx("div", {
          className: "col-lg-2"
        }, " $", serviceCharge.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Total amount to pay"), __jsx("div", {
          className: "col-lg-2",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }
        }, "$", totalAmount.toFixed(2))));
      } else if (noOfGuests > 5) {
        // price = baseRate * 5;
        // price = price + (noOfGuests - 5) * (baseRate / 2);
        // price = price * complexity;
        // price = price + additionalServices;
        firstfve = baseRate * noOfGuests;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        price = firstfve - afterFive;
        complexityCharge = price * complexity - price; // price = price + complexityCharge;
        // price = price + additionalServices;

        totalCharge = price + complexityCharge + _additionalServices2;
        serviceCharge = serviceAmount / 100 * totalCharge + 0.3;
        remainingMemberCount = noOfGuests - 5;
        halfOfBaseRate = baseRate / 2;
        totalAmount = totalCharge - serviceCharge;
        return __jsx("div", null, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details Details:"), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices2.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef base rate($", baseRate, ") X ", noOfGuests), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Discount"), __jsx("div", {
          className: "col-lg-2"
        }, "-$", afterFive.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-12",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            // justifyContent: 'flex-end',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Over 5 (", remainingMemberCount, ") guests half chef Base Rate ($", halfOfBaseRate, ")")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity Upcharge:"), __jsx("div", {
          className: "col-lg-2"
        }, ' ', complexityCharge >= 0 ? "$".concat(complexityCharge.toFixed(2)) : null)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Rockoly / Payment Charges:"), __jsx("div", {
          className: "col-lg-2"
        }, "$", serviceCharge.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            // justifyContent: 'flex-end',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Total amount to pay:", ' '), __jsx("div", {
          className: "col-lg-2"
        }, "$", totalAmount.toFixed(2))));
      }
    }
  }

  function SecondPricingDetails() {
    var chefDetail;

    if (props.ProfileDetails && props.ProfileDetails.chefProfileExtendedsByChefId && props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }

    if (chefDetail) {
      var baseRate = 0;
      var noOfGuests = 0;
      var complexity = 0;
      var _additionalServices3 = 0;
      var price = 0;
      var totalCharge = 0;
      var serviceCharge = 0;
      var firstfve = 0;
      var afterFive = 0;
      var complexityCharge = 0,
          chefCharge = 0;
      var chefValue = chefDetail;
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = 1.5;
      _additionalServices3 = props.additionalServices ? props.additionalServices ? additionalServiceCalc(props.additionalServices, 'old') : 0 : 0;

      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + _additionalServices3;
        firstfve = baseRate * 5;
        complexityCharge = complexity ? firstfve * complexity - firstfve : null;
        chefCharge = price + serviceCharge + firstfve + complexityCharge;
        totalCharge = price + serviceCharge;
        serviceCharge = serviceAmount / 100 * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * noOfGuests;
        complexityCharge = firstfve * complexity - firstfve;
        return __jsx("div", {
          className: "card"
        }, __jsx("div", {
          className: "card-header"
        }, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details complexity 1.5")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests ? noOfGuests : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity ? complexity : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices3.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid  #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2), " ")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$ ", complexityCharge > 0 ? complexityCharge.toFixed(2) : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, " $", _additionalServices3.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$", price.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Total amount to pay"), __jsx("div", {
          className: "col-lg-2",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }
        }, "$", totalCharge.toFixed(2))));
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + _additionalServices3;
        serviceCharge = serviceAmount / 100 * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        return __jsx("div", null, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details Details:"), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices3.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge for first 5 guests"), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge for after 5 guests"), __jsx("div", {
          className: "col-lg-2"
        }, "$", afterFive.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity charge:"), __jsx("div", {
          className: "col-lg-2"
        }, " $", complexityCharge.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services:"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices3.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge:", ' '), __jsx("div", {
          className: "col-lg-2"
        }, "$", price.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            // justifyContent: 'flex-end',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Total amount to pay:", ' '), __jsx("div", {
          className: "col-lg-2"
        }, "$", totalCharge.toFixed(2))));
      }
    }
  }

  function ThirdPricingDetails() {
    var chefDetail;

    if (props.ProfileDetails && props.ProfileDetails.chefProfileExtendedsByChefId && props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0]) {
      chefDetail = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
    } else if (props.ProfileDetails) {
      chefDetail = props.ProfileDetails;
    }

    if (chefDetail) {
      var baseRate = 0;
      var noOfGuests = 0;
      var complexity = 0;
      var _additionalServices4 = 0;
      var price = 0;
      var totalCharge = 0;
      var serviceCharge = 0;
      var firstfve = 0;
      var afterFive = 0;
      var complexityCharge = 0,
          chefCharge = 0;
      var chefValue = chefDetail;
      baseRate = chefValue.chefPricePerHour;
      noOfGuests = props.pricingForm ? props.pricingForm.noOfGuests : props.guest;
      complexity = 2;
      _additionalServices4 = props.additionalServices ? props.additionalServices ? additionalServiceCalc(props.additionalServices, 'old') : 0 : 0;

      if (noOfGuests <= 5) {
        price = baseRate;
        price = price * noOfGuests;
        price = price * complexity;
        price = price + _additionalServices4;
        firstfve = baseRate * 5;
        complexityCharge = firstfve * complexity - firstfve;
        chefCharge = price + serviceCharge + firstfve + complexityCharge;
        totalCharge = price + serviceCharge;
        serviceCharge = serviceAmount / 100 * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * noOfGuests;
        complexityCharge = firstfve * complexity - firstfve;
        return __jsx("div", {
          className: "card"
        }, __jsx("div", {
          className: "card-header"
        }, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details complexity 2")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests ? noOfGuests : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity ? complexity : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices4.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid  #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2), " ")), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$ ", complexityCharge > 0 ? complexityCharge.toFixed(2) : '-')), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, " $", _additionalServices4.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge"), __jsx("div", {
          className: "col-lg-2"
        }, "$", price.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            fontSize: '17px',
            borderRight: '1px solid #D3D3D3'
          }
        }, "Total amount to pay"), __jsx("div", {
          className: "col-lg-2",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center'
          }
        }, "$", totalCharge.toFixed(2))));
      } else if (noOfGuests > 5) {
        price = baseRate * 5;
        price = price + (noOfGuests - 5) * (baseRate / 2);
        price = price * complexity;
        price = price + _additionalServices4;
        serviceCharge = serviceAmount / 100 * price + 0.3;
        totalCharge = price;
        firstfve = baseRate * 5;
        afterFive = (noOfGuests - 5) * (baseRate / 2);
        complexityCharge = (firstfve + afterFive) * complexity - (firstfve + afterFive);
        return __jsx("div", null, __jsx("h4", {
          style: {
            color: '#08AB93',
            fontSize: '18px'
          }
        }, "Calculated Details Details:"), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef Base Rate"), __jsx("div", {
          className: "col-lg-2"
        }, "$", baseRate.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "No of guests"), __jsx("div", {
          className: "col-lg-2"
        }, noOfGuests)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity"), __jsx("div", {
          className: "col-lg-2"
        }, complexity)), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices4.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge for first 5 guests"), __jsx("div", {
          className: "col-lg-2"
        }, "$", firstfve.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge for after 5 guests"), __jsx("div", {
          className: "col-lg-2"
        }, "$", afterFive.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Complexity charge:"), __jsx("div", {
          className: "col-lg-2"
        }, " $", complexityCharge.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Additional services:"), __jsx("div", {
          className: "col-lg-2"
        }, "$", _additionalServices4.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex',
            borderBottom: '1px solid #D3D3D3'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Chef charge:", ' '), __jsx("div", {
          className: "col-lg-2"
        }, "$", price.toFixed(2))), __jsx("div", {
          style: {
            display: 'flex'
          }
        }, __jsx("div", {
          className: "col-lg-10",
          style: {
            fontWeight: 'bold',
            display: 'flex',
            // justifyContent: 'flex-end',
            borderRight: '1px solid #D3D3D3',
            fontSize: '17px'
          }
        }, "Total amount to pay:", ' '), __jsx("div", {
          className: "col-lg-2"
        }, "$", totalCharge.toFixed(2))));
      }
    }
  }

  try {
    return __jsx("div", null, __jsx("div", {
      className: "login-content"
    }, __jsx("form", {
      className: "signup-form"
    }, pricingDetails(), __jsx("br", null))));
  } catch (error) {//console.log('error', error);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (CalculatePrice);

/***/ })

})
//# sourceMappingURL=profile-setup.js.d202a6751610a2c134dc.hot-update.js.map