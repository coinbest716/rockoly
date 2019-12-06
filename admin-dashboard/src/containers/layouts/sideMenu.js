/** @format */

import React, {Component} from 'react'
import {Layout, Menu} from 'antd'
import {Link, withRouter} from 'react-router-dom'
import Styles from './styles'
import Strings from './labels'
import n from '../routes/routesNames'
import CommonLables from '../common/commonLabel'
import ProfileView from './profileView'

const {Sider} = Layout
const menuItems = [
  {
    name: CommonLables.DASHBOARD,
    value: n.DASHBOARD,
    route: n.DASHBOARD,
  },
  {
    name: CommonLables.CUSTOMERMANAGEMENT,
    value: n.CUSTOMERMANAGEMENT,
    route: n.CUSTOMERMANAGEMENT,
  },
  {
    name: CommonLables.CHEFMANAGEMENT,
    value: n.CHEFMANAGEMENT,
    route: n.CHEFMANAGEMENT,
  },
  {
    name: CommonLables.BOOKINGHISTORY,
    value: n.BOOKINGHISTORY,
    route: n.BOOKINGHISTORY,
  },
  {
    name: CommonLables.COMMISSIONMANAGEMENT,
    value: n.COMMISSIONMANAGEMENT,
    route: n.COMMISSIONMANAGEMENT,
  },
  {
    name: CommonLables.REVIEWSRATINGS,
    value: n.REVIEWSRATINGS,
    route: n.REVIEWSRATINGS,
  },
  {
    name: CommonLables.CUISINES_DISHES,
    value: n.CUISINES_DISHES,
    route: n.CUISINES_DISHES,
  },
  {
    name: CommonLables.SETTINGS,
    value: n.SETTINGS,
    route: n.SETTINGS,
  },
  // {
  //   name: CommonLables.PROFILEMANAGEMENT,
  //   value: 7,
  //   route: n.PROFILEMANAGEMENT,
  // },
  // {
  //   name: CommonLables.FEEDBACK,
  //   value: 7,
  //   route: n.FEEDBACK,
  // },
]

export class SideMenu extends Component {
  render() {
    return (
      <Sider>
        <Menu
          mode={Strings.MENU_MODE}
          selectedKeys={
            this.props.location.pathname === n.CHEFDETAIL
              ? n.CHEFMANAGEMENT
              : this.props.location.pathname === n.CUSTOMERDETAIL
              ? n.CUSTOMERMANAGEMENT
              : this.props.location.pathname === n.BOOKINGDETAILS
              ? n.BOOKINGHISTORY
              : this.props.location.pathname
          }
          style={Styles.menuStyle}>
          <ProfileView />
          {menuItems.map(element => (
            <Menu.Item key={element.value}>
              <Link to={element.route}>
                <div style={Styles.sideMenuContent}>
                  <span style={Styles.sideMenuText}>{element.name}</span>
                </div>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    )
  }
}
export default withRouter(SideMenu)
