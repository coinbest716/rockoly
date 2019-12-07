import React, { useContext } from 'react';
import HomePageScreen from '../components/home-page/HomePage.Screen';
import { withApollo } from '../apollo/apollo';

// @shanmugapriya: @naaziya: pls check this provider
import { AppContext } from '../context/appContext';

const HomePage = () => {
  // @shanmugapriya: @naaziya: pls check this provider
  const [state, setState] = useContext(AppContext);

  return (
    <React.Fragment>
      {/* @shanmugapriya: @naaziya: pls check this provider */}
      {/* {state.role ? state.role : '11111111111'}
      {state.customerId ? state.customerId : '22222222222'}
      {state.chefId ? state.chefId : '33333333'}
      {state.chefProfile ? <p>{JSON.stringify(state.chefProfile)}</p> : 'chefProfile'}
      {state.customerProfile ? <p>{JSON.stringify(state.customerProfile)}</p> : 'customerProfile'} */}
      <HomePageScreen />
    </React.Fragment>
  );
};
export default withApollo(HomePage);
