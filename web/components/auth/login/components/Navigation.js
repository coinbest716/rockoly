import Router from 'next/router';
import n from '../../../routings/routings';

export const loginTo = () => {
  return Router.push(n.HOME);
};

export function NavigateToChefDetail(props) {
  Router.push({
    pathname: n.CHEF_DETAIL,
    query: props,
  });
}

export const loginToAdmin = () => {
  Router.push({
    pathname: n.PROFILE,
  });
};

export const SharedProfile = () => {
  Router.push({
    pathname: n.SHARED_PROFILE,
  });
};

export const ChefList = () => {
  Router.push({
    pathname: n.CHEF_LIST,
  });
};

export const loginPage = () => {
  Router.push({
    pathname: n.LOGIN,
  });
};
