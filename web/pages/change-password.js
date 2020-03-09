import React, { useEffect } from 'react';
import { withApollo } from '../apollo/apollo';
import ChangePassword from '../components/auth/change-password/ChangePassword.screen';

const Index = () => {

    return <ChangePassword />;
  
}

export default withApollo(Index);