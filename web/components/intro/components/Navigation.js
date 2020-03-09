import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToBookongDetail(props) {
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}

//Navigate to home
export function NavigateToHome() {
  Router.push({
    pathname: n.HOME,
  });
}
