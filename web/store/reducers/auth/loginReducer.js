import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOG_OUT_USER,
  LOG_OUT_USER_SUCCESS,
  LOG_OUR_USER_FAIL,
} from '../../actions/types';

const INITIAL_STATE = {
  loading: false,
  loggedin: false,
  user: {},
  loggedOut: false,
  logoutLoading: false,
  error: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, error: '', loggedin: false, loading: true };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        loggedin: true,
        loading: false,
        user: action.payload,
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        loading: false,
        loggedin: false,
        error: action.payload,
      };

    case LOG_OUT_USER:
      return { ...state, error: '', logoutLoading: true };
    case LOG_OUT_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        loggedOut: true,
        logoutLoading: false,
        error: '',
      };
    case LOG_OUR_USER_FAIL:
      return {
        ...state,
        logoutLoading: false,
        loggedOut: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
