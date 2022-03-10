import { SnackbarOrigin } from "@mui/material";

export interface INotification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  anchorOrigin: INotificationAnchorOrigin
}
export interface INotificationAnchorOrigin extends SnackbarOrigin{

}