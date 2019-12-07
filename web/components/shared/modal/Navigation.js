import Router from 'next/router';
import n from '../../routings/routings';

//Navigate to feedback screen
export function NavigateToFeedbackPage(props) {
  Router.push({
    pathname: n.FEEDBACK,
    query: props,
  });
}

//Navigate to login screen
export function NavigateToLoginPage(props) {
  Router.push({
    pathname: n.LOGIN,
    query: props,
  });
}

//Navigate to booking detail screen
export function NavigateToBookongDetail(props) {
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}
