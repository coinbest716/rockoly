import n from '../../../routings/routings';

export const menuOptions = [
  {
    title: 'Home',
    routing: n.HOME,
    keyName: 'home_page',
    isChef: true,
    isCustomer: true,
    isCommon: true,
    // isChef: true,
  },
  {
    title: 'Bookings',
    routing: n.BOOKING_HISTORY,
    isChef: true,
    keyName: 'booking_history',
    subMenu: [
      {
        title: 'Booking',
        routing: n.BOOKING_REQUEST,
      },
      {
        title: 'Booking History',
        routing: n.BOOKING_HISTORY,
      },
    ],
  },
  {
    title: 'Find Chef',
    routing: n.CHEF_LIST,
    isCustomer: true,
    keyName: 'chef_list',
    isCommon: true,
  },
  {
    title: 'Booking History',
    routing: n.BOOKING_HISTORY,
    isCustomer: true,
    keyName: 'booking_history',
  },
  {
    title: 'Payments',
    routing: n.PAYMENT_HISTORY,
    isChef: true,
    isCustomer: true,
    keyName: 'payments',
  },
  // {
  //   title: 'Favorite Chefs',
  //   routing: n.FAVORITE_CHEFS_LIST,
  //   isChef: true,
  //   keyName: 'favorite_chefs',
  // },
  {
    title: 'About us',
    routing: n.ABOUT_US,
    keyName: 'about_us',
    isChef: true,
    isCustomer: true,
    isCommon: true,
  },
  {
    title: 'Inbox',
    routing: n.CHAT,
    keyName: 'chat',
    isChef: true,
    isCustomer: true,
  },
  // {
  //   title: 'Contact Us',
  //   routing: n.CONTACT_US,
  //   keyName: 'contact_us',
  //   isChef: true,
  //   isCustomer: true,
  //   isCommon: true,
  // },
];

export const rightSideMenuOptions = [
  {
    title: 'Register',
    routing: n.SIGNUP,
    key: 10,
    keyName: 'register',
  },
  {
    title: 'Login',
    routing: n.LOGIN,
    key: 11,
    keyName: 'login',
  },
];
