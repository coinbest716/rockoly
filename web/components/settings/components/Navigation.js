import Router from 'next/router';
import n from '../../routings/routings';

//Navigate to profile
export function NavigateToProfileSetup(props) {
  Router.push({
    pathname: n.PROFILE,
    query: props,
  });
}

//Navigate to homeNavigateToBookingRequest
export function NavigateToHome() {
  Router.push({
    pathname: n.HOME,
  });
}

export function NavigateToBookingRequest() {
  Router.push({
    pathname: n.BOOKING_REQUEST,
  });
}

//Navigate to home
export function NavigateToIntro() {
  Router.push({
    pathname: n.INTRO,
  });
}
