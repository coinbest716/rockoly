webpackHotUpdate("static\\development\\pages\\profile-setup.js",{

/***/ "./components/profile-setup/ProfileSetup.Screen.js":
/*!*********************************************************!*\
  !*** ./components/profile-setup/ProfileSetup.Screen.js ***!
  \*********************************************************/
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
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/src/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _shared_layout_Navbar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/layout/Navbar */ "./components/shared/layout/Navbar.js");
/* harmony import */ var _shared_layout_Footer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../shared/layout/Footer */ "./components/shared/layout/Footer.js");
/* harmony import */ var _shared_sidebar_LeftSidebar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../shared/sidebar/LeftSidebar */ "./components/shared/sidebar/LeftSidebar.js");
/* harmony import */ var _shared_mobile_number_MobileNumberVerification__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../shared/mobile-number/MobileNumberVerification */ "./components/shared/mobile-number/MobileNumberVerification.js");
/* harmony import */ var _components_Description__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/Description */ "./components/profile-setup/components/Description.js");
/* harmony import */ var _components_Specialization__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/Specialization */ "./components/profile-setup/components/Specialization.js");
/* harmony import */ var _components_availability_Availability__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/availability/Availability */ "./components/profile-setup/components/availability/Availability.js");
/* harmony import */ var _components_UploadFile__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/UploadFile */ "./components/profile-setup/components/UploadFile.js");
/* harmony import */ var _components_BasicInformation__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/BasicInformation */ "./components/profile-setup/components/BasicInformation.js");
/* harmony import */ var _components_Location__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/Location */ "./components/profile-setup/components/Location.js");
/* harmony import */ var _shared_preferences_Preference__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../shared/preferences/Preference */ "./components/shared/preferences/Preference.js");
/* harmony import */ var _shared_chef_profile_base_rate_BaseRate_Screen__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../shared/chef-profile/base-rate/BaseRate.Screen */ "./components/shared/chef-profile/base-rate/BaseRate.Screen.js");
/* harmony import */ var _shared_chef_profile_chef_preference_ChefPreference__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../shared/chef-profile/chef-preference/ChefPreference */ "./components/shared/chef-profile/chef-preference/ChefPreference.js");
/* harmony import */ var _shared_chef_profile_image_gallery_ImageGallery__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../shared/chef-profile/image-gallery/ImageGallery */ "./components/shared/chef-profile/image-gallery/ImageGallery.js");
/* harmony import */ var _shared_chef_profile_license_upload_LicenseUpload__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../shared/chef-profile/license-upload/LicenseUpload */ "./components/shared/chef-profile/license-upload/LicenseUpload.js");
/* harmony import */ var _shared_preferences_components_AllergyUpdate__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../shared/preferences/components/AllergyUpdate */ "./components/shared/preferences/components/AllergyUpdate.js");
/* harmony import */ var _shared_preferences_components_FavouriteCuisine__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../shared/preferences/components/FavouriteCuisine */ "./components/shared/preferences/components/FavouriteCuisine.js");
/* harmony import */ var _shared_preferences_components_DietaryrestrictionsUpdate__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../shared/preferences/components/DietaryrestrictionsUpdate */ "./components/shared/preferences/components/DietaryrestrictionsUpdate.js");
/* harmony import */ var _shared_preferences_components_KitchenUtensilUpdate__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../shared/preferences/components/KitchenUtensilUpdate */ "./components/shared/preferences/components/KitchenUtensilUpdate.js");
/* harmony import */ var _shared_chef_profile_pricing_page_PriceCalculator__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../shared/chef-profile/pricing-page/PriceCalculator */ "./components/shared/chef-profile/pricing-page/PriceCalculator.js");
/* harmony import */ var _shared_email_UserEmail__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../shared/email/UserEmail */ "./components/shared/email/UserEmail.js");
/* harmony import */ var _common_gql__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../../common/gql */ "./common/gql/index.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_29___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_29__);
/* harmony import */ var _Common_loader__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../Common/loader */ "./components/Common/loader.js");
/* harmony import */ var _utils_UserType__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../../utils/UserType */ "./utils/UserType.js");
/* harmony import */ var _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../../config/firebaseConfig */ "./config/firebaseConfig.js");
/* harmony import */ var _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../../utils/checkEmptycondition */ "./utils/checkEmptycondition.js");
/* harmony import */ var _utils_Toast__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../../utils/Toast */ "./utils/Toast.js");
/* harmony import */ var _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./ProfileSetup.String */ "./components/profile-setup/ProfileSetup.String.js");
/* harmony import */ var _utils_LocalStorage__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../../utils/LocalStorage */ "./utils/LocalStorage.js");
/* harmony import */ var _shared_profile_Sharedprofile_Screen__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../shared-profile/Sharedprofile.Screen */ "./components/shared-profile/Sharedprofile.Screen.js");
/* harmony import */ var _shared_profile_picture_ProfilePicture__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../shared/profile-picture/ProfilePicture */ "./components/shared/profile-picture/ProfilePicture.js");
/* harmony import */ var _shared_chef_profile_complexity_Complexity_Screen__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../shared/chef-profile/complexity/Complexity.Screen */ "./components/shared/chef-profile/complexity/Complexity.Screen.js");
/* harmony import */ var _shared_chef_profile_personal_info_PersonalInformation_Screen__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ../shared/chef-profile/personal-info/PersonalInformation.Screen */ "./components/shared/chef-profile/personal-info/PersonalInformation.Screen.js");




