import Router from 'next/router';
import n from '../../../routings/routings';

export function NavigateToProfile(props) {
  // console.log('NavigateToBookongDetail', props);
  Router.push({
    pathname: n.PROFILE,
    query: props,
  });
}