import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToBookongDetail(props) {
  Router.push({
    pathname: n.BOOKING_DETAIL,
    query: props,
  });
}
//Navigate to feedback screen
export function NavigateToFeedbackPage(props) {
  Router.push({
    pathname: n.FEEDBACK,
    query: props,
  });
}

//Navigate to chat
export function NavigateToChatPage(props) {
  Router.push({
    pathname: n.CHAT,
    query: props,
  });
}
