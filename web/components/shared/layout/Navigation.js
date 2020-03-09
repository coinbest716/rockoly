import Router from 'next/router';
import n from '../../routings/routings';

//Navigate to profile
export function NavigateToProfileSetup(props) {
  Router.push({
    pathname: n.PROFILE,
    query: props,
  });
}

//Navigate to home
export function NavigateToHome() {
  Router.push({
    pathname: n.HOME,
  });
}

//Navigate to home NavigateToRequest
export function NavigateToIntro() {
  Router.push({
    pathname: n.INTRO,
  });
}

export function NavigateToRequest() {
  Router.push({
    pathname: '/booking-request',
  });
}

export function NavigateToRegisterScreen() {
  Router.push({
    pathname: '/shared-profile',
  });
}

export function NavigateToLogin() {
  Router.push({
    pathname: n.LOGIN,
  });
}
