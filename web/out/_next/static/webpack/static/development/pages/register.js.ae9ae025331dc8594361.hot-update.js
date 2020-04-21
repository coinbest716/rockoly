webpackHotUpdate("static\\development\\pages\\register.js",{

/***/ "./components/auth/register/components/RegisterForm.js":
/*!*************************************************************!*\
  !*** ./components/auth/register/components/RegisterForm.js ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RegisterForm; });
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime-corejs2/regenerator */ "./node_modules/@babel/runtime-corejs2/regenerator/index.js");
/* harmony import */ var _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime-corejs2/core-js/json/stringify */ "./node_modules/@babel/runtime-corejs2/core-js/json/stringify.js");
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime-corejs2/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/slicedToArray */ "./node_modules/@babel/runtime-corejs2/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime-corejs2/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @apollo/react-hooks */ "./node_modules/@apollo/react-hooks/lib/react-hooks.esm.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_modern_datepicker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-modern-datepicker */ "./node_modules/react-modern-datepicker/dist/main.js");
/* harmony import */ var react_modern_datepicker__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_modern_datepicker__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-toastify */ "./node_modules/react-toastify/esm/react-toastify.js");
/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.css */ "./node_modules/react-toastify/dist/ReactToastify.css");
/* harmony import */ var react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_toastify_dist_ReactToastify_css__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../config/firebaseConfig */ "./config/firebaseConfig.js");
/* harmony import */ var _SocialLogins__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../SocialLogins */ "./components/auth/SocialLogins.js");
/* harmony import */ var _Auth_String__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../Auth.String */ "./components/auth/Auth.String.js");
/* harmony import */ var _Navigation__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Navigation */ "./components/auth/register/components/Navigation.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var _utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../../utils/LocalStorage */ "./utils/LocalStorage.js");
/* harmony import */ var _Common_loader__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../Common/loader */ "./components/Common/loader.js");
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../../common/gql */ "./common/gql/index.js");
/* harmony import */ var _utils_UserType__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../../utils/UserType */ "./utils/UserType.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _shared_mobile_number_verification_MobileNumberVerification__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../shared/mobile-number-verification/MobileNumberVerification */ "./components/shared/mobile-number-verification/MobileNumberVerification.js");
/* harmony import */ var _utils_LogOut__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../../utils/LogOut */ "./utils/LogOut.js");
/* harmony import */ var _apollo_apollo__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../../apollo/apollo */ "./apollo/apollo.js");





var __jsx = react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement;

function _templateObject2() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_4__["default"])(["\n          ", "\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_4__["default"])(["\n  ", "\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}





















var updateAuthentication = _common_gql__WEBPACK_IMPORTED_MODULE_19__["mutation"].auth.authtenticateGQLTAG;
var REGISTER_AUTH = graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject(), updateAuthentication); // Create apollo client

