import {
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
} from '../../actions/types';

const INITIAL_STATE = {
  signupLoading: false,
  signup: false,
  user: {},
  signupError: '',
  forgotPasswordLoading: false,
  forgotPasswordStatus: false,
  forgotPasswordError: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNUP:
      return { ...state, error: '', signup: false, signupLoading: true };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        signup: true,
        signupLoading: false,
        user: action.payload,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        signupLoading: false,
        signup: false,
        error: action.payload,
      };
    case FORGOT_PASSWORD:
      return {
        ...state,
        forgotPasswordError: '',
        forgotPasswordStatus: false,
        forgotPasswordLoading: true,
      };
    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        forgotPasswordStatus: true,
        forgotPasswordLoading: false,
        user: action.payload,
      };
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordStatus: false,
        forgotPasswordError: action.payload,
      };
    default:
      return state;
  }
};
