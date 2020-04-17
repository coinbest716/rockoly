import '../assets/styles/bootstrap.min.css';
import '../assets/styles/fontawesome.min.css';
import '../assets/styles/responsive.scss';
import '../assets/styles/animate.min.css';
import '../assets/styles/slick.css';
import '../assets/styles/slick-theme.css';
import '../assets/styles/style.scss';
import '../assets/styles/custom.scss';
import '../components/home-page/HomePage.Style.scss';
import '../components/contact-us/Contact.Style.scss';
import '../components/auth/Auth.Style.scss';
import '../components/shared-profile/Sharedprofile.Style.scss';
import '../components/booking-request/BookingRequest.Style.scss';
import '../components/booking-history/BookingHistory.Style.scss';
import '../components/booking-detail/BookingDetail.Style.scss';
import '../components/shared/layout/Layout.scss';
import '../components/settings/Settings.Style.scss';
import '../components/feedback/Feedback.Style.scss';
import '../components/payment-history/PaymentHistory.Style.scss';
import '../components/about-us/AboutUs.Style.scss';
import '../components/profile-setup/ProfileSetup.Style.scss';
import '../components/chef-list/ChefList.Style.scss';
import '../components/favorite-chef/FavoriteChef.Style.scss';
import '../components/payments/Payments.Style.scss';
import '../components/shared/modal/Modal.Style.scss';
import '../components/chef-detail/ChefDetail.Style.scss';
import '../components/notification/Notification.Style.scss';
import '../components/intro/IntroPage.Style.scss';
import '../components/shared/mobile-number-verification/VerificationStyle.scss';
import '../components/shared/chef-profile/pricing-page/PriceCalculator.scss';
import '../components/terms-and-conditions/TermsConditions.Styles.scss';
import '../components/privacy-policy/PrivacyPolicy.Styles.scss';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { initStore } from '../store/reducers/index';
import { DefaultSeo } from 'next-seo';
import GoTop from '../components/shared/go-top/GoTop';
import getConfig from 'next/config';
import { AppProvider } from '../context/appContext';
import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();
const { MAPAPIKEY } = publicRuntimeConfig;

const mapKey = `https://maps.googleapis.com/maps/api/js?key=${MAPAPIKEY}&libraries=places`;

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      return {
        pageProps: Component.getInitialProps ? await Component.getInitialProps(ctx) : {},
      };
    }

    render() {
      const { Component, pageProps, store } = this.props;

      return (
        <Container>
          <script type="text/javascript" src={mapKey} />
          <script type="text/javascript" id="stripe-js" src="https://js.stripe.com/v3/" async />
          <DefaultSeo
            title="Rockoly"
            description="Book a Cook"
            openGraph={{
              type: 'website',
              locale: 'en_IE',
              url: 'https://nextland-react.envytheme.com/',
              site_name: 'Rockoly - Find your chef',
            }}
          />
          {/* <Provider store={store}>
            <Component {...pageProps} />
          </Provider> */}
          {/* @shanmugapriya: @naaziya: pls check this provider */}
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
          <GoTop scrollStepInPx="50" delayInMs="16.66" />
        </Container>
      );
    }
  }
);
