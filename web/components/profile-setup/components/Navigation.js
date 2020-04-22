import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToRequest() {
  Router.push({
    pathname: '/booking-request',
  });
}
//Navigate to home
export function NavigateToHome() {
  Router.push({
    pathname: n.HOME,
  });
}

export function NavigateToChangePassword(){
  Router.push({
    pathname: n.CHANGE_PASSWORD,
  })
}