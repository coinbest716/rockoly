import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import signupReducer from './auth/signupReducer';
import loginReducer from './auth/loginReducer';
import socialAuthReducer from './auth/socialAuthReducer';

const appReducer = combineReducers({
  SignupDetails: signupReducer,
  Login: loginReducer,
  SocialAuthDetails: socialAuthReducer,
});

export const initStore = () => {
  return createStore(appReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));
};
