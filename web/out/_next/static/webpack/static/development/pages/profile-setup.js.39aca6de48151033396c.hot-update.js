webpackHotUpdate("static\\development\\pages\\profile-setup.js",{

/***/ "./components/shared/chef-profile/pricing-page/PriceCalculator.js":
/*!************************************************************************!*\
  !*** ./components/shared/chef-profile/pricing-page/PriceCalculator.js ***!
  \************************************************************************/
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
/* harmony import */ var _CalculatePrice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CalculatePrice */ "./components/shared/chef-profile/pricing-page/CalculatePrice.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../common/gql */ "./common/gql/index.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _utils_priceCalculator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../utils/priceCalculator */ "./utils/priceCalculator.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var react_select_creatable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-select/creatable */ "./node_modules/react-select/creatable/dist/react-select.browser.esm.js");
/* harmony import */ var _payments_components_CustomerCardList__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../payments/components/CustomerCardList */ "./components/payments/components/CustomerCardList.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_15__);




var __jsx = react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement;

function _templateObject6() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n    ", "\n  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

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













var listStoreTag = _common_gql__WEBPACK_IMPORTED_MODULE_9__["query"].master.storeTypeGQLTAG; //gql to get store list

var LIST_STORE = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject(), listStoreTag); //chef

var chefDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_9__["query"].chef.profileByIdGQLTAG; //for getting chef data

var GET_CHEF_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject2(), chefDataTag);
var editBooking = _common_gql__WEBPACK_IMPORTED_MODULE_9__["mutation"].booking.createRequestGQLTAG; //for insert dish

var EDIT_BOOKING = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject3(), editBooking);
var createBooking = _common_gql__WEBPACK_IMPORTED_MODULE_9__["mutation"].booking.createGQLTAG; //for insert dish

var CREATE_BOOKING = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject4(), createBooking); //Get commission value

var commissionValue = _common_gql__WEBPACK_IMPORTED_MODULE_9__["query"].setting.getSettingValueGQLTAG;
var COMMISSION_VALUE = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject5(), commissionValue);

