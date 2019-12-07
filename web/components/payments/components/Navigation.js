import Router from 'next/router';
import n from '../../routings/routings';

//Naviagate to card detail page
export function NavigateToCardDetail(props) {
  Router.push({
    pathname: n.CARD_DETAIL,
    query: props,
  });
}

//Naviagate to Add card page
export function NavigateToAddCard() {
  Router.push({
    pathname: n.ADD_CARD,
  });
}

//Naviagate to Chef Add card page
export function NavigateToChefAddCard() {
  Router.push({
    pathname: n.CHEF_ADD_CARD,
  });
}

//Naviagate to Back page
export function Back() {
  Router.back();
}

//Naviagate to payment page
export function paymentPage() {
  Router.push({
    pathname: n.PAYMENTS,
  });
}
