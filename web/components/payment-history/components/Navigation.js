import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToBookongDetail(props) {
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}