var __jsx = react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement;

function _templateObject9() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = Object(_babel_runtime_corejs2_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["\n  ", "\n"]);

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

// TOdo-cr-si remove unused code


 // import Page from '../shared/layout/Main';


































 //customer

var customerDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_28__["query"].customer.profileByIdGQLTAG; //for getting customer data

var GET_CUSTOMER_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject(), customerDataTag); //chef

var chefDataTag = _common_gql__WEBPACK_IMPORTED_MODULE_28__["query"].chef.profileByIdGQLTAG; //for getting chef data

var GET_CHEF_DATA = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject2(), chefDataTag); // update profile data submit for chef

var updateChefProfileSubmit = _common_gql__WEBPACK_IMPORTED_MODULE_28__["mutation"].chef.submitForReviewGQLTAG;
var UPDATE_CHEF_PROFILE_SUBMIT = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject3(), updateChefProfileSubmit); // gql for subscription for chef

var chefProfileSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].chef.ProfileGQLTAG;
var CHEF_SUBSCRIPTION_TAG = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject4(), chefProfileSubscription); // gql for subscription for chef specialization

var chefSpecializationSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].chef.specializationGQLTAG;
var SPECIALIZATION_SUBSCRIPTION = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject5(), chefSpecializationSubscription); // for chef location

var chefLocationSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].chef.profileExtendedGQLTAG;
var CHEF_LOCATION_SUBS = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject6(), chefLocationSubscription); // gql for subscription for customer

var customerProfileSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].customer.profileGQLTAG;
var CUSTOMER_SUBSCRIPTION_TAG = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject7(), customerProfileSubscription); // fro customer location

var customerLocationSubscription = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].customer.profileExtendedGQLTAG;
var CUSTOMER_LOCATION_SUBS = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject8(), customerLocationSubscription);
var unAvailabilitySubs = _common_gql__WEBPACK_IMPORTED_MODULE_28__["subscription"].chef.notAvailabilityGQLTAG;
var UNAVAILABILITY_SUBSCRIPTION = graphql_tag__WEBPACK_IMPORTED_MODULE_6___default()(_templateObject9(), unAvailabilitySubs);

