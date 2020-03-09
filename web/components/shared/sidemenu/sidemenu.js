import React, { useState, useEffect } from 'react'
// import List from '@material-ui/core/List'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemText from '@material-ui/core/ListItemText'

const SideMenu = (props) => {

const [siderOptions, setSiderOptions] = useState([]);
useEffect(() => {
  setSiderOptions(props.options);
}, [props.options, siderOptions]);
//siderOptions : subItems,
return (
  <div style={{maxWidth : '240px',border : '1px solid rgba(0, 0, 0, 0.1)'}}>
    {/* <List disablePadding dense>
      {siderOptions && siderOptions.map((data, index,...rest) => {
        return (
          <ListItem style={{ paddingLeft: 18 }} key={index} button {...rest}>
            <ListItemText>{data.title}</ListItemText>
            {Array.isArray(subItems) ? (
              <List disablePadding>
                {subItems.map((subItem) => (
                  <ListItem key={subItem.title} button>
                    <ListItemText className="sidebar-item-text">
                      {subItem.title}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </ListItem>
        );
      })}
    </List> */}
  </div>
);
};
export default SideMenu;