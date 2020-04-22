import React, { useState, useEffect, useContext } from 'react';
//TODO: Nested sidebar menu
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as gqlTag from '../../../common/gql';
import { toastMessage, renderError, success, error } from '../../../utils/Toast';
import { profileSetupMenu } from '../../profile-setup/components/SiderOptions';
import { profileSetupCustomerMenu } from '../../profile-setup/components/CustomerSiderOptions';
import Styles from './LeftSidebar.Styles';
import SideMenu from '../sidemenu/sidemenu';
import { firebase } from '../../../config/firebaseConfig';
import { AppContext } from '../../../context/appContext';
import * as util from '../../../utils/checkEmptycondition';
import {
  profileSetupChefNestedMenu,
  profileSetupCustomerNestedMenu,
  profileSetupChefNestedMenuKeys,
  profileSetupCustomerNestedMenuKeys,
} from '../../profile-setup/components/CustomerSiderOptions';

//TODO: Nested sidebar menu
const { SubMenu } = Menu;

//customer email update
const updateCustomerEmailData = gqlTag.mutation.customer.updateIsEmailVerifiedYnGQLTAG;
const UPDATE_CUSTOMER_EMAIL_INFO = gql`
  ${updateCustomerEmailData}
`;
//customer mobile update
const updateCustomerMobileData = gqlTag.mutation.customer.updateIsMobileNoVerifiedYnGQLTAG;
const UPDATE_CUSTOMER_MOBILE_INFO = gql`
  ${updateCustomerMobileData}
`;

//chef email update
const updateChefEmailData = gqlTag.mutation.chef.updateIsEmailVerifiedYnGQLTAG;
const UPDATE_CHEF_EMAIL_INFO = gql`
  ${updateChefEmailData}
`;

//chef mobile update
const updateChefMobileData = gqlTag.mutation.chef.updateIsMobileNoVerifiedYnGQLTAG;
const UPDATE_CHEF_MOBILE_INFO = gql`
  ${updateChefMobileData}
`;

