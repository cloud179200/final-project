import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { INotification, INotificationAnchorOrigin } from '../../../models/notification';

export interface NotificationState {
  notifications: Array<INotification>;
}

export const addNotification = createCustomAction(
  'notification/addNotification',
  (notificationContent: {
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    anchorOrigin?: INotificationAnchorOrigin;
  }) => ({
    notificationContent,
  }),
);
export const removeNotification = createCustomAction('notification/removeNotification', (id: string) => ({
  id,
}));
const actions = { addNotification, removeNotification };

type Action = ActionType<typeof actions>;

export default function reducer(state: NotificationState = { notifications: [] }, action: Action) {
  switch (action.type) {
    case getType(addNotification):
      const id = Date.now().toString();
      const defaultAnchorOrigin: INotificationAnchorOrigin = { vertical: 'top', horizontal: 'right' };
      const anchorOrigin = action.notificationContent.anchorOrigin
        ? action.notificationContent.anchorOrigin
        : defaultAnchorOrigin;
      const newNotification: INotification = { ...action.notificationContent, id, anchorOrigin };
      return { ...state, notifications: [...state.notifications, newNotification] };
    case getType(removeNotification):
      return { ...state, notifications: [...state.notifications].filter((item) => item.id !== action.id) };
    default:
      return state;
  }
}
