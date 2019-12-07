import Router from 'next/router';
import n from '../../routings/routings';

//Navigate to feedback screen
export function NavigateToFeedbackPage(props) {
  Router.push({
    pathname: n.FEEDBACK,
    query: props,
  });
}
