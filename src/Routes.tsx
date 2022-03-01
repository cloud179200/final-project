import { Modal, Box, CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import AuthRoute from './modules/common/components/AuthRoute';
import ProtectedRoute from './modules/common/components/ProtectedRoute';

const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));
const Pages = lazy(() => import('./modules/common/pages/Pages'))

const theme = createTheme({
  palette: {
      primary: {
          light: "#B18AFF",
          main: "#323259",
          dark: "#1B1B37",
          contrastText: "white"
      },
      secondary: {
          main: '#7560B1',
      },
  },
});
export const Routes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<Modal open={true}><Box sx={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><CircularProgress color='info' /></Box></Modal>}>
      <Switch location={location}>
        <AuthRoute path={ROUTES.login} component={LoginPage} />
        <ThemeProvider theme={theme}>
          <ProtectedRoute path={ROUTES.pages} component={Pages} />
        </ThemeProvider>
        <AuthRoute path="/" component={LoginPage} />
      </Switch>
    </Suspense>
  );
};
