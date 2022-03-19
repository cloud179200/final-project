import { useCallback, useEffect } from 'react';
import './App.css';
import { Routes } from './Routes';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from './utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from './redux/reducer';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchThunk } from './modules/common/redux/thunk';
import { API_PATHS } from './configs/api';
import { setUserInfo } from './modules/auth/redux/authReducer';
import { ROUTES } from './configs/routes';
import { replace } from 'connected-react-router';

function App() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user } = useSelector((state: AppState) => ({
    user: state.profile.user,
  }));

  const getProfile = useCallback(async () => {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

    if (accessToken && !user) {
      const json = await dispatch(fetchThunk(API_PATHS.profileDetail, "post", { id: 7126 }));
      if (!json?.error) {
        dispatch(setUserInfo({ ...json.user, token: accessToken }));
        dispatch(replace(ROUTES.pages))
      }
    }
  }, [dispatch, user]);
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  return (
    <>
      <Routes />

    </>
  );
}

export default App;