const LeftSidebar = props => {
  //TODO: Nested sidebar menu
  // const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
  const [openKeys, setOpenKeys] = useState(['pk', 'psub1', 'psub1Menu1', 'psub1Menu1Nes1']);
  const [currentSelection, setCurrentSelection] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(parseInt(props.selectedMenuKey));
  const [mobileNumberVerified, setMobileNumberVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [menus, setMenu] = useState();
  const [menuKeys, setMenuKey] = useState();
  const [state, setState] = useContext(AppContext);


  function onChangeMenuItem(res) {
    if (props.onChangeMenu) {
      setSelectedMenu(res.key);
      props.onChangeMenu(res.key);
    }
  }

  //Customer email update
  const [updateCustomerEmailnfo, customerEmailData] = useMutation(UPDATE_CUSTOMER_EMAIL_INFO, {
    onCompleted: customerEmailData => {
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  //Customer mobile update
  const [updateCustomerMobileInfo, customerMobileData] = useMutation(UPDATE_CUSTOMER_MOBILE_INFO, {
    onCompleted: customerMobileData => {
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  //Chef email update
  const [updateChefEmailInfo, chefEmailData] = useMutation(UPDATE_CHEF_EMAIL_INFO, {
    onCompleted: chefEmailData => {
      //   toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  //Chef mobile update
  const [updateChefMobileInfo, chefMobileData] = useMutation(UPDATE_CHEF_MOBILE_INFO, {
    onCompleted: chefMobileData => {
      // toastMessage(success, s.SUCCESS_MSG);
    },
    onError: err => {
      toastMessage(error, err.message);
    },
  });

  //Check email and mobile number verified or not
  useEffect(() => {
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    if (firebase.auth().currentUser) {
      firebase.auth().currentUser.reload();
      let userData = firebase.auth().currentUser;

      if (userData.phoneNumber) {
        setMobileNumberVerified(true);
      }
      if (userData.emailVerified) {
        setEmailVerified(true);
      }
    }
    //   }
    // });
  });

  //Check user email and mobile data
  useEffect(() => {
    if (
      (util.isObjectEmpty(state) && util.isObjectEmpty(state.customerProfile)) ||
      (util.isObjectEmpty(state) && util.isObjectEmpty(state.chefProfile))
    ) {
      if (props.role === 'customer') {
        //For email check
        if (state.customerProfile.isEmailVerifiedYn === false && emailVerified === true) {
          let variables = {
            customerId: state.customerProfile.customerId,
            isEmailVerifiedYn: true,
          };
          updateCustomerEmailnfo({ variables });
        }
        //For mobile check
        if (state.customerProfile.isMobileNoVerifiedYn === false && mobileNumberVerified === true) {
          let variables = {
            customerId: state.customerProfile.customerId,
            isMobileNoVerifiedYn: true,
          };
          updateCustomerMobileInfo({ variables });
        }
        setMenu(profileSetupCustomerNestedMenu);
        setMenuKey(profileSetupCustomerNestedMenuKeys);
      } else if (props.role === 'chef') {
        //For email check
        if (state.chefProfile.isEmailVerifiedYn === false && emailVerified === true) {
          let variables = {
            chefId: state.chefProfile.chefId,
            isEmailVerifiedYn: true,
          };
          updateChefEmailInfo({ variables });
        }
        //For mobile check
        if (state.chefProfile.isMobileNoVerifiedYn === false && mobileNumberVerified === true) {
          let variables = {
            chefId: state.chefProfile.chefId,
            isMobileNoVerifiedYn: true,
          };
          updateChefMobileInfo({ variables });
        }
        setMenu(profileSetupChefNestedMenu);
        setMenuKey(profileSetupChefNestedMenuKeys);
      }
    }
  }, [state, emailVerified, mobileNumberVerified]);

  //TODO: Nested sidebar menu
  // function onOpenChange(openKeysData) {
  //   const latestOpenKey = openKeysData.find(key => openKeys.indexOf(key) === -1);

  //   if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenKeys(openKeysData);
  //   } else {
  //     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // }

  function onMenuItemChange(e) {
    let latestOpenKey = menuKeys.find(item => item.key === e.key);
    if (latestOpenKey) {
      latestOpenKey = latestOpenKey.index;
      setSelectedMenu(latestOpenKey);
      props.onChangeMenu(latestOpenKey);
    }
  }

  function onOpenChange(openKeys) {
    // const latestOpenKey = openKeys.find(key => openKeys.indexOf(key) === -1);
    console.log('latestOpenKey', openKeys);
    // if (menuKeys.indexOf(latestOpenKey) === -1) {
    //   this.setState({ openKeys });
    // } else {
    //   this.setState({
    //     openKeys: latestOpenKey ? [latestOpenKey] : [],
    //   });
    // }
  }

  try {
    return (
      //TODO: Nested sidebar menu
      // <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange}>
      //   <SubMenu
      //     key="sub1"
      //     title={
      //       <span>
      //         <span>Navigation One</span>
      //       </span>
      //     }
      //   >
      //     <Menu.Item key="1">Option 1</Menu.Item>
      //     <Menu.Item key="2">Option 2</Menu.Item>
      //     <Menu.Item key="3">Option 3</Menu.Item>
      //     <Menu.Item key="4">Option 4</Menu.Item>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub2"
      //     title={
      //       <span>
      //         <span>Navigation Two</span>
      //       </span>
      //     }
      //   >
      //     <Menu.Item key="5">Option 5</Menu.Item>
      //     <Menu.Item key="6">Option 6</Menu.Item>
      //     <SubMenu key="sub3" title="Submenu">
      //       <Menu.Item key="7">Option 7</Menu.Item>
      //       <Menu.Item key="8">Option 8</Menu.Item>
      //     </SubMenu>
      //   </SubMenu>
      //   <SubMenu
      //     key="sub4"
      //     title={
      //       <span>
      //         <span>Navigation Three</span>
      //       </span>
      //     }
      //   >
      //     <Menu.Item key="9">Option 9</Menu.Item>
      //     <Menu.Item key="10">Option 10</Menu.Item>
      //     <Menu.Item key="11">Option 11</Menu.Item>
      //     <Menu.Item key="12">Option 12</Menu.Item>
      //   </SubMenu>
      // </Menu>
      <div>
        {console.log("propssssssssss", props)}
        {props.role == 'chef' &&
          <Menu mode="inline" defaultOpenKeys={openKeys} defaultSelectedKeys={openKeys}>
            {menus &&
              menus.map((sub, subIndex) => {
                return (
                  <SubMenu key={sub.key} title={sub.title}>
                    {sub.subMenu.map((subMenu, subNMnuIndex) => {
                      if (!subMenu.hasOwnProperty('subMenuItem')) {
                        return (
                          <Menu.Item key={subMenu.key} onClick={onMenuItemChange}>
                            {subMenu.title}
                          </Menu.Item>
                        );
                      } else {
                        return (
                          <SubMenu key={subMenu.key} title={subMenu.title}>
                            {subMenu.subMenuItem.map((nestedMenu, nestIndex) => {
                              if (!nestedMenu.hasOwnProperty('nestedMenu')) {
                                return (
                                  <Menu.Item key={nestedMenu.key} onClick={onMenuItemChange}>
                                    {nestedMenu.title}
                                  </Menu.Item>
                                );
                              } else {
                                return (
                                  <SubMenu key={nestedMenu.key} title={nestedMenu.title}>
                                    {nestedMenu.nestedMenu.nestedMenuItem.map((menu, index) => {
                                      return (
                                        <Menu.Item key={menu.key} onClick={onMenuItemChange}>
                                          {menu.title}
                                        </Menu.Item>
                                      );
                                    })}
                                  </SubMenu>
                                );
                              }
                            })}
                          </SubMenu>
                        );
                      }
                    })}
                  </SubMenu>
                );
              })}
          </Menu>
        }
        {props.role === 'customer' &&
          <Menu mode="inline" defaultOpenKeys={openKeys} defaultSelectedKeys={openKeys}>
            {menus &&
              menus.map((sub, subIndex) => {
                return (
                  <SubMenu key={sub.key} title={sub.title}>
                    {sub.subMenu.map((subMenu, subNMnuIndex) => {
                      if (!subMenu.hasOwnProperty('subMenuItem')) {
                        return (
                          <Menu.Item key={subMenu.key} onClick={onMenuItemChange}>
                            {subMenu.title}
                          </Menu.Item>
                        );
                      } else {
                        return (
                          <SubMenu key={subMenu.key} title={subMenu.title}>
                            {subMenu.subMenuItem.map((nestedMenu, nestIndex) => {
                              if (!nestedMenu.hasOwnProperty('nestedMenu')) {
                                return (
                                  <Menu.Item key={nestedMenu.key} onClick={onMenuItemChange}>
                                    {nestedMenu.title}
                                  </Menu.Item>
                                );
                              } else {
                                return (
                                  <SubMenu key={nestedMenu.key} title={nestedMenu.title}>
                                    {nestedMenu.nestedMenu.nestedMenuItem.map((menu, index) => {
                                      return (
                                        <Menu.Item key={menu.key} onClick={onMenuItemChange}>
                                          {menu.title}
                                        </Menu.Item>
                                      );
                                    })}
                                  </SubMenu>
                                );
                              }
                            })}
                          </SubMenu>
                        );
                      }
                    })}
                  </SubMenu>
                );
              })}
          </Menu>
        }
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};

export default LeftSidebar;