var ProfileSetupScreen = function ProfileSetupScreen(props) {
  var childRef = Object(react__WEBPACK_IMPORTED_MODULE_4__["useRef"])(); // const [keys, setkeys] = useState(parseInt(props.keyValue));

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(4),
      keys = _useState[0],
      setkeys = _useState[1];

  var _useState2 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      ProfileDetails = _useState2[0],
      setProfileDetails = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])([]),
      customerProfileDetails = _useState3[0],
      setCustomerProfileDetails = _useState3[1];

  var _useState4 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(props.isFromRegister),
      isFromRegister = _useState4[0],
      setisFromRegister = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])({}),
      chefDetails = _useState5[0],
      setChefDetails = _useState5[1];

  var _useState6 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])({}),
      customerDetails = _useState6[0],
      setCustomerDetails = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      chefIdValue = _useState7[0],
      setChefId = _useState7[1];

  var _useState8 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(null),
      customerIdValue = _useState8[0],
      setCustomerId = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      userRole = _useState9[0],
      setUserRole = _useState9[1];

  var _useState10 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      chefStatusId = _useState10[0],
      setChefStatusId = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      isFilledYn = _useState11[0],
      setIsFilledYn = _useState11[1];

  var _useState12 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      load = _useState12[0],
      setLoading = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      roleType = _useState13[0],
      setRoleType = _useState13[1];

  var _useState14 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(''),
      reason = _useState14[0],
      setReason = _useState14[1];

  var _useState15 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      isRegistrationCompletedYn = _useState15[0],
      setIsRegistrationCompletedYn = _useState15[1];

  var _useState16 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      mobileNumberVerified = _useState16[0],
      setMobileNumberVerified = _useState16[1];

  var _useState17 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      emailVerified = _useState17[0],
      setEmailVerified = _useState17[1];

  var _useState18 = Object(react__WEBPACK_IMPORTED_MODULE_4__["useState"])(false),
      removeModal = _useState18[0],
      setRemoveModal = _useState18[1];

  var _useLazyQuery = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useLazyQuery"])(GET_CUSTOMER_DATA, {
    variables: {
      customerId: customerIdValue
    },
    fetchPolicy: 'network-only',
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('renderError', err);
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
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('renderError', err);
    }
  }),
      _useLazyQuery4 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useLazyQuery3, 2),
      getChefDataByProfile = _useLazyQuery4[0],
      chefData = _useLazyQuery4[1];

  var _useSubscription = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useSubscription"])(CHEF_SUBSCRIPTION_TAG, {
    variables: {
      chefId: chefIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.chefProfile) {
        getChefDataByProfile();
      }
    }
  }),
      chefProfileSubsdata = _useSubscription.chefProfileSubsdata;

  var _useSubscription2 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useSubscription"])(SPECIALIZATION_SUBSCRIPTION, {
    variables: {
      chefId: chefIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.chefSpecializationProfile) {
        getChefDataByProfile();
      }
    }
  }),
      chefSpecializationSubsdata = _useSubscription2.chefSpecializationSubsdata;

  var _useSubscription3 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useSubscription"])(CHEF_LOCATION_SUBS, {
    variables: {
      chefId: chefIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.chefProfileExtended) {
        getChefDataByProfile();
      }
    }
  }),
      chefLocationSubs = _useSubscription3.chefLocationSubs;

  var _useSubscription4 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useSubscription"])(CUSTOMER_SUBSCRIPTION_TAG, {
    variables: {
      customerId: customerIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.customerProfile) {
        getCustomerData();
      }
    }
  }),
      SubscriptionCustomerdata = _useSubscription4.SubscriptionCustomerdata;

  var _useSubscription5 = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useSubscription"])(CUSTOMER_LOCATION_SUBS, {
    variables: {
      customerId: customerIdValue
    },
    onSubscriptionData: function onSubscriptionData(res) {
      if (res.subscriptionData.data.customerProfileExtended) {
        getCustomerData();
      }
    }
  }),
      customerLocationSubs = _useSubscription5.customerLocationSubs;

  console.log("UPDATE_CHEF_PROFILE_SUBMIT", UPDATE_CHEF_PROFILE_SUBMIT);

  var _useMutation = Object(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_5__["useMutation"])(UPDATE_CHEF_PROFILE_SUBMIT, {
    onCompleted: function onCompleted(responseForProfileSubmit) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('success', 'Submitted successfully');
      setRemoveModal(false);
    },
    onError: function onError(err) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('error', err);
    }
  }),
      _useMutation2 = Object(_babel_runtime_corejs2_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_2__["default"])(_useMutation, 2),
      updateChefProfileSubmit = _useMutation2[0],
      responseForProfileSubmit = _useMutation2[1]; // update profile data submit for chef


  function onClickSubmit() {
    return _onClickSubmit.apply(this, arguments);
  } //get chef id


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
              return updateChefProfileSubmit({
                variables: variables
              });

            case 4:
              _context3.next = 7;
              break;

            case 6:
              Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('error', _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].VERIFIED_ALERT);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _onClickSubmit.apply(this, arguments);
  }

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    //get user role
    Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_31__["getUserTypeRole"])().then(
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

                if (res === _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]) {
                  //customer user
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_31__["getCustomerId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customerId"]).then(function (customerResult) {
                    setCustomerId(customerResult);
                    getCustomerData();
                  })["catch"](function (err) {});
                } else {
                  //chef user
                  Object(_utils_UserType__WEBPACK_IMPORTED_MODULE_31__["getChefId"])(_utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chefId"]).then(
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
    if (chefIdValue) {
      getChefDataByProfile();
    }
  }, chefIdValue);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (customerIdValue) {
      getCustomerData();
    }
  }, customerIdValue); //set user data

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (userRole === _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]) {
      setCustomerDetails(data);
    } else {
      setChefDetails(data);
    }
  }, [data]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    // getting chef's details
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isObjectEmpty"](chefData) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["hasProperty"](chefData, 'data') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isObjectEmpty"](chefData.data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["hasProperty"](chefData.data, 'chefProfileByChefId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isObjectEmpty"](chefData.data.chefProfileByChefId)) {
      var _chefDetails = chefData.data.chefProfileByChefId;
      setIsRegistrationCompletedYn(_chefDetails.isRegistrationCompletedYn);
      setProfileDetails(_chefDetails);
      setChefStatusId(_chefDetails.chefStatusId.trim());

      var _data = JSON.parse(_chefDetails.isDetailsFilledYn);

      setIsFilledYn(_data.isFilledYn);

      var _reason = _chefDetails.chefRejectOrBlockReason ? _chefDetails.chefRejectOrBlockReason : '';

      setReason(_reason);
    } else {
      setProfileDetails(null);
    }
  }, [chefData]);
  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    // getting customer's details
    if (_utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isObjectEmpty"](data) && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["hasProperty"](data, 'customerProfileByCustomerId') && _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isObjectEmpty"](data.customerProfileByCustomerId)) {
      setCustomerProfileDetails(data.customerProfileByCustomerId);
    } else {
      setCustomerProfileDetails(null);
    }
  }, [data]); //when changing sidebar menu

  function onChangeMenu(key) {
    setkeys(key);
  } //check and set admin user


  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    if (localStorage.getItem('loggedInAs') !== null) {
      Object(_utils_LocalStorage__WEBPACK_IMPORTED_MODULE_36__["GetValueFromLocal"])('loggedInAs').then(function (result) {
        if (result === 'Admin') {
          setRoleType(result);
        }
      })["catch"](function (err) {//console.log('err', err);
      });
    }
  }); //Check email and mobile number verified or not

  Object(react__WEBPACK_IMPORTED_MODULE_4__["useEffect"])(function () {
    _config_firebaseConfig__WEBPACK_IMPORTED_MODULE_32__["firebase"].auth().onAuthStateChanged(function (user) {
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

  function onCloseModal() {
    try {
      setRemoveModal(false);
    } catch (error) {
      Object(_utils_Toast__WEBPACK_IMPORTED_MODULE_34__["toastMessage"])('renderError', error.message);
    }
  }

  return __jsx(react__WEBPACK_IMPORTED_MODULE_4___default.a.Fragment, null, __jsx(_shared_layout_Navbar__WEBPACK_IMPORTED_MODULE_7__["default"], null), __jsx("section", {
    className: "cart-area ptb-60 ProfileSetup"
  }, __jsx("div", {
    className: "dashboard",
    style: {
      width: '100%',
      overflowX: 'hidden'
    }
  }, userRole === _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"] ? __jsx("div", {
    className: "row"
  }, __jsx("div", {
    className: "col-sm-12 col-md-12  col-lg-3 siderbar-color",
    id: "sidebar"
  }, __jsx(_shared_profile_picture_ProfilePicture__WEBPACK_IMPORTED_MODULE_38__["default"], {
    details: customerDetails,
    id: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), __jsx(_shared_sidebar_LeftSidebar__WEBPACK_IMPORTED_MODULE_9__["default"], {
    onChangeMenu: onChangeMenu,
    selectedMenuKey: keys,
    role: 'customer'
  })), __jsx("div", {
    className: "col-lg-8 col-md-12 col-sm-12"
  }, keys === 0 && __jsx(_components_BasicInformation__WEBPACK_IMPORTED_MODULE_15__["default"], {
    details: customerDetails,
    id: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), keys === 1 && __jsx(_shared_mobile_number_MobileNumberVerification__WEBPACK_IMPORTED_MODULE_10__["default"], {
    screen: 'basic',
    details: customerDetails,
    id: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), keys === 2 && __jsx(_shared_email_UserEmail__WEBPACK_IMPORTED_MODULE_27__["default"], {
    screen: 'basic',
    details: customerDetails,
    id: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), keys === 3 && // <CommonLocation UserEmail details={customerDetails} ref={childRef} props={props} />
  __jsx(_components_Location__WEBPACK_IMPORTED_MODULE_16__["default"], {
    details: customerDetails,
    customerId: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), keys === 4 && __jsx(_shared_preferences_components_AllergyUpdate__WEBPACK_IMPORTED_MODULE_22__["default"], {
    details: customerDetails,
    customerId: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), keys === 5 && __jsx(_shared_preferences_components_DietaryrestrictionsUpdate__WEBPACK_IMPORTED_MODULE_24__["default"], {
    details: customerDetails,
    customerId: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), ' ', keys === 6 && __jsx(_shared_preferences_components_KitchenUtensilUpdate__WEBPACK_IMPORTED_MODULE_25__["default"], {
    details: customerDetails,
    customerId: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  }), ' ', keys === 7 && __jsx(_shared_preferences_components_FavouriteCuisine__WEBPACK_IMPORTED_MODULE_23__["default"], {
    details: customerDetails,
    customerId: customerIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["customer"]
  })), ' ') : userRole === _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"] && __jsx("div", {
    className: "row"
  }, __jsx("div", {
    className: "col-sm-12 col-md-12 col-lg-3 siderbar-color",
    id: "sidebar"
  }, __jsx(_shared_profile_picture_ProfilePicture__WEBPACK_IMPORTED_MODULE_38__["default"], {
    details: ProfileDetails,
    id: chefIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"]
  }), __jsx(_shared_sidebar_LeftSidebar__WEBPACK_IMPORTED_MODULE_9__["default"], {
    onChangeMenu: onChangeMenu,
    selectedMenuKey: keys
  })), __jsx("div", {
    className: "col-lg-8 col-md-12-col-sm-12 ",
    id: "serviceView-containar"
  }, __jsx("div", null, __jsx("div", {
    className: "adminStatus",
    id: "status-full-view"
  }, __jsx("div", {
    id: "status-content-view"
  }, chefStatusId === _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PENDING && __jsx("div", null, __jsx("div", {
    className: "statusMsg"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PROFILE_STATUS, __jsx("div", {
    className: "response-view",
    style: {
      paddingLeft: 5
    }
  }, ' ', ' ' + _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].REVIEW_PENDING)), __jsx("div", {
    className: "statusMsg",
    id: "failed"
  }, __jsx("div", {
    className: "response-view"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].REVIEW_PENDING_MSG)), isRegistrationCompletedYn === true && __jsx("div", {
    className: "basicInfoSubmit"
  }, __jsx("button", {
    type: "submit",
    onClick: function onClick() {
      return setRemoveModal(true);
    },
    className: "btn btn-primary"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].SUBMIT))), chefStatusId === _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].REJECTED && __jsx("div", null, __jsx("div", {
    className: "statusMsg"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PROFILE_STATUS, __jsx("div", {
    className: "response-view",
    style: {
      paddingLeft: 5
    }
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].REVIEW_REJECTED)), isRegistrationCompletedYn === true && __jsx("div", {
    className: "basicInfoSubmit"
  }, __jsx("button", {
    type: "submit",
    onClick: function onClick() {
      return setRemoveModal(true);
    },
    className: "btn btn-primary"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].SUBMIT))), chefStatusId === _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].SUBMITTED_FOR_REVIEW && __jsx("div", null, __jsx("div", {
    className: "statusMsg"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PROFILE_STATUS, __jsx("div", {
    className: "response-view",
    style: {
      paddingLeft: 5
    }
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].SUBMIT_FOR_REVIEW))), chefStatusId === _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].APPROVED && __jsx("div", null, __jsx("div", {
    className: "statusMsg"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PROFILE_STATUS, __jsx("div", {
    className: "response-view"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].PROFILE_VERIFIED))), _utils_checkEmptycondition__WEBPACK_IMPORTED_MODULE_33__["isStringEmpty"](reason) && __jsx("div", {
    className: "statusMsg"
  }, _ProfileSetup_String__WEBPACK_IMPORTED_MODULE_35__["default"].REASON, __jsx("div", {
    className: "response-view"
  }, reason))), keys === 0 && __jsx(_components_BasicInformation__WEBPACK_IMPORTED_MODULE_15__["default"], {
    details: ProfileDetails,
    id: chefIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"]
  }), keys === 1 && __jsx(_shared_mobile_number_MobileNumberVerification__WEBPACK_IMPORTED_MODULE_10__["default"], {
    screen: 'basic',
    details: ProfileDetails,
    id: chefIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"]
  }), keys === 2 && __jsx(_shared_email_UserEmail__WEBPACK_IMPORTED_MODULE_27__["default"], {
    screen: 'basic',
    chefDetails: ProfileDetails,
    chefId: chefIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"]
  }), keys === 3 && __jsx(_components_Location__WEBPACK_IMPORTED_MODULE_16__["default"], {
    chefDetails: ProfileDetails,
    chefId: chefIdValue,
    role: _utils_UserType__WEBPACK_IMPORTED_MODULE_31__["chef"]
  }), keys === 4 && __jsx(_shared_chef_profile_pricing_page_PriceCalculator__WEBPACK_IMPORTED_MODULE_26__["default"], {
    ProfileDetails: ProfileDetails,
    chefId: chefIdValue
  }), keys === 5 && __jsx(_shared_chef_profile_base_rate_BaseRate_Screen__WEBPACK_IMPORTED_MODULE_18__["default"], {
    chefDetails: ProfileDetails,
    chefId: chefIdValue
  }), keys === 6 && __jsx(_shared_chef_profile_chef_preference_ChefPreference__WEBPACK_IMPORTED_MODULE_19__["default"], {
    chefDetails: ProfileDetails,
    chefId: chefIdValue
  }), keys === 7 && __jsx(_shared_chef_profile_complexity_Complexity_Screen__WEBPACK_IMPORTED_MODULE_39__["default"], {
    isFromRegister: isFromRegister,
    chefId: chefIdValue
  }), keys === 8 && __jsx(_components_Specialization__WEBPACK_IMPORTED_MODULE_12__["default"], {
    isFromRegister: isFromRegister,
    chefDetails: ProfileDetails,
    chefId: chefIdValue
  }), keys === 9 && __jsx(_shared_chef_profile_personal_info_PersonalInformation_Screen__WEBPACK_IMPORTED_MODULE_40__["default"], {
    chefId: chefIdValue
  }), keys === 10 && __jsx(_components_availability_Availability__WEBPACK_IMPORTED_MODULE_13__["default"], {
    chefId: chefIdValue
  }), keys === 11 && __jsx(_shared_chef_profile_image_gallery_ImageGallery__WEBPACK_IMPORTED_MODULE_20__["default"], {
    chefId: chefIdValue
  }), keys === 12 && __jsx(_components_UploadFile__WEBPACK_IMPORTED_MODULE_14__["default"], {
    chefId: chefIdValue
  })))))), removeModal === true && __jsx("div", {
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
  }, "Ok"), __jsx(next_link__WEBPACK_IMPORTED_MODULE_29___default.a, {
    href: "#"
  }, __jsx("a", {
    onClick: function onClick() {
      return onCloseModal();
    },
    className: "bts-popup-close"
  }))))), roleType !== 'Admin' && __jsx(_shared_layout_Footer__WEBPACK_IMPORTED_MODULE_8__["default"], null));
};

/* harmony default export */ __webpack_exports__["default"] = (ProfileSetupScreen);

/***/ })

})
//# sourceMappingURL=profile-setup.js.0375167124806346e0ae.hot-update.js.map