import React, { useContext } from 'react';
import { toastMessage } from '../utils/Toast';
import SharedProfilePage from '../components/shared-profile/Sharedprofile.Screen';
import { withApollo } from '../apollo/apollo';

import { AppContext } from '../context/appContext';

const SharedProfile = () => {
  const [state, setState] = useContext(AppContext);

  return (
    <React.Fragment>
      <SharedProfilePage />
    </React.Fragment>
  );
};
export default withApollo(SharedProfile);
