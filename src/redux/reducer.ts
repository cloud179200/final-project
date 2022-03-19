import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';
import dataReducer, { DataState } from '../modules/common/redux/dataReducer';
import notificationReducer, { NotificationState } from '../modules/common/redux/notificationReducer';
import intlReducer, { IntlState } from '../modules/intl/redux/intlReducer';
import productReducer, { ProductState } from '../modules/product/redux/productReducer';
import userReducer, { UserState } from '../modules/user/redux/userReducer';

export interface AppState {
  router: RouterState;
  intl: IntlState;
  profile: AuthState;
  data: DataState;
  product: ProductState;
  user:UserState;
  notification: NotificationState;
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    intl: intlReducer,
    profile: authReducer,
    data: dataReducer,
    user: userReducer,
    product: productReducer,
    notification: notificationReducer
  });
}
