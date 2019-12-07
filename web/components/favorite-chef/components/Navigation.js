import Router from 'next/router';
import n from '../../routings/routings';

export function NavigateToChefDetail(props) {
  Router.push({
    pathname: n.CHEF_DETAIL,
    query: props,
  });
}
