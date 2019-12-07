import Router from 'next/router';
import n from '../routings/routings';

export function NavigateToChefList(props,latitude,longtitude) {
  Router.push({
    pathname: n.CHEF_LIST,
    query: props,latitude,longtitude
  });
}