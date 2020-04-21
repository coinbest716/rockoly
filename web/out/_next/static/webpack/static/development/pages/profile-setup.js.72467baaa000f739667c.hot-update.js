webpackHotUpdate("static\\development\\pages\\profile-setup.js",{

/***/ "./components/shared/chef-profile/complexity/Complexity.Screen.js":
/*!************************************************************************!*\
  !*** ./components/shared/chef-profile/complexity/Complexity.Screen.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/defineProperty */ "./node_modules/@babel/runtime-corejs2/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/json/stringify */ "./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/parse-int */ "./node_modules/@babel/runtime-corejs2/core-js/parse-int.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @apollo/react-hooks */ "./node_modules/@apollo/react-hooks/lib/react-hooks.esm.js");
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../common/gql */ "./common/gql/index.js");
/* harmony import */ var _Common_loader__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../Common/loader */ "./components/Common/loader.js");
/* harmony import */ var _utils_UserType__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../utils/UserType */ "./utils/UserType.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var _utils_LocalStorage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../utils/LocalStorage */ "./utils/LocalStorage.js");







var __jsx = react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement;

function _templateObject4() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__["default"])(["\n  ", "\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__["default"])(["\n  ", "\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__["default"])(["\n  ", "\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_6__["default"])(["\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}










var complexityGqlTag = _common_gql__WEBPACK_IMPORTED_MODULE_10__["mutation"].chef.updateComplexityGQLTAG;
var complexityTag = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject(), complexityGqlTag); //chef

var chefDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_10__["query"].chef.profileByIdGQLTAG; //for getting chef data

var GET_CHEF_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject2(), chefDataTag);
var chefSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_10__["subscription"].chef.profileExtendedGQLTAG;
var CHEF_SUBS = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject3(), chefSubscription); //update screen

var updateScreens = _common_gql__WEBPACK_IMPORTED_MODULE_10__["mutation"].chef.updateScreensGQLTAG;
var UPDATE_SCREENS = graphql_tag__WEBPACK_IMPORTED_MODULE_8___default()(_templateObject4(), updateScreens);

