import React, { useState } from 'react';
import Link from 'next/link';
import { profileSetupMenu } from '../../profile-setup/components/SiderOptions';
import {profileSetupCustomerMenu} from '../../profile-setup/components/CustomerSiderOptions';
import Styles from './LeftSidebar.Styles';
import { toastMessage } from '../../../utils/Toast';

const LeftSidebar = (props) =>{
  const [currentSelection,setCurrentSelection] = useState(false);
  const [selectedMenu,setSelectedMenu] = useState(parseInt(props.selectedMenuKey));

  function onChangeMenuItem(res){
    if (props.onChangeMenu) {
      setSelectedMenu(res.key);
      props.onChangeMenu(res.key);
    }
  };
  //  console.log("selectedMenuKey",props.selectedMenuKey);
    try {
      return (
        <div>
          {profileSetupMenu && props.role!=="customer" &&
            profileSetupMenu.map((res, index) => {
              return (
                <div key={res.key}>
                  <div className="woocommerce-sidebar-area">
                    
                    <div
                      className={`collapse-widget filter-list-widget ${
                        currentSelection ? '' : 'open'
                      }`}
                    >
                      <h3
                        className={`collapse-widget-title ${currentSelection ? '' : 'active'}`}
                        onClick={() => onChangeMenuItem(res)}
                      >
                        <div
                          className="card"
                          style={
                            selectedMenu === index
                              ? Styles.selectedMenuStyle
                              : Styles.unselectedMenuStyle
                          }
                        >
                          <div className="card-body">{res.title}</div>
                        </div>
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
            {props.role==="customer" && profileSetupCustomerMenu &&
            profileSetupCustomerMenu.map((res, index) => {
              return (
                <div key={res.key}>
                  <div className="woocommerce-sidebar-area">
                    
                    <div
                      className={`collapse-widget filter-list-widget ${
                        currentSelection ? '' : 'open'
                      }`}
                    >
                      <h3
                        className={`collapse-widget-title ${currentSelection ? '' : 'active'}`}
                        onClick={() => onChangeMenuItem(res)}
                      >
                        <div
                          className="card"
                          style={
                            selectedMenu === index
                              ? Styles.selectedMenuStyle
                              : Styles.unselectedMenuStyle
                          }
                        >
                          <div className="card-body">{res.title}</div>
                        </div>
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      );
    } catch (error) {
      const errorMessage = error.message;
      toastMessage('renderError', errorMessage);
    }
}

export default LeftSidebar;
