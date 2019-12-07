import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToBookingDetail(props) {
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}

export function NavigateToChatList(props){
  Router.push({
    pathname: n.CHAT,
    query: props,
  });
}
