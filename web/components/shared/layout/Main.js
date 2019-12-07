import Navbar from './Navbar';
import Footer from './Footer';
import { AppProvider } from '../../../context/appContext';
export default ({ children }) => (
  <div>
    <AppProvider>
      <Navbar />
      {children}
      <Footer />
    </AppProvider>
  </div>
);
