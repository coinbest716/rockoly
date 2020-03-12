/** @format */

import React, {Component} from 'react'
import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import PublicLayout from '../layouts/publicLayout'
import PrivateLayout from '../layouts/privateLayout'
import n from './routesNames'
import Login from '../login/login'
import Dashboard from '../dashboard/dashboard'
import CustomerManagement from '../customerManagement/customerManagement'
import ChefManagement from '../chefManagement/chefManagement'
import BookingHistory from '../bookingHistory/bookingHistory'
import CommissionManagement from '../commissionManagement/commissionManagement'
import ReviewsRatings from '../reviewsRatings/reviewsRatings'
import ProfileManagement from '../profileManagement/profileManagement'
import Feedback from '../feedback/feedback'
import Registration from '../registration/registration'
import ChefDetail from '../userDetails/chefDetail'
import CustomerDetail from '../userDetails/customerDetail'
import ReviewDetail from '../reviewDetails/reviewDetail'
import BookingDetails from '../bookingDetails/bookingDetails'
import TestSample from '../test/testSample'
import CuisinesAndDishes from '../cuisinesAndDishes/cuisinesAndDishes'
import ExtraService from '../extraService/extraService'
import Settings from '../settings/settings'

function PublicView(props) {
  return <PublicLayout screen={props} />
}

function PrivateView(props) {
  return <PrivateLayout screen={props} />
}

//TODO: @suren add method to check whether user is logged in and redirect to dashboard
const history = createBrowserHistory()

export class Routes extends Component {
  componentDidMount() {
    const path = (/#!(\/.*)$/.exec(window.location.hash) || [])[1]
    if (path) {
      history.replace(path)
    }
  }
  componentWillReceiveProps() {
    console.log('jymfghfjgghf', window.location.hash)
  }
  render() {
    return (
      <Router basename={'/admin'} history={history}>
        <Switch>
          <PublicView exact path={n.START} component={Login} />
          <PrivateView exact path={n.DASHBOARD} component={Dashboard} />
          <PrivateView exact path={n.CUSTOMERMANAGEMENT} component={CustomerManagement} />
          <PrivateView exact path={n.CHEFMANAGEMENT} component={ChefManagement} />
          <PrivateView exact path={n.BOOKINGHISTORY} component={BookingHistory} />
          <PrivateView exact path={n.COMMISSIONMANAGEMENT} component={CommissionManagement} />
          <PrivateView exact path={n.REVIEWSRATINGS} component={ReviewsRatings} />
          <PrivateView exact path={n.PROFILEMANAGEMENT} component={ProfileManagement} />
          <PrivateView exact path={n.FEEDBACK} component={Feedback} />
          <PrivateView exact path={n.REGISTRATION} component={Registration} />
          <PrivateView exact path={n.CHEFDETAIL} component={ChefDetail} />
          <PrivateView exact path={n.CUSTOMERDETAIL} component={CustomerDetail} />
          <PrivateView exact path={n.REVIEWDETAIL} component={ReviewDetail} />
          <PrivateView exact path={n.BOOKINGDETAILS} component={BookingDetails} />
          <PrivateView exact path={n.TESTSAMPLE} component={TestSample} />
          <PrivateView exact path={n.CUISINES_DISHES} component={CuisinesAndDishes} />
          <PrivateView exact path={n.EXTRA_SERVICE} component={ExtraService} />
          <PrivateView exact path={n.SETTINGS} component={Settings} />
        </Switch>
      </Router>
    )
  }
}

// connect to props to user auth related data
export default Routes
