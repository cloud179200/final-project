import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { RESPONSE_STATUS_UNAUTHORIZED } from '../../../utils/httpResponseCode';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import Cookies from 'js-cookie';
import { removeUserInfo } from '../../auth/redux/authReducer';

export function fetchThunk(
  url: string,
  method: 'get' | 'post' | 'delete' | 'put' = 'get',
  body?: object | FormData,
  auth = true,
  contentType?: 'multipart/form-data'|'application/json',
): ThunkAction<Promise<any>, AppState, null, Action<string>> {
  return async (dispatch, getState) => {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        method,
        // @ts-ignore
        body: typeof body === 'object' ? (contentType !== 'multipart/form-data' ? JSON.stringify(body) : body) : body,
        headers:
          contentType !== 'multipart/form-data'
            ? {
                'Content-Type': contentType || 'application/json',
                Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
              }
            : { Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '' },
        cache: 'no-store',
      });

      const json = await res.json();

      if (res.status === RESPONSE_STATUS_UNAUTHORIZED) {
        dispatch(removeUserInfo());
        // dispatch logout, remove access token here.
      }

      return json;
      // throw new Error('Error');
    } catch (e: any) {
      console.log(e);
    }
  };
}
