import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToBookongDetail(props) {
  // console.log('NavigateToBookongDetail', props);
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}