var PriceCalculator = function PriceCalculator(props) {
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
      storeList = _useState7[0],
      setStoreList = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      bookingData = _useState8[0],
      setBookingData = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      chefRate = _useState9[0],
      setChefRate = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      savedService = _useState10[0],
      setSavedService = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      availableService = _useState11[0],
      setAvailableService = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      valuePrice = _useState12[0],
      setValuePrice = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      storeValue = _useState13[0],
      setStoreValue = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      complexityValue = _useState14[0],
      setComplexity = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      otherStoreValue = _useState15[0],
      setOtherStoreValue = _useState15[1];

  var _useState16 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      otherStoreDecription = _useState16[0],
      setOtherStoreDecription = _useState16[1];

  var _useState17 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      isvaluePresent = _useState17[0],
      setIsValuePresent = _useState17[1];

  var _useState18 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0),
      additionalServicePrice = _useState18[0],
      setAdditionalServicePrice = _useState18[1];

  var _useState19 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple1 = _useState19[0],
      setmultiple1 = _useState19[1];

  var _useState20 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple2 = _useState20[0],
      setmultiple2 = _useState20[1];

  var _useState21 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      multiple3 = _useState21[0],
      setmultiple3 = _useState21[1];

  var _useState22 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedRange = _useState22[0],
      setSavedRange = _useState22[1];

  var _useState23 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedComplexity = _useState23[0],
      setSavedComplexity = _useState23[1];

  var _useState24 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedPrice = _useState24[0],
      setSavedPrice = _useState24[1];

  var _useState25 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedCommision = _useState25[0],
      setSavedCommision = _useState25[1];

  var _useState26 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      savedStore = _useState26[0],
      setSavedStore = _useState26[1];

  var _useState27 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])('1%'),
      servicePercentage = _useState27[0],
      setServicePercentage = _useState27[1];

  var _useState28 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(0),
      commissionAmount = _useState28[0],
      setCommissionAmount = _useState28[1];

  var _useState29 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(),
      serviceAmount = _useState29[0],
      setServiceAmount = _useState29[1];

  var _useState30 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      bookingSummary = _useState30[0],
      setBookingSummary = _useState30[1];

  var _useState31 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      selectedDishes = _useState31[0],
      setSelectedDishes = _useState31[1];

  var _useState32 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      selectedDishesId = _useState32[0],
      setSelectedDishesId = _useState32[1];

  var _useState33 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      chefSavedDishes = _useState33[0],
      setChefSavedDishes = _useState33[1];

  var _useState34 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      notesValue = _useState34[0],
      setNotesValue = _useState34[1];

  var _useState35 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      dishesMasterList = _useState35[0],
      setDishesMasterList = _useState35[1];

  var _useState36 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      previousAdditinalServicePrice = _useState36[0],
      setPreviousAdditinalServicePrice = _useState36[1];

  var _useState37 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(props.screenName === 'booking' ? true : false),
      showAgreement = _useState37[0],
      setShowAgreement = _useState37[1];

  var _useState38 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(true),
      calculatePriceYn = _useState38[0],
      setcalculatePriceYn = _useState38[1]; // const [getStoreData, listData] = useLazyQuery(LIST_STORE);CREATE_BOOKING


  var _useLazyQuery = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(LIST_STORE, {
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])('renderError', err);
    }
  }),
      _useLazyQuery2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery, 2),
      getStoreData = _useLazyQuery2[0],
      listData = _useLazyQuery2[1];

  var createDish = _common_gql__WEBPACK_IMPORTED_MODULE_9__["mutation"].master.createDishTypeGQLTAG; //for insert dish

  var INSERT_DISH = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject6(), createDish);

  var _useMutation = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useMutation"])(CREATE_BOOKING, {
    onCompleted: function onCompleted(dishData) {
      if (props.onClickNo) {
        props.onClickNo('closeAll');
      }

      closePriceModal();
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["success"], 'Booking created Successfully');
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["renderError"], err.message);
    }
  }),
      _useMutation2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useMutation, 2),
      bookingDataTag = _useMutation2[0],
      bookingDataCall = _useMutation2[1];

  var _useMutation3 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useMutation"])(INSERT_DISH, {
    onCompleted: function onCompleted(dishData) {
      var masterValue = dishData.createDishTypeMaster.dishTypeMaster;
      var dishList = [];
      dishList = dishesMasterList;
      var option = {
        label: masterValue.dishTypeName,
        value: masterValue.dishTypeId
      };
      dishList.push(option);
      setDishesMasterList(dishList); //set selected items

      var selectedItems = [];
      selectedItems = selectedDishes;
      selectedItems.push(option);
      setSelectedDishes(selectedItems); //set selected item's id

      var selectedIds = [];
      selectedIds = selectedDishesId;
      selectedIds.push(masterValue.dishTypeId);
      setSelectedDishesId(selectedIds);
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["success"], 'Dish added');
      dishesRef.current.onInputChange();
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["renderError"], err.message);
    }
  }),
      _useMutation4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useMutation3, 2),
      insertNewDish = _useMutation4[0],
      dishData = _useMutation4[1].dishData;

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    var chefData = props.ProfileDetails;

    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](chefData, 'chefSpecializationProfilesByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData.chefSpecializationProfilesByChefId) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isArrayEmpty"](chefData.chefSpecializationProfilesByChefId.nodes) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData.chefSpecializationProfilesByChefId.nodes[0])) {
      var data = chefData.chefSpecializationProfilesByChefId.nodes[0];
      setChefSavedDishes(_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isArrayEmpty"](data.chefDishTypeId) ? data.chefDishTypeId : []); // setSelectedDishesId(util.isArrayEmpty(data.chefDishTypeId) ? data.chefDishTypeId : []);
    }
  }, [props.ProfileDetails]);

  var _useMutation5 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useMutation"])(EDIT_BOOKING, {
    onCompleted: function onCompleted(data) {
      // console.log('data', data);
      if (props.onClickNo) {
        props.onClickNo();
      }

      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["success"], 'Booking edited Successfully');
    },
    onError: function onError(err) {// toastMessage(renderError, err.message);
    }
  }),
      _useMutation6 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useMutation5, 2),
      bookingRequestDataTag = _useMutation6[0],
      requestData = _useMutation6[1];

  var _useLazyQuery3 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CHEF_DATA, {
    variables: {
      chefId: props.chefId
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {// toastMessage('renderError', err);
    }
  }),
      _useLazyQuery4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery3, 2),
      getChefDataByProfile = _useLazyQuery4[0],
      chefData = _useLazyQuery4[1]; //Get commission value query


  var commissionData = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useQuery"])(COMMISSION_VALUE, {
    variables: {
      pSettingName: 'BOOKING_SERVICE_CHARGE_IN_PERCENTAGE'
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])('renderError', err);
    }
  });
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](commissionData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](commissionData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isStringEmpty"](commissionData.data.getSettingValue)) {
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
    var service = [];

    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](chefData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](chefData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](chefData.data.chefProfileByChefId)) {
      var detail = chefData.data.chefProfileByChefId;
      setmultiple1(true);
      setmultiple2(false);
      setmultiple3(false);
      setComplexity(1);

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](detail, 'chefProfileExtendedsByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](detail.chefProfileExtendedsByChefId, 'nodes')) {
        setProfileDetails(detail.chefProfileExtendedsByChefId.nodes[0]);

        if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](detail.chefProfileExtendedsByChefId.nodes[0], 'additionalServiceDetails') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isStringEmpty"](detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails)) {
          setAvailableService(JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails));
          JSON.parse(detail.chefProfileExtendedsByChefId.nodes[0].additionalServiceDetails).map(function (data) {
            service.push(data.id);
          });
        } else {
          setAvailableService([]);
        } //ProfileDetails.additionalServiceDetails setAvailableService

      }
    } else {
      setProfileDetails([]);
    }
  }, [chefData]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    getStoreData();
  }, [props]);
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
    if (props && props.bookingDetails && props.bookingDetails.chefBookingAdditionalServices) {
      var propsService = JSON.parse(props.bookingDetails.chefBookingAdditionalServices);
      var newValue = 0;
      propsService.map(function (value) {
        newValue = newValue + _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(value.price);
      });
      setPreviousAdditinalServicePrice(newValue);
    }
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (ProfileDetails) {
      setRange(savedRange && savedRange > 0 ? savedRange : ProfileDetails.noOfGuestsMin);
      calculatePrice();
    }
  }, [ProfileDetails, savedRange]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (range) {}

    calculatePrice();
  }, [range]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (storeList && storeList.length > 0) {
      var newVal = [];
      newVal.push(storeList[0].storeTypeId);
      setStoreValue(newVal);
    }
  }, [storeList]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (props.ProfileDetails && props.ProfileDetails.chefProfileExtendedsByChefId.nodes) {
      var details = props.ProfileDetails.chefProfileExtendedsByChefId.nodes[0];
      setProfileDetails(details);

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](details, 'additionalServiceDetails') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isStringEmpty"](details.additionalServiceDetails)) {
        setAvailableService(JSON.parse(details.additionalServiceDetails));
      } else {
        setAvailableService([]);
      }
    }
  }, [props.ProfileDetails]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](listData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](listData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](listData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["hasProperty"](listData.data, 'allStoreTypeMasters') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isObjectEmpty"](listData.data.allStoreTypeMasters) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isArrayEmpty"](listData.data.allStoreTypeMasters.nodes)) {
      setStoreList(listData.data.allStoreTypeMasters.nodes);
    } else {
      setStoreList([]);
    }
  }, [listData]);

  function nextClick() {
    if (complexityValue) {
      if (storeValue && storeValue.length > 0) {
        var values = {
          noOfGuests: range !== null ? _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(range) : ProfileDetails.noOfGuestsMin,
          complexity: complexityValue,
          storeTypeIds: storeValue,
          otherStoreTypes: otherStoreDecription,
          additionalServices: additionalServices
        };
      } else {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["renderError"], 'Please select a store to complete booking');
      }
    } else {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["toastMessage"])(_utils_Toast__WEBPACK_IMPORTED_MODULE_12__["renderError"], 'Please select complexity to complete booking');
    }
  }

  function calculatePrice() {
    // (baseRate * 5 + ((total no of guests - 5) * (baseRate / 2))  * complexity) + additional services
    // (baseRate * no.of.guests * complexity) + additional services
    if (ProfileDetails) {
      var baseRate = ProfileDetails.chefPricePerHour;
      var guest = range;
      var complexity = complexityValue;
      var _additionalServices = additionalServicePrice;
      var price = Object(_utils_priceCalculator__WEBPACK_IMPORTED_MODULE_11__["priceCalculator"])(baseRate, guest, complexity, _additionalServices, previousAdditinalServicePrice);
      setValuePrice(price);
    }
  }

  function onSelectCheckbox(value, index) {
    var newVal = JSON.parse(ProfileDetails.chefAdditionalServices);
    var deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index];
    setAdditionalServices(deleteArray);
    deleteArray.map(function (res, index) {
      if (res) {
        var parsePrice = _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(newVal[index].price);

        newVal[index].price = parsePrice;
        sampleArray.push(newVal[index]);
      }
    });
    setAdditionalServices(sampleArray);
  }

  function onChangeNotes1(e) {
    var newVal = e.target.value;

    if (newVal) {
      setOtherStoreDecription(newVal);
    } else {
      setOtherStoreDecription(null);
    }
  }

  function selectedValue(event) {
    var storeVal = event.target.value.trim();

    if (storeVal === 'OTHERS') {
      setOtherStoreValue(true);
    } else {
      setOtherStoreValue(false);
    }

    var newVal = [];
    newVal.push(event.target.value);
    setStoreValue(newVal);
  }

  function onCheckboxClicked(value, checkbox, state, type) {
    setComplexity(value);

    if (type === 'multiple1') {
      // checkbox(!state);
      setmultiple1(true);
      setmultiple2(false);
      setmultiple3(false);
    } else if (type === 'multiple2') {
      setmultiple1(false);
      setmultiple2(true);
      setmultiple3(false);
    } else if (type === 'multiple3') {
      setmultiple1(false);
      setmultiple2(false);
      setmultiple3(true);
    } // checkbox(!state);

  }

  try {
    return __jsx("div", null, showAgreement === false && __jsx("div", {
      className: "login-content"
    }, __jsx("div", {
      style: {
        marginTop: '5px',
        marginBottom: '5px'
      },
      className: "section-title",
      id: "booking-modal-title"
    }, __jsx("h2", {
      style: {
        fontSixe: '22px'
      }
    }, "Pricing Page")), __jsx("form", {
      className: "signup-form"
    }, __jsx("div", {
      className: "form-group"
    }, __jsx("div", {
      style: {
        display: 'flex'
      }
    }, __jsx("div", {
      className: "form-group col-lg-4",
      style: {
        paddingLeft: '0px'
      }
    }, __jsx("label", {
      className: "label"
    }, "Chef Base Rate:")), __jsx("div", {
      className: "col-lg-6"
    }, "$ ", ProfileDetails.chefPricePerHour)), __jsx("div", {
      style: {
        display: 'flex'
      }
    }, __jsx("div", {
      className: "form-group col-lg-4",
      style: {
        paddingLeft: '0px'
      }
    }, __jsx("label", {
      className: "label"
    }, "Number of Guests:")), __jsx("div", {
      className: "col-lg-6"
    }, __jsx("div", {
      style: {
        paddingRight: '2%'
      }
    }, __jsx("input", {
      style: {
        marginRight: '4%',
        width: '100%'
      },
      type: "range",
      min: ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1,
      max: ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150,
      value: range,
      className: "slider",
      id: "myRange",
      onChange: function onChange(event) {
        event.persist();
        setRange(_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(event.target.value));
      }
    }), __jsx("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, __jsx("div", null, ProfileDetails.noOfGuestsMin ? ProfileDetails.noOfGuestsMin : 1), __jsx("div", null, range), __jsx("div", null, ProfileDetails.noOfGuestsMax ? ProfileDetails.noOfGuestsMax : 150))))), _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_10__["isStringEmpty"](ProfileDetails.chefComplexity) && __jsx("div", {
      "class": "card"
    }, __jsx("div", {
      "class": "card-header",
      id: "booking-chef-details"
    }, __jsx("label", {
      id: "describe-booking"
    }, "Select Complexity")), __jsx("div", {
      className: "form-group",
      id: "bookingDetail"
    }, __jsx("div", null, __jsx("div", {
      className: "col-lg-12",
      id: "complexity-booking-modal",
      style: {
        display: 'flex'
      }
    }, JSON.parse(ProfileDetails.chefComplexity) && JSON.parse(ProfileDetails.chefComplexity).map(function (data, index) {
      {
        console.log("ProfileDetails.chefComplexity", data);
      }

      if (data.complexcityLevel === '1X') {
        return __jsx("div", {
          className: "col-lg-4",
          id: "availabilityRow"
        }, __jsx("div", null, __jsx("div", {
          className: "buy-checkbox-btn",
          id: "checkBoxView"
        }, __jsx("div", {
          className: "item"
        }, __jsx("input", {
          className: "inp-cbx",
          id: "1X",
          type: "radio",
          name: "radio-group1",
          checked: multiple1,
          onChange: function onChange() {
            return onCheckboxClicked(1, setmultiple1, multiple1, 'multiple1');
          }
        }), __jsx("label", {
          className: "cbx",
          htmlFor: "1X"
        }, __jsx("span", null, __jsx("svg", {
          width: "12px",
          height: "10px",
          viewBox: "0 0 12 10"
        }, __jsx("polyline", {
          points: "1.5 6 4.5 9 10.5 1"
        }))), __jsx("span", null, "1X")))), __jsx("div", {
          className: "",
          style: {
            display: 'flex'
          }
        }, __jsx("label", {
          style: {
            marginTop: '1px'
          }
        }, " Dishes : "), __jsx("p", {
          style: {
            fontSize: '14px',
            marginLeft: '2px'
          }
        }, data.dishes ? data.dishes : ''))), __jsx("div", null));
      }

      if (data.complexcityLevel === '1.5X') {
        return __jsx("div", {
          className: "col-lg-4",
          id: "availabilityRow"
        }, __jsx("div", null, __jsx("div", {
          className: "buy-checkbox-btn",
          id: "checkBoxView"
        }, __jsx("div", {
          className: "item"
        }, __jsx("input", {
          className: "inp-cbx",
          id: "1.5X",
          type: "radio",
          name: "radio-group1",
          checked: multiple2,
          style: {
            marginRight: '4%'
          },
          onChange: function onChange() {
            return onCheckboxClicked(1.5, setmultiple2, multiple2, 'multiple2');
          }
        }), __jsx("label", {
          className: "cbx",
          htmlFor: "1.5X"
        }, __jsx("span", null, __jsx("svg", {
          width: "12px",
          height: "10px",
          viewBox: "0 0 12 10"
        }, __jsx("polyline", {
          points: "1.5 6 4.5 9 10.5 1"
        }))), __jsx("span", null, "1.5X")))), __jsx("div", {
          className: "",
          style: {
            display: 'flex'
          }
        }, __jsx("label", {
          style: {
            marginTop: '1px'
          }
        }, " Dishes : "), __jsx("p", {
          style: {
            fontSize: '14px',
            marginLeft: '2px'
          }
        }, data.dishes ? data.dishes : ''))), __jsx("div", null));
      }

      if (data.complexcityLevel === '2X') {
        return __jsx("div", {
          className: "col-lg-4",
          id: "availabilityRow"
        }, __jsx("div", null, __jsx("div", {
          className: "  buy-checkbox-btn",
          id: "checkBoxView"
        }, __jsx("div", {
          className: "item"
        }, __jsx("input", {
          className: "inp-cbx",
          id: "2X",
          type: "radio",
          name: "radio-group1",
          checked: multiple3,
          onChange: function onChange() {
            return onCheckboxClicked(2, setmultiple3, multiple3, 'multiple3');
          }
        }), __jsx("label", {
          className: "cbx",
          htmlFor: "2X"
        }, __jsx("span", null, __jsx("svg", {
          width: "12px",
          height: "10px",
          viewBox: "0 0 12 10"
        }, __jsx("polyline", {
          points: "1.5 6 4.5 9 10.5 1"
        }))), __jsx("span", null, "2X")))), __jsx("div", {
          className: "",
          style: {
            display: 'flex'
          }
        }, __jsx("label", {
          style: {
            marginTop: '1px'
          }
        }, " Dishes : "), __jsx("p", {
          style: {
            fontSize: '14px',
            marginLeft: '2px'
          }
        }, data.dishes ? data.dishes : ''))), __jsx("div", null));
      }
    }))))), availableService.length > 0 && __jsx("div", {
      "class": "card"
    }, __jsx("div", {
      "class": "card-header",
      id: "booking-chef-details"
    }, __jsx("label", {
      id: "describe-booking"
    }, "Select Additional Services Provided by Chef")), __jsx("div", {
      className: "form-group",
      id: "bookingDetail"
    }, availableService.map(function (data, index) {
      return __jsx("div", null, __jsx("div", {
        className: "col-lg-12",
        style: {
          display: 'flex'
        }
      }, __jsx("div", {
        className: "col-lg-6"
      }, __jsx("div", {
        className: "buy-checkbox-btn",
        id: "checkBoxView",
        style: {
          display: 'flex'
        }
      }, __jsx("div", {
        className: "item"
      }, __jsx("input", {
        className: "inp-cbx",
        id: data.name,
        type: "checkbox",
        checked: savedService.includes(data.id) ? savedService.includes(data.id) : undefined,
        onClick: function onClick() {
          return onSelectCheckbox(data, index);
        }
      }), __jsx("label", {
        className: "cbx",
        htmlFor: data.name
      }, __jsx("span", null, __jsx("svg", {
        width: "12px",
        height: "10px",
        viewBox: "0 0 12 10"
      }, __jsx("polyline", {
        points: "1.5 6 4.5 9 10.5 1"
      }))), __jsx("span", null, __jsx("p", {
        style: {
          textTransform: 'capitalize !important'
        }
      }, data.name)))))), __jsx("div", {
        className: "col-lg-6"
      }, __jsx("label", null, "$ ", data.price))));
    })))), __jsx("br", null)), __jsx("br", null), calculatePriceYn && __jsx(_CalculatePrice__WEBPACK_IMPORTED_MODULE_7__["default"], {
      ProfileDetails: ProfileDetails,
      guest: range,
      complexity: complexityValue,
      chefId: props.chefId,
      additionalServices: additionalServices,
      screen: "profile"
    })));
  } catch (error) {//console.log('error', error);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (PriceCalculator);

/***/ })

})
//# sourceMappingURL=profile-setup.js.39aca6de48151033396c.hot-update.js.map