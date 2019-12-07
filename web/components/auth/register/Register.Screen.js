import React from 'react';
// import { useRouter } from 'next/router';
import Page from '../../shared/layout/Main';
import RegisterForm from './components/RegisterForm';
// import UserTypeModal from '../../shared/modal/UserType.Modal';

export default function Register() {
  // const router = useRouter();
  // const [chefLoggedin, setChefLoggedin] = useState(null);
  // const [userType, setuserType] = useState(null);

  // function onSelectUserType(value, userType) {
  //   //if nothing is selected in user type modal redirect to previous page
  //   if (value === null) {
  //     router.back();
  //   }
  //   //if any user type is selected
  //   else {
  //     setChefLoggedin(value);
  //     setuserType(userType);
  //   }
  // }

  return (
    <div>
      <Page>
        <div className="auth">
          <section className="cart-area ptb-60">
            <div className="cart-totals">
              {/* <UserTypeModal onSelectUserType={onSelectUserType} /> */}
              <RegisterForm
              // chefLoggedin={{ chefLoggedin, userType }}
              />
            </div>
          </section>
        </div>
      </Page>
    </div>
  );
}
