import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import LoginView from './LoginView';
import MainSelection from './MainSelection';
import type { User } from './utils/models';
import { showLoader } from './utils/Loader';

const DraggableSlate = React.lazy(() => import('./DraggableSlate'));
const ForeclosureListings = React.lazy(() => import('./ForeclosureListings'));
const RentalManagment = React.lazy(() => import('./RentalManagment'));

// Define types for global props
export const setToast = toast

// Define Redux state type
interface RootState {
  user: User; // Replace `any` with the actual type of your user state
}

// Map state to props
const mapStateToProps = (state: RootState) => ({
  user: state.user,
});

// Create a connector for TypeScript
const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Router: React.FC<PropsFromRedux> = ({ user }) => {
  useEffect(() => {
    showLoader(false)
    import('./DraggableSlate')
    import('./ForeclosureListings')
    import('./RentalManagment')
  }, [])
  const protectedRoutes = (
    <>
      <Route path="/" element={<MainSelection />} />
      <Route path="/foreclosure-listings" element={<ForeclosureListings />} />
      <Route path="/rental-mgmt" element={<RentalManagment />} />
    </>
  );

  const loginView = <LoginView />;

  return (
    <BrowserRouter>
      <Toaster containerClassName="toaster-container" position="bottom-right" />
      <DraggableSlate />
      <Routes>
        <Route path="/signin" element={loginView} />
        {user ? protectedRoutes : <Route path="*" element={loginView} />}
      </Routes>
    </BrowserRouter>
  );
};

export default connector(Router);