var apolloClient = Object(_apollo_apollo__WEBPACK_IMPORTED_MODULE_24__["createApolloClient"])();
function RegisterForm() {
  // In order to gain access to the child component instance,
  // you need to assign it to a `ref`, so we call `useRef()` to get one
  var childRef = Object(react__WEBPACK_IMPORTED_MODULE_5__["useRef"])(); // Declare a new state variable

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      firstName = _useState[0],
      setFirstName = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      lastName = _useState2[0],
      setLastName = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      email = _useState3[0],
      setEmail = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      dob = _useState4[0],
      setDob = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      password = _useState5[0],
      setPassword = _useState5[1];

  var _useState6 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      confirmPassword = _useState6[0],
      setConfirmPassword = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(''),
      mobileNumber = _useState7[0],
      setMobileNumber = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])('fa fa-eye-slash'),
      icEye1 = _useState8[0],
      setIcEye1 = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])('fa fa-eye-slash'),
      icEye2 = _useState9[0],
      setIcEye2 = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(true),
      passwordIcon1 = _useState10[0],
      setPasswordIcon1 = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(true),
      passwordIcon2 = _useState11[0],
      setPasswordIcon2 = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(false),
      loader = _useState12[0],
      setLoader = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(null),
      chefUser = _useState13[0],
      setChefUser = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(null),
      showCustomer = _useState14[0],
      setShowCustomer = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_5__["useState"])(false),
      isClicked = _useState15[0],
      setIsClicked = _useState15[1]; //mutation query


  var _useMutation = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_6__["useMutation"])(REGISTER_AUTH, {
    onError: function onError(err) {
      Object(_utils_LogOut__WEBPACK_IMPORTED_MODULE_23__["logOutUser"])().then(function (result) {})["catch"](function (error) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error);
      });
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', err.message);
    }
  }),
      _useMutation2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_3__["default"])(_useMutation, 2),
      registerAuthMutation = _useMutation2[0],
      _useMutation2$ = _useMutation2[1],
      data = _useMutation2$.data,
      loading = _useMutation2$.loading,
      error = _useMutation2$.error;

  if (error) {
    Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', error);
  }

  Object(react__WEBPACK_IMPORTED_MODULE_5__["useEffect"])(function () {
    try {
      setAuthData(data);
    } catch (error) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error.message);
    }
  }, [data]);

  function checkMobileAndEmailDataExist(_x, _x2) {
    return _checkMobileAndEmailDataExist.apply(this, arguments);
  }

  function _checkMobileAndEmailDataExist() {
    _checkMobileAndEmailDataExist = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(emailData, mobileData) {
      var mobile, data, mobileValueCheckTag, output;
      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mobile = mobileData.replace(' ', '');
              mobile = mobile.replace(' ', ''); //Query for check mobile number exist or not

              data = {
                pEmail: emailData ? emailData : '',
                pMobileNo: mobileData ? mobile : ''
              }; //get value form db

              mobileValueCheckTag = _common_gql__WEBPACK_IMPORTED_MODULE_19__["query"].auth.checkEmailAndMobileNoExistsGQLTAG;
              _context.next = 6;
              return apolloClient.query({
                query: graphql_tag__WEBPACK_IMPORTED_MODULE_7___default()(_templateObject2(), mobileValueCheckTag),
                variables: data
              }).then(function (result) {
                return true;
              })["catch"](function (error) {
                Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error.message);
                return false;
              });

            case 6:
              output = _context.sent;
              return _context.abrupt("return", output);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _checkMobileAndEmailDataExist.apply(this, arguments);
  }

  function setAuthData(_x3) {
    return _setAuthData.apply(this, arguments);
  }

  function _setAuthData() {
    _setAuthData = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(data) {
      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (data !== undefined) {
                if (Object(_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_21__["isObjectEmpty"])(data.authenticate) && Object(_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_21__["isObjectEmpty"])(data.authenticate.data)) {
                  //for customer login
                  if (chefUser === false) {
                    Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_20__["getCustomerAuthData"])(data.authenticate.data).then(
                    /*#__PURE__*/
                    function () {
                      var _ref = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
                      /*#__PURE__*/
                      _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(customerRes) {
                        return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__["StoreInLocal"])('user_ids', customerRes);
                                Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__["StoreInLocal"])('user_role', _utils_UserType__WEBPACK_IMPORTED_MODULE_20__["customer"]);
                                Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('success', 'Registered Successfully'); // SignupToCustomer();

                                _context2.next = 5;
                                return Object(_Navigation__WEBPACK_IMPORTED_MODULE_15__["SharedProfile"])();

                              case 5:
                              case "end":
                                return _context2.stop();
                            }
                          }
                        }, _callee2);
                      }));

                      return function (_x5) {
                        return _ref.apply(this, arguments);
                      };
                    }())["catch"](function (error) {
                      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error.message);
                    });
                  } //for chef login
                  else {
                      Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_20__["getChefAuthData"])(data.authenticate.data).then(
                      /*#__PURE__*/
                      function () {
                        var _ref2 = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
                        /*#__PURE__*/
                        _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(chefRes) {
                          return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__["StoreInLocal"])('user_ids', chefRes);
                                  Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__["StoreInLocal"])('user_role', _utils_UserType__WEBPACK_IMPORTED_MODULE_20__["chef"]);
                                  Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('success', 'Registered Successfully');
                                  _context3.next = 5;
                                  return Object(_Navigation__WEBPACK_IMPORTED_MODULE_15__["SharedProfile"])();

                                case 5:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        }));

                        return function (_x6) {
                          return _ref2.apply(this, arguments);
                        };
                      }())["catch"](function (error) {
                        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error.message);
                      });
                    }
                }
              }

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _setAuthData.apply(this, arguments);
  }

  function handleSubmit(_x4) {
    return _handleSubmit.apply(this, arguments);
  } //On submit


  function _handleSubmit() {
    _handleSubmit = Object(_babel_runtime_corejs2_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])(
    /*#__PURE__*/
    _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(e) {
      var mobileData, checkMobileNumberAndEmail;
      return _babel_runtime_corejs2_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              e.preventDefault(); //Callback function from mobile number verification

              _context5.next = 3;
              return childRef.current.getMobileNumberValue();

            case 3:
              mobileData = _context5.sent;
              _context5.next = 6;
              return checkMobileAndEmailDataExist(email, mobileData.mobileNumber);

            case 6:
              checkMobileNumberAndEmail = _context5.sent;

              if (!(checkMobileNumberAndEmail === true)) {
                _context5.next = 14;
                break;
              }

              if (!(password === confirmPassword)) {
                _context5.next = 13;
                break;
              }

              _context5.next = 11;
              return signupAction(mobileData);

            case 11:
              _context5.next = 14;
              break;

            case 13:
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'Password should match');

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _handleSubmit.apply(this, arguments);
  }

  function signupAction(mobileData) {
    if (mobileData && mobileData.mobileNumberValue && mobileData.countryCode) {
      try {
        setLoader(true);
        var userDetail = {
          firstname: firstName ? firstName : null,
          lastname: lastName ? lastName : null,
          dob: dob ? dob : null,
          mobileNumber: mobileData.mobileNumberValue ? mobileData.mobileNumberValue : null,
          mobileCountryCode: mobileData.countryCode ? mobileData.countryCode : null
        };
        _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_12__["firebase"].auth().createUserWithEmailAndPassword(email, password).then(function (user) {
          var currentUser = _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_12__["firebase"].auth().currentUser;
          currentUser.getIdToken().then(function (data) {
            if (currentUser !== null && data) {
              var variables = {
                token: data,
                roleType: chefUser === true ? 'CHEF' : 'CUSTOMER',
                authenticateType: 'REGISTER',
                extra: _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_1___default()(userDetail)
              };
              registerAuthMutation({
                variables: variables
              });
              setLoader(false);
              Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_17__["StoreInLocal"])('current_user_token', data);
            } else {
              setLoader(false);
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'The current user is not available');
            }
          });
        })["catch"](function (error) {
          setLoader(false);
          var errorCode = error.code;
          var errorMessage = error.message;

          switch (errorCode) {
            case 'auth/invalid-email':
              // do something
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'The email address is not valid');
              break;

            case 'auth/wrong-password':
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'Wrong username or password');
              break;

            case 'auth/user-not-found':
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'User not found');
              break;

            default:
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', errorMessage);
            // handle other codes ...
          }
        });
      } catch (error) {
        Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('renderError', error.message);
      }
    } else {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_16__["toastMessage"])('error', 'Please enter mobile number with country code');
    }
  }

  function onSelectButtonTypeClick(value) {
    setShowCustomer(value);

    if (value === true) {
      setChefUser(false);
    } else {
      setChefUser(true);
    }
  } //common setState function


  function onChangeValue(value, setState) {
    setState(value);
  } // Eye Icon visibility


  function changePwdType1() {
    if (passwordIcon1) {
      setIcEye1('fa fa-eye');
      setPasswordIcon1(false);
    } else {
      setIcEye1('fa fa-eye-slash');
      setPasswordIcon1(true);
    }
  }

  function changePwdType2() {
    if (passwordIcon2) {
      setIcEye2('fa fa-eye');
      setPasswordIcon2(false);
    } else {
      setIcEye2('fa fa-eye-slash');
      setPasswordIcon2(true);
    }
  } //loader


  function renderLoader() {
    if (loading !== undefined && loading === true || loader === true) {
      return __jsx("div", null, __jsx(_Common_loader__WEBPACK_IMPORTED_MODULE_18__["default"], null));
    }
  }

  return __jsx(react__WEBPACK_IMPORTED_MODULE_5___default.a.Fragment, null, showCustomer === null && __jsx("div", {
    className: "register_type row"
  }, __jsx("div", {
    onClick: function onClick() {
      return onSelectButtonTypeClick(false);
    },
    className: "chef_register_type col-lg-2 col-md-12 col-sm-12"
  }, __jsx("div", {
    className: "chef_register_type_card card"
  }, __jsx("img", {
    className: "chef_register_type_card_img",
    src: __webpack_require__(/*! ../../../../images/noun_chef_white.png */ "./images/noun_chef_white.png"),
    alt: "image"
  }), __jsx("div", {
    className: "chef_register_type_card_div"
  }, __jsx("b", {
    className: "chef_register_type_card_div_name"
  }, "Are you a private chef?")))), __jsx("div", {
    onClick: function onClick() {
      return onSelectButtonTypeClick(true);
    },
    className: "customer_register_type col-lg-2 col-md-12 col-sm-12"
  }, __jsx("div", {
    className: "customer_register_type_card card"
  }, __jsx("img", {
    className: "customer_register_type_card_img",
    src: __webpack_require__(/*! ../../../../images/customer_white.png */ "./images/customer_white.png"),
    alt: "image"
  }), __jsx("div", {
    className: "customer_register_type_card_div"
  }, __jsx("b", {
    className: "customer_register_type_card_div_name"
  }, "Are you looking for a private chef?"))))), showCustomer !== null && __jsx("section", {
    className: "login-area ptb-60"
  }, __jsx(react_toastify__WEBPACK_IMPORTED_MODULE_10__["ToastContainer"], null), __jsx("div", {
    className: "container",
    id: "register-content"
  }, __jsx("div", {
    className: ""
  }, __jsx("div", {
    className: "col-lg-12 col-md-12"
  }, __jsx("div", {
    className: "login-content"
  }, __jsx("div", {
    className: "section-title"
  }, __jsx("h2", null, __jsx("span", {
    className: "dot"
  }), " Register")), __jsx("form", {
    className: "login-form",
    onSubmit: handleSubmit
  }, __jsx("div", {
    className: "form-group"
  }, __jsx("label", null, _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FIRST_NAME), __jsx("input", {
    type: "text",
    className: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FORM_CONTROL,
    placeholder: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FIRST_NAME_PLACEHOLDER,
    id: "fname",
    name: "fname",
    required: true,
    "data-error": "Please enter first name",
    value: firstName,
    onChange: function onChange(event) {
      return onChangeValue(event.target.value, setFirstName);
    }
  })), __jsx("div", {
    className: "form-group"
  }, __jsx("label", null, _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].LAST_NAME), __jsx("input", {
    type: "text",
    className: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FORM_CONTROL,
    required: true,
    placeholder: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].LAST_NAME_PLACEHOLDER,
    id: "lname",
    name: "lname",
    value: lastName,
    onChange: function onChange(event) {
      return onChangeValue(event.target.value, setLastName);
    }
  })), __jsx("div", {
    className: "form-group"
  }, __jsx("label", null, _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].EMAIL), __jsx("input", {
    type: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].EMAIL_INPUT,
    className: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FORM_CONTROL,
    required: true,
    placeholder: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].EMAIL_PLACEHOLDER,
    id: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].EMAIL_INPUT,
    name: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].EMAIL_INPUT,
    value: email,
    onChange: function onChange(event) {
      return onChangeValue(event.target.value, setEmail);
    }
  })), __jsx("div", {
    className: "form-group"
  }, __jsx("label", null, _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD), __jsx("div", {
    className: "eyeIconView"
  }, __jsx("input", {
    type: passwordIcon1 ? _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_INPUT : _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].TEXT,
    required: true,
    minLength: "6",
    className: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FORM_CONTROL,
    placeholder: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_PLACEHOLDER,
    id: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_INPUT,
    name: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_INPUT,
    value: password,
    onChange: function onChange(event) {
      return onChangeValue(event.target.value, setPassword);
    }
  }), __jsx("span", null, __jsx("i", {
    className: icEye1,
    onClick: function onClick() {
      return changePwdType1();
    }
  })))), __jsx("div", {
    className: "form-group"
  }, __jsx("label", null, _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].CONFIRM_PASSWORD), __jsx("div", {
    className: "eyeIconView"
  }, __jsx("input", {
    type: passwordIcon2 ? _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_INPUT : _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].TEXT,
    required: true,
    minLength: "6",
    className: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].FORM_CONTROL,
    placeholder: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].CONFIRM_PASSWORD_PLACEHOLDER,
    name: _Auth_String__WEBPACK_IMPORTED_MODULE_14__["default"].PASSWORD_INPUT,
    value: confirmPassword,
    onChange: function onChange(event) {
      return onChangeValue(event.target.value, setConfirmPassword);
    }
  }), __jsx("i", {
    className: icEye2,
    onClick: function onClick() {
      return changePwdType2();
    }
  })), __jsx("p", null, __jsx("b", null, "(password must contain at least 6 characters)"))), __jsx(_shared_mobile_number_verification_MobileNumberVerification__WEBPACK_IMPORTED_MODULE_22__["default"], {
    screen: 'register1',
    ref: childRef,
    mobileNumber: mobileNumber
  }), __jsx("div", {
    className: "buy-checkbox-btn"
  }, __jsx("div", {
    className: "item"
  }, __jsx("input", {
    className: "inp-cbx",
    id: "login",
    type: "checkbox",
    checked: isClicked
  }), __jsx("label", {
    className: "cbx",
    htmlFor: "login"
  }, __jsx("span", null, __jsx("svg", {
    width: "12px",
    height: "10px",
    viewBox: "0 0 12 10"
  }, __jsx("polyline", {
    points: "1.5 6 4.5 9 10.5 1"
  }))), __jsx("p", {
    "class": "terms",
    id: "keep-me-login"
  }, "By clicking the checkbox,you agree to our", __jsx(next_link__WEBPACK_IMPORTED_MODULE_8___default.a, {
    href: "/terms-and-conditions"
  }, "Terms and Conditions"), " and you have read our", __jsx(next_link__WEBPACK_IMPORTED_MODULE_8___default.a, {
    href: "/privacy-policy"
  }, "Privacy Policy"))))), renderLoader(), __jsx("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Register")))), __jsx("div", {
    className: "col-lg-12 col-md-12",
    id: "socialLoginContainer"
  }, __jsx("p", {
    className: "orFont"
  }, "or")), __jsx("div", {
    className: "col-lg-12 col-md-12",
    id: "socialLoginContainer"
  }, __jsx("div", null, __jsx(_SocialLogins__WEBPACK_IMPORTED_MODULE_13__["default"], {
    sourceType: 'REGISTER',
    userType: chefUser === true ? 'CHEF' : 'CUSTOMER',
    checkMobileAndEmailDataExist: checkMobileAndEmailDataExist
  })))))));
}

/***/ })

})
//# sourceMappingURL=register.js.ae9ae025331dc8594361.hot-update.js.map