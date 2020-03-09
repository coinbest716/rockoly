import Router from 'next/router';
import n from '../../../routings/routings';

export const SignupToChef = () => {
  Router.push({
    pathname: n.PROFILE,
    query: { fromRegister: true },
  });

  // Router.push(n.PROFILE,
  //     query: { keyword: 'this way' },);
};

export const SignupToCustomer = () => {
  Router.push({
    pathname: n.HOME,
  });

  // Router.push(n.PROFILE,
  //     query: { keyword: 'this way' },);
};

export const SharedProfile = () => {
  Router.push({
    pathname: n.SHARED_PROFILE,
  });

  // Router.push(n.PROFILE,
  //     query: { keyword: 'this way' },);
};