var Complexity = function Complexity(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(0),
      rangevalue = _useState[0],
      setrangeValue = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(''),
      extendedId = _useState2[0],
      setExtendeId = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(''),
      chefIdValue = _useState3[0],
      setChefIdValue = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(false),
      multiple1 = _useState4[0],
      setmultiple1 = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(false),
      multiple2 = _useState5[0],
      setmultiple2 = _useState5[1];

  var _useState6 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(false),
      multiple3 = _useState6[0],
      setmultiple3 = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(''),
      text1 = _useState7[0],
      setText1 = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(''),
      text2 = _useState8[0],
      setText2 = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(''),
      text3 = _useState9[0],
      setText3 = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(1),
      min1 = _useState10[0],
      setMin1 = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(3),
      min2 = _useState11[0],
      setMin2 = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(5),
      min3 = _useState12[0],
      setMin3 = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(2),
      max1 = _useState13[0],
      setMax1 = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(4),
      max2 = _useState14[0],
      setMax2 = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(6),
      max3 = _useState15[0],
      setMax3 = _useState15[1];

  var _useState16 = Object(react__WEBPACK_IMPORTED_MODULE_7__["useState"])(null),
      chefProfileextId = _useState16[0],
      setChefProfileextId = _useState16[1];

  var _useMutation = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_9__["useMutation"])(complexityTag, {
    onCompleted: function onCompleted(responseForSubmit) {
      if (props.screen && props.screen === 'register') {
        // To get the updated screens value
        var screensValue = [];
        Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_15__["GetValueFromLocal"])('SharedProfileScreens').then(function (result) {
          if (result && result.length > 0) {
            screensValue = result;
          }

          screensValue.push('COMPLEXITY');
          screensValue = _.uniq(screensValue);
          var variables = {
            chefId: props.chefId,
            chefUpdatedScreens: screensValue
          };
          updateScrrenTag({
            variables: variables
          });
          if (props.nextStep) props.nextStep();
          Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_15__["StoreInLocal"])('SharedProfileScreens', screensValue);
        })["catch"](function (err) {//console.log('err', err);
        });
      }

      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('success', 'Complexity updated successfully');
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('error', err);
    }
  }),
      _useMutation2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_useMutation, 2),
      updateComplexityValues = _useMutation2[0],
      values = _useMutation2[1];

  var _useLazyQuery = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_9__["useLazyQuery"])(GET_CHEF_DATA, {
    variables: {
      chefId: chefIdValue
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('renderError', err);
    }
  }),
      _useLazyQuery2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_useLazyQuery, 2),
      getChefDataByProfile = _useLazyQuery2[0],
      chefData = _useLazyQuery2[1];

  var _useSubscription = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_9__["useSubscription"])(CHEF_SUBS, {
    variables: {
      chefId: chefIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    }
  }),
      chefLocationSubs = _useSubscription.chefLocationSubs;

  var _useMutation3 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_9__["useMutation"])(UPDATE_SCREENS, {
    onCompleted: function onCompleted(data) {// toastMessage(success, 'Favourite cuisines updated successfully');
      // console.log('daskjhkjhkjasdasd123123', data);
    },
    onError: function onError(err) {}
  }),
      _useMutation4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_5__["default"])(_useMutation3, 2),
      updateScrrenTag = _useMutation4[0],
      _useMutation4$ = _useMutation4[1],
      data = _useMutation4$.data,
      loading = _useMutation4$.loading,
      error = _useMutation4$.error;

  Object(react__WEBPACK_IMPORTED_MODULE_7__["useEffect"])(function () {
    //get user role
    Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_12__["getUserTypeRole"])().then(
    /*#__PURE__*/
    function () {
      var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
      /*#__PURE__*/
      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee2(res) {
        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (res === _utils_UserType__WEBPACK_IMPORTED_MODULE_12__["chef"]) {
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_12__["getChefId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_12__["chefId"]).then(
                  /*#__PURE__*/
                  function () {
                    var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_4__["default"])(
                    /*#__PURE__*/
                    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.mark(function _callee(res) {
                      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_3___default.a.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.next = 2;
                              return setChefIdValue(res);

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
                  }());
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_12__["getChefId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_12__["profileExtendId"]).then(function (chefResult) {
                    setExtendeId(chefResult);
                  })["catch"](function (err) {//console.log('error', error);
                  });
                }

              case 1:
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
  }, [extendedId, chefIdValue]);
  Object(react__WEBPACK_IMPORTED_MODULE_7__["useEffect"])(function () {
    if (chefIdValue) {
      getChefDataByProfile();
    }
  }, [chefIdValue]);
  Object(react__WEBPACK_IMPORTED_MODULE_7__["useEffect"])(function () {
    // getting chef's details
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["hasProperty"](chefData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["isObjectEmpty"](chefData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["hasProperty"](chefData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["isObjectEmpty"](chefData.data.chefProfileByChefId) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["hasProperty"](chefData.data.chefProfileByChefId, 'chefProfileExtendedsByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["isObjectEmpty"](chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId)) {
      var chefDetails = chefData.data.chefProfileByChefId.chefProfileExtendedsByChefId;
      var ids = chefDetails.nodes[0].chefProfileExtendedId;
      setChefProfileextId(ids);

      if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["hasProperty"](chefDetails, 'nodes') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_13__["isArrayEmpty"](chefDetails.nodes)) {
        var extendedData = chefDetails.nodes[0];
        var finalData = extendedData.chefComplexity ? JSON.parse(extendedData.chefComplexity) : ''; // setrangeValue(extendedData.chefComplexity ? parseInt(extendedData.chefComplexity) : 0)

        if (finalData && finalData.length > 0) {
          finalData.map(function (data) {
            if (data.complexcityLevel && data.complexcityLevel.trim() === '1X') {
              setmultiple1(true);
              setText1(data.dishes);
              setMin1(data.noOfItems.min);
              setMax1(data.noOfItems.max);
            }

            if (data.complexcityLevel && data.complexcityLevel.trim() === '1.5X') {
              setmultiple2(true);
              setText2(data.dishes);
              setMin2(data.noOfItems.min);
              setMax2(data.noOfItems.max);
            }

            if (data.complexcityLevel && data.complexcityLevel.trim() === '2X') {
              setmultiple3(true);
              setText3(data.dishes);
              setMin3(data.noOfItems.min);
              setMax3(data.noOfItems.max);
            }
          });
        }

        if (finalData === []) {
          setmultiple1(false);
          setText1('');
          setMin1(1);
          setMax1(2);
          setmultiple2(false);
          setText2(0);
          setMin2(3);
          setMax2(4);
          setmultiple3(false);
          setText3('');
          setMin3(5);
          setMax3(6);
        }
      }
    } else {}
  }, [chefData]);

  function onSavingValue() {
    var savingValue = [],
        storeObj = {},
        noOfItems = {};

    if (text1 && text2 && text3 && min1 && min2 && min3 && max1 && max2 && max3) {
      if (min1 <= 0 || min2 <= 0 || min3 <= 0 || max1 <= 0 || max2 <= 0 || max3 <= 0) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('error', 'Number of menu items should be greater than 0.');
      } else if (_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(max1) <= _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(min1) || _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(max2) <= _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(min2) || _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(max3) <= _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_2___default()(min3)) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('error', 'To value should be greater');
      } else if (min1 % 1 != 0 || min2 % 1 != 0 || min3 % 1 != 0 || max1 % 1 != 0 || max2 % 1 != 0 || max3 % 1 != 0) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('error', 'Please enter valid input for menu items');
      } else {
        if (text1) {
          storeObj = {
            complexcityLevel: '1X',
            dishes: text1,
            noOfItems: {
              min: min1,
              max: max1
            }
          };
          savingValue.push(storeObj);
        }

        if (text2) {
          storeObj = {
            complexcityLevel: '1.5X',
            dishes: text2,
            noOfItems: {
              min: min2,
              max: max2
            }
          };
          savingValue.push(storeObj);
        }

        if (text3) {
          storeObj = {
            complexcityLevel: '2X',
            dishes: text3,
            noOfItems: {
              min: min3,
              max: max3
            }
          };
          savingValue.push(storeObj);
        }

        updateComplexityValues({
          variables: {
            chefProfileExtendedId: chefProfileextId,
            chefComplexity: _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1___default()(savingValue)
          }
        });
      }
    } else {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('error', 'Please fill all the details');
    }
  }

  function SavingStateValue(state, value) {
    if (value >= 0) {
      state(value);
    } else if (value == '' || value == null || value == undefined) {
      state(0);
    } else {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_14__["toastMessage"])('renderError', 'Do not enter negative value');
    }
  }

  function SavingStateValueText(state, value) {
    state(value);
  }

  function onCheckboxClicked(checkbox, state, type) {
    // console.log(state)setmultiple1 setmultiple2 setmultiple3
    if (type === 'multiple1') {
      checkbox(!state);
      setmultiple2(false);
      setmultiple3(false);
    } else if (type === 'multiple2') {
      checkbox(!state);
      setmultiple1(false);
      setmultiple3(false);
    } else if (type === 'multiple3') {
      checkbox(!state);
      setmultiple1(false);
      setmultiple2(false);
    } // checkbox(!state);

  }

  try {
    return __jsx("section", {
      className: "products-collections-area ptb-60 ProfileSetup \n      ".concat(props.screen === 'register' ? 'base-rate-info' : '') // className="products-collections-area ptb-60 ProfileSetup"
      ,
      id: "sction-card-modal"
    }, __jsx("div", {
      className: "col-lg-12"
    }, props.screen !== 'register' && __jsx("div", {
      className: "section-title"
    }, __jsx("h2", null, "Complexity")), __jsx("form", {
      className: "login-form"
    }, __jsx("h5", {
      style: {
        paddingTop: '10px',
        paddingLeft: '10px',
        color: '#08AB93',
        fontSize: '20px',
        textDecoration: 'underline',
        fontWeight: 400,
        paddingBottom: '1%'
      }
    }, "Complexity"), __jsx("div", {
      className: "form-group"
    }, __jsx("div", null, __jsx("p", {
      style: {
        fontSize: '17px',
        paddingLeft: '1%'
      }
    }, "We realize that putting together a complicated menu is extra work and some dishes require complicated executions. Here is your chance to multiply the customer invoice up to 2 times based on the complexity. Please take your time here as this is something that's unique to you and what the customer will see when figuring out the total bill."), __jsx("div", {
      className: "row",
      id: "availabilityRow",
      "class": "complexity_availability_row"
    }, __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4",
      id: "checkBoxView"
    }, __jsx("div", {
      className: "item"
    }, __jsx("label", {
      className: "cbx",
      htmlFor: "1X"
    }, __jsx("span", null, "1X")))), __jsx("textarea", {
      style: {
        height: '100px',
        paddingTop: '10px',
        border: '1px solid'
      },
      type: "text",
      className: "form-control",
      id: "form-input-view",
      value: text1,
      onChange: function onChange() {
        return SavingStateValueText(setText1, event.target.value);
      },
      placeholder: "Provide an example of an enticing simple dish unique to you for 1x multiplier"
    })), __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4"
    }, __jsx("label", null, "How many menu items?")), __jsx("input", {
      type: "number",
      value: min1,
      onChange: function onChange() {
        return SavingStateValue(setMin1, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    }), __jsx("div", {
      className: "col-lg-1",
      style: {
        display: 'flex',
        justifyContent: 'center'
      }
    }, __jsx("label", null, "to")), ' ', __jsx("input", {
      type: "number",
      value: max1,
      onChange: function onChange() {
        return SavingStateValue(setMax1, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    }))), __jsx("div", {
      className: "row",
      id: "availabilityRow",
      "class": "complexity_availability_row"
    }, __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4",
      id: "checkBoxView"
    }, __jsx("label", {
      className: "cbx",
      htmlFor: "1.5X"
    }, __jsx("span", null, "1.5X"))), __jsx("textarea", {
      style: {
        height: '100px',
        paddingTop: '10px',
        border: '1px solid'
      },
      type: "text",
      className: "form-control",
      id: "form-input-view",
      value: text2,
      onChange: function onChange() {
        return SavingStateValueText(setText2, event.target.value);
      },
      placeholder: "Provide an example of average complexity dish unique to you for 1.5x multiplier"
    })), __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4"
    }, __jsx("label", null, "How many menu items?")), __jsx("input", {
      type: "number",
      value: min2,
      onChange: function onChange() {
        return SavingStateValue(setMin2, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    }), __jsx("div", {
      className: "col-lg-1",
      style: {
        display: 'flex',
        justifyContent: 'center'
      }
    }, __jsx("label", null, "to")), __jsx("input", {
      type: "number",
      value: max2,
      onChange: function onChange() {
        return SavingStateValue(setMax2, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    }))), __jsx("div", {
      className: "row",
      id: "availabilityRow",
      "class": "complexity_availability_row"
    }, __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4",
      id: "checkBoxView"
    }, __jsx("label", {
      className: "cbx",
      htmlFor: "2.0X"
    }, __jsx("span", null, "2.0X "))), __jsx("textarea", {
      style: {
        height: '100px',
        paddingTop: '10px',
        border: '1px solid'
      },
      type: "text",
      className: "form-control",
      id: "form-input-view",
      value: text3,
      onChange: function onChange() {
        return SavingStateValueText(setText3, event.target.value);
      },
      placeholder: "Provide an example of a complicated dish unique to you` for 2x multiplier"
    })), __jsx("div", {
      className: "col-lg-12",
      style: {
        display: 'flex',
        paddingTop: '15px'
      }
    }, __jsx("div", {
      className: "col-lg-4"
    }, __jsx("label", null, "How many menu items?")), __jsx("input", Object(_babel_runtime_corejs2_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])({
      type: "number",
      value: min3,
      onChange: function onChange() {
        return SavingStateValue(setMin3, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    }, "id", "form-input-view")), __jsx("div", {
      className: "col-lg-1",
      style: {
        display: 'flex',
        justifyContent: 'center'
      }
    }, __jsx("label", null, "to")), __jsx("input", {
      type: "number",
      value: max3,
      onChange: function onChange() {
        return SavingStateValue(setMax3, event.target.value);
      },
      className: "form-control",
      id: "form-input-view"
    })))))), __jsx("div", {
      className: "container"
    }, __jsx("div", {
      className: "saveButton"
    }, __jsx("button", {
      type: "button",
      className: "btn btn-primary",
      onClick: function onClick() {
        return onSavingValue();
      }
    }, "Save")))));
  } catch (error) {//console.log('error', error);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (Complexity);

/***/ })

})
//# sourceMappingURL=profile-setup.js.72467baaa000f739667c.hot-update.js.map