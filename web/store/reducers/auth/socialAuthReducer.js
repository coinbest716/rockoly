import {
  SOCIAL_AUTH_USER,
  SOCIAL_AUTH_USER_SUCCESS,
  SOCIAL_AUTH_USER_FAIL,
} from '../../actions/types';

const INITIAL_STATE = {
  socialAuthLoading: false,
  socialAuth: false,
  user: {},
  socialAuthError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SOCIAL_AUTH_USER:
      return { ...state, error: '', socialAuth: false, socialAuthLoading: true };
    case SOCIAL_AUTH_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        socialAuth: true,
        socialAuthLoading: false,
        user: action.payload,
      };
    case SOCIAL_AUTH_USER_FAIL:
      return {
        ...state,
        socialAuthLoading: false,
        socialAuth: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
