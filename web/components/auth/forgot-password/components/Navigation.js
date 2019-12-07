import Router from 'next/router';
import n from '../../../routings/routings';

export const loginPage = () => {
  Router.push({
    pathname: n.LOGIN,
  });
};
