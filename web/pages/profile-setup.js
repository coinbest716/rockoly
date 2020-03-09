import React,{useEffect} from 'react';
import { useRouter } from 'next/router';
import { withApollo } from '../apollo/apollo';
import ProfileSetupScreen from '../components/profile-setup/ProfileSetup.Screen';

const Profile = () => {

  const router = useRouter();
  let fromRegister = router.query.fromRegister ? true : false;
  let key = router.query.key ? router.query.key : 0;
  return (
    <div>
      {/* <SharedProfile fromRegister={fromRegister} keyValue={key} /> */}
      <ProfileSetupScreen fromRegister={fromRegister} keyValue={key} />
    </div>
  );
};

export default withApollo(Profile);